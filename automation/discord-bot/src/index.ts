import { Events } from 'discord.js'
import { createDiscordClient, registerHandlers } from './discordBot.js'
import { createServer } from './server.js'

const token = process.env.DISCORD_BOT_TOKEN
const channelId = process.env.DISCORD_CHANNEL_ID
const port = Number(process.env.PORT ?? 3100)

if (!token) throw new Error('DISCORD_BOT_TOKEN が設定されていません')
if (!channelId) throw new Error('DISCORD_CHANNEL_ID が設定されていません')

const client = createDiscordClient()
registerHandlers(client)

client.once(Events.ClientReady, (c) => {
  console.log(`[discord-bot] ログイン完了: ${c.user.tag}`)

  const app = createServer(client, channelId)
  app.listen(port, () => {
    console.log(`[discord-bot] HTTPサーバー起動: port ${port}`)
  })
})

client.login(token)
