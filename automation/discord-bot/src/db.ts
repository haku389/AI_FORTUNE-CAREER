import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const DB_PATH = process.env.DB_PATH ?? './data/review.db'
mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS review_batches (
    id TEXT PRIMARY KEY,
    article_title TEXT,
    created_at TEXT NOT NULL,
    completed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS review_items (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES review_batches(id),
    item_key TEXT NOT NULL,
    image_type TEXT NOT NULL,
    error_reason TEXT,
    discord_message_id TEXT,
    prompt_message_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    action TEXT,
    correction_text TEXT,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS review_items_batch_id_idx ON review_items (batch_id);
  CREATE INDEX IF NOT EXISTS review_items_discord_message_id_idx ON review_items (discord_message_id);
  CREATE INDEX IF NOT EXISTS review_items_prompt_message_id_idx ON review_items (prompt_message_id);
`)

export type ReviewItemInput = {
  itemKey: string
  imageType: 'eyecatch' | 'body'
  errorReason: string
}

export type ReviewItemRow = {
  id: string
  batch_id: string
  item_key: string
  image_type: 'eyecatch' | 'body'
  error_reason: string | null
  discord_message_id: string | null
  prompt_message_id: string | null
  status: 'pending' | 'awaiting_text' | 'resolved'
  action: 'approve' | 'revise' | 'redo' | null
  correction_text: string | null
  created_at: string
}

export type ReviewBatchRow = {
  id: string
  article_title: string | null
  created_at: string
  completed_at: string | null
}

// n8nがexecutionをretryすると同じbatchIdで再送されてくることがあるため、
// 既存の同IDバッチ(前回失敗時の中途半端な状態を含む)があれば消してから作り直す。
export function createBatch(id: string, articleTitle: string | null): void {
  db.prepare('DELETE FROM review_items WHERE batch_id = ?').run(id)
  db.prepare('DELETE FROM review_batches WHERE id = ?').run(id)
  db.prepare('INSERT INTO review_batches (id, article_title, created_at) VALUES (?, ?, ?)').run(
    id,
    articleTitle,
    new Date().toISOString()
  )
}

export function createItem(id: string, batchId: string, input: ReviewItemInput): void {
  db.prepare(
    'INSERT INTO review_items (id, batch_id, item_key, image_type, error_reason, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, batchId, input.itemKey, input.imageType, input.errorReason, new Date().toISOString())
}

export function setItemDiscordMessageId(id: string, messageId: string): void {
  db.prepare('UPDATE review_items SET discord_message_id = ? WHERE id = ?').run(messageId, id)
}

export function setItemAwaitingText(id: string, promptMessageId: string): void {
  db.prepare("UPDATE review_items SET status = 'awaiting_text', prompt_message_id = ? WHERE id = ?").run(
    promptMessageId,
    id
  )
}

export function resolveItem(id: string, action: 'approve' | 'revise' | 'redo', correctionText: string | null): void {
  db.prepare(
    "UPDATE review_items SET status = 'resolved', action = ?, correction_text = ? WHERE id = ?"
  ).run(action, correctionText, id)
}

export function getItemByDiscordMessageId(messageId: string): ReviewItemRow | undefined {
  return db.prepare('SELECT * FROM review_items WHERE discord_message_id = ?').get(messageId) as
    | ReviewItemRow
    | undefined
}

export function getItemByPromptMessageId(messageId: string): ReviewItemRow | undefined {
  return db.prepare("SELECT * FROM review_items WHERE prompt_message_id = ? AND status = 'awaiting_text'").get(
    messageId
  ) as ReviewItemRow | undefined
}

export function getBatch(batchId: string): ReviewBatchRow | undefined {
  return db.prepare('SELECT * FROM review_batches WHERE id = ?').get(batchId) as ReviewBatchRow | undefined
}

export function getItemsForBatch(batchId: string): ReviewItemRow[] {
  return db.prepare('SELECT * FROM review_items WHERE batch_id = ?').all(batchId) as ReviewItemRow[]
}

export function isBatchFullyResolved(batchId: string): boolean {
  const row = db
    .prepare("SELECT COUNT(*) AS pending FROM review_items WHERE batch_id = ? AND status != 'resolved'")
    .get(batchId) as { pending: number }
  return row.pending === 0
}

export function markBatchCompleted(batchId: string): void {
  db.prepare('UPDATE review_batches SET completed_at = ? WHERE id = ?').run(new Date().toISOString(), batchId)
}
