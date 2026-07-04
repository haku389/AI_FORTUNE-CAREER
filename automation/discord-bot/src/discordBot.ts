import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  AttachmentBuilder,
  ThreadChannel,
  TextChannel,
  Message,
  MessageReaction,
  User,
  PartialMessageReaction,
  PartialUser,
} from 'discord.js'
import {
  createBatch,
  createItem,
  getItemByDiscordMessageId,
  getItemByPromptMessageId,
  getItemsForBatch,
  isBatchFullyResolved,
  markBatchCompleted,
  resolveItem,
  setItemAwaitingText,
  setItemDiscordMessageId,
  getBatch,
  type ReviewItemInput,
} from './db.js'

const NOTIFY_THREAD_NAME = '投稿内容完了通知'
const ERROR_THREAD_NAME = '画像生成エラー'

const APPROVE_EMOJI = '🍓'
const REVISE_EMOJI = '🍇'
const REDO_EMOJI = '🍋'

const IMAGE_TYPE_LABEL: Record<'eyecatch' | 'body', string> = {
  eyecatch: 'アイキャッチ画像',
  body: '本文画像',
}

let notifyThreadCache: ThreadChannel | null = null
let errorThreadCache: ThreadChannel | null = null

export function createDiscordClient() {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.Channel],
  })
}

async function getOrCreateThread(channel: TextChannel, name: string): Promise<ThreadChannel> {
  const active = await channel.threads.fetchActive()
  const existingActive = active.threads.find((t) => t.name === name)
  if (existingActive) return existingActive

  const archived = await channel.threads.fetchArchived()
  const existingArchived = archived.threads.find((t) => t.name === name)
  if (existingArchived) {
    if (existingArchived.archived) await existingArchived.setArchived(false)
    return existingArchived
  }

  return channel.threads.create({
    name,
    autoArchiveDuration: 10080, // 7日間操作がなければ自動アーカイブ(再開時に自動で復帰させている)
  })
}

async function ensureThreads(client: Client, channelId: string) {
  const channel = (await client.channels.fetch(channelId)) as TextChannel
  if (!notifyThreadCache) notifyThreadCache = await getOrCreateThread(channel, NOTIFY_THREAD_NAME)
  if (!errorThreadCache) errorThreadCache = await getOrCreateThread(channel, ERROR_THREAD_NAME)
}

export async function postCompletionNotice(
  client: Client,
  channelId: string,
  title: string,
  message: string,
  url?: string
) {
  await ensureThreads(client, channelId)
  const lines = [`**${title}**`, message]
  if (url) lines.push(url)
  await notifyThreadCache!.send(lines.join('\n'))
}

export type ReviewBatchInput = {
  batchId: string
  articleTitle: string | null
  items: (ReviewItemInput & { imageBase64: string })[]
}

// カンマ区切りのDiscordユーザーID(数値)。設定されていればレビュー依頼時にメンションする。
const MENTION_USER_IDS = (process.env.MENTION_USER_IDS ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

export async function postReviewBatch(client: Client, channelId: string, batch: ReviewBatchInput) {
  await ensureThreads(client, channelId)
  createBatch(batch.batchId, batch.articleTitle)

  const mentions = MENTION_USER_IDS.map((id) => `<@${id}>`).join(' ')
  const introLines = [
    `${mentions ? mentions + '\n' : ''}:warning: 画像チェックでNGが${batch.items.length}件出ました。`,
    `記事タイトル：【${batch.articleTitle ?? '(不明)'}】`,
    '',
    '▼いずれかでリアクションをしてください。全件のリアクションが揃うまで、ワークフローは再開されません。',
    `- ${APPROVE_EMOJI}（このまま使う）`,
    `- ${REVISE_EMOJI}（修正指示して再生成）`,
    `- ${REDO_EMOJI}（指示なしで作り直す）`,
  ]
  await errorThreadCache!.send(introLines.join('\n'))

  for (const item of batch.items) {
    const itemId = `${batch.batchId}:${item.itemKey}`
    createItem(itemId, batch.batchId, item)

    const attachment = new AttachmentBuilder(Buffer.from(item.imageBase64, 'base64'), { name: `${item.itemKey}.png` })
    const msg = await errorThreadCache!.send({
      content: `▼${IMAGE_TYPE_LABEL[item.imageType]}\n理由: ${item.errorReason}`,
      files: [attachment],
    })
    setItemDiscordMessageId(itemId, msg.id)
    for (const emoji of [APPROVE_EMOJI, REVISE_EMOJI, REDO_EMOJI]) {
      await msg.react(emoji)
    }
  }
}

// n8n側はWaitノード(resume: timeInterval)で一定間隔ごとに
// GET /review-batch/:batchId/status をポーリングして完了を検知する
// (n8nのWait-on-webhook機能はトークン/署名/パス照合が複雑で、コンテナ間ネットワーク越しの
// 呼び出しと相性が悪く安定しなかったため、単純なポーリング方式に変更した)。
export function getBatchStatus(batchId: string): { resolved: boolean; decisions?: unknown[] } {
  if (!isBatchFullyResolved(batchId)) return { resolved: false }
  const batch = getBatch(batchId)
  if (!batch) return { resolved: false }

  const items = getItemsForBatch(batchId)
  const decisions = items.map((i) => ({
    itemKey: i.item_key,
    imageType: i.image_type,
    action: i.action,
    correctionText: i.correction_text,
  }))

  if (!batch.completed_at) {
    markBatchCompleted(batchId)
    if (errorThreadCache) {
      errorThreadCache
        .send(`✅ このバッチ(${items.length}件)の判定が揃いました。ワークフローが再開されます。`)
        .catch(() => {})
    }
  }

  return { resolved: true, decisions }
}

async function maybeCompleteBatch(_batchId: string) {
  // ポーリング方式に変更したため、リアクション受信時点では何もしない。
  // 完了通知・resolved判定は getBatchStatus() が次のポーリングで返す。
}

async function handleReactionAdd(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) {
  if (user.bot) return
  if (reaction.partial) await reaction.fetch().catch(() => null)
  const message = reaction.message

  const item = getItemByDiscordMessageId(message.id)
  if (!item || item.status !== 'pending') return

  const emojiName = reaction.emoji.name

  if (emojiName === APPROVE_EMOJI) {
    resolveItem(item.id, 'approve', null)
    await message.reply(`${APPROVE_EMOJI} 承認されました。このまま使用します。`)
    await maybeCompleteBatch(item.batch_id)
    return
  }

  if (emojiName === REDO_EMOJI) {
    resolveItem(item.id, 'redo', null)
    await message.reply(`${REDO_EMOJI} 指示なしで作り直します。`)
    await maybeCompleteBatch(item.batch_id)
    return
  }

  if (emojiName === REVISE_EMOJI) {
    const promptMsg = await (message as Message).reply(
      '🍇 このメッセージへの返信で、修正指示を送ってください。'
    )
    setItemAwaitingText(item.id, promptMsg.id)
    return
  }
}

async function handleMessageCreate(message: Message) {
  if (message.author.bot) return
  const refId = message.reference?.messageId
  if (!refId) return

  const item = getItemByPromptMessageId(refId)
  if (!item) return

  resolveItem(item.id, 'revise', message.content)
  await message.reply('🍇 修正指示を受け付けました。')
  await maybeCompleteBatch(item.batch_id)
}

export function registerHandlers(client: Client) {
  client.on(Events.MessageReactionAdd, (reaction, user) => {
    handleReactionAdd(reaction, user).catch((err) => console.error('[discord-bot] reaction handler error:', err))
  })
  client.on(Events.MessageCreate, (message) => {
    handleMessageCreate(message).catch((err) => console.error('[discord-bot] message handler error:', err))
  })
}
