import express from 'express'
import type { Client } from 'discord.js'
import {
  postCompletionNotice,
  postReviewBatch,
  getBatchStatus,
  SEO_NOTIFY_THREAD_NAME,
  SNS_NOTIFY_THREAD_NAME,
  WORKFLOW_ERROR_THREAD_NAME,
  type ReviewBatchInput,
} from './discordBot.js'

// n8n側は短いキー('seo'/'sns'/'error')で送ってくる。実際のDiscordスレッド名はここでのみ管理し、
// ワークフロー側に日本語のスレッド名をハードコードしなくて済むようにしている。
const NOTIFY_THREAD_BY_KEY: Record<string, string> = {
  seo: SEO_NOTIFY_THREAD_NAME,
  sns: SNS_NOTIFY_THREAD_NAME,
  error: WORKFLOW_ERROR_THREAD_NAME,
}

export function createServer(client: Client, channelId: string) {
  const app = express()
  app.use(express.json({ limit: '20mb' }))

  app.post('/review-batch', async (req, res) => {
    const body = req.body as Partial<ReviewBatchInput>
    if (!body.batchId || !Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({ error: 'batchId, items（1件以上）は必須です' })
      return
    }
    const badIndex = body.items.findIndex((i) => !i.itemKey || !i.imageType || !i.imageBase64)
    if (badIndex !== -1) {
      res
        .status(400)
        .json({ error: `items[${badIndex}] に itemKey/imageType/imageBase64 のいずれかが欠けています（n8n側の送信データを確認してください）` })
      return
    }
    try {
      await postReviewBatch(client, channelId, body as ReviewBatchInput)
      res.json({ ok: true })
    } catch (err) {
      console.error('[discord-bot] /review-batch failed:', err)
      res.status(500).json({ error: String((err as Error)?.message ?? err) })
    }
  })

  // n8nがWaitノードで一定間隔ごとにポーリングして、レビューが完了したか・
  // 完了していればどう判定されたかを取得するためのエンドポイント。
  app.get('/review-batch/:batchId/status', (req, res) => {
    res.json(getBatchStatus(req.params.batchId))
  })

  app.post('/notify', async (req, res) => {
    const { title, message, url, thread } = req.body ?? {}
    if (!title || !message) {
      res.status(400).json({ error: 'title, message は必須です' })
      return
    }
    try {
      const threadName = thread ? (NOTIFY_THREAD_BY_KEY[thread] ?? thread) : undefined
      await postCompletionNotice(client, channelId, title, message, url, threadName)
      res.json({ ok: true })
    } catch (err) {
      console.error('[discord-bot] /notify failed:', err)
      res.status(500).json({ error: String((err as Error)?.message ?? err) })
    }
  })

  app.get('/health', (_req, res) => res.json({ ok: true }))

  return app
}
