'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SeoArticle } from '@/lib/supabaseAdmin'
import { TAG_GROUPS, tagLabel } from '@/lib/articleTags'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  borderRadius: 8,
  border: '1px solid #2a3f72',
  background: '#070c1a',
  color: '#f0f4ff',
  fontSize: 14,
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#7888b8',
  marginBottom: 6,
}

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#5a6a9a',
  marginTop: 6,
  lineHeight: 1.6,
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? '画像のアップロードに失敗しました')
  return data.url as string
}

// ISO文字列 <-> <input type="datetime-local"> (YYYY-MM-DDTHH:mm, ブラウザのローカル時刻) の相互変換
function isoToDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function datetimeLocalToIso(value: string): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export default function ArticleForm({
  mode,
  initial,
}: {
  mode: 'new' | 'edit'
  initial?: SeoArticle
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? '')
  const [bodyMd, setBodyMd] = useState(initial?.body_md ?? '')
  const [eyecatchUrl, setEyecatchUrl] = useState(initial?.eyecatch_url ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [selectedByGroup, setSelectedByGroup] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const t of initial?.tags ?? []) {
      const group = TAG_GROUPS.find((g) => g.options.some((o) => o.value === t))
      if (group) map[group.name] = t
    }
    return map
  })
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>(initial?.status ?? 'draft')
  const [scheduledAt, setScheduledAt] = useState(isoToDatetimeLocal(initial?.scheduled_at ?? null))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingEyecatch, setUploadingEyecatch] = useState(false)
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false)

  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null)

  const addTag = (groupName: string, value: string) => {
    setSelectedByGroup((prev) => ({ ...prev, [groupName]: value }))
    if (!value || tags.includes(value)) return
    setTags((prev) => [...prev, value])
  }
  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((t) => t !== value))
    setSelectedByGroup((prev) => {
      const next = { ...prev }
      for (const [groupName, v] of Object.entries(next)) {
        if (v === value) delete next[groupName]
      }
      return next
    })
  }

  const handleEyecatchSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadingEyecatch(true)
    setError(null)
    try {
      const url = await uploadImage(file)
      setEyecatchUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました')
    } finally {
      setUploadingEyecatch(false)
    }
  }

  const handleBodyImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadingBodyImage(true)
    setError(null)
    try {
      const url = await uploadImage(file)
      const markdown = `![](${url})`
      const textarea = bodyTextareaRef.current
      if (textarea) {
        const start = textarea.selectionStart ?? bodyMd.length
        const end = textarea.selectionEnd ?? bodyMd.length
        const next = `${bodyMd.slice(0, start)}\n${markdown}\n${bodyMd.slice(end)}`
        setBodyMd(next)
      } else {
        setBodyMd((prev) => `${prev}\n${markdown}\n`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました')
    } finally {
      setUploadingBodyImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status === 'scheduled' && !scheduledAt) {
      setError('予約投稿には公開日時の指定が必要です')
      return
    }

    setSaving(true)
    setError(null)

    const payload = {
      title,
      slug,
      meta_description: metaDescription || null,
      body_md: bodyMd,
      eyecatch_url: eyecatchUrl || null,
      tags,
      status,
      scheduled_at: status === 'scheduled' ? datetimeLocalToIso(scheduledAt) : null,
    }

    try {
      const res =
        mode === 'new'
          ? await fetch('/api/admin/articles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/articles/${initial!.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error ?? '保存に失敗しました')
        setSaving(false)
        return
      }

      router.push('/admin/articles')
      router.refresh()
    } catch {
      setError('通信エラーが発生しました')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initial) return
    if (!confirm(`「${initial.title}」を削除します。よろしいですか？`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/articles/${initial.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? '削除に失敗しました')
        setDeleting(false)
        return
      }
      router.push('/admin/articles')
      router.refresh()
    } catch {
      setError('通信エラーが発生しました')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <label style={labelStyle}>タイトル</label>
        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label style={labelStyle}>スラッグ（URL: /column/xxx ・ 半角英数字とハイフンのみ）</label>
        <input
          style={inputStyle}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="example-article-slug"
          pattern="[a-z0-9-]+"
          required
        />
      </div>

      <div>
        <label style={labelStyle}>メタディスクリプション（検索結果に表示される説明文）</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />
      </div>

      <div>
        <label style={labelStyle}>アイキャッチ画像</label>
        {eyecatchUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={eyecatchUrl}
            alt=""
            style={{ width: '100%', maxWidth: 320, borderRadius: 8, marginBottom: 10, display: 'block' }}
          />
        )}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="file" accept="image/*" onChange={handleEyecatchSelect} disabled={uploadingEyecatch} />
          {uploadingEyecatch && <span style={{ fontSize: 12, color: '#7888b8' }}>アップロード中…</span>}
          {eyecatchUrl && !uploadingEyecatch && (
            <button
              type="button"
              onClick={() => setEyecatchUrl('')}
              style={{ fontSize: 11, color: '#ff8080', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              削除
            </button>
          )}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>本文（Markdown）</label>
          <label
            style={{
              fontSize: 11,
              color: '#a898f8',
              cursor: uploadingBodyImage ? 'default' : 'pointer',
            }}
          >
            {uploadingBodyImage ? 'アップロード中…' : '+ 画像を挿入'}
            <input
              type="file"
              accept="image/*"
              onChange={handleBodyImageSelect}
              disabled={uploadingBodyImage}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <textarea
          ref={bodyTextareaRef}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 420, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7 }}
          value={bodyMd}
          onChange={(e) => setBodyMd(e.target.value)}
          placeholder={'# 見出し\n\n本文をMarkdownで入力してください。'}
        />
        <div style={hintStyle}>カーソル位置に画像を挿入します。画像はアップロード後、本文中に `![](URL)` の形式で自動挿入されます。</div>
      </div>

      <div>
        <label style={labelStyle}>タグ（診断結果と記事を紐づけるレコメンド用）</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {TAG_GROUPS.map((group) => {
            const selected = selectedByGroup[group.name] ?? ''
            return (
              <select
                key={group.name}
                value={selected}
                onChange={(e) => addTag(group.name, e.target.value)}
                style={{
                  ...inputStyle,
                  flex: '1 1 180px',
                  width: 'auto',
                  color: selected ? '#f0c060' : '#7888b8',
                  borderColor: selected ? '#c8952a' : '#2a3f72',
                }}
              >
                <option value="">{group.name}を選択…</option>
                {group.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )
          })}
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#111c36',
                  border: '1px solid #2a3f72',
                  borderRadius: 20,
                  padding: '5px 12px',
                  fontSize: 12,
                  color: '#dde4f8',
                }}
              >
                {tagLabel(t)}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  style={{ background: 'none', border: 'none', color: '#ff8080', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: 0 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <div style={hintStyle}>選んだタグと一致する診断結果のページに、この記事が自動でおすすめ表示されます。</div>
      </div>

      <div>
        <label style={labelStyle}>公開ステータス</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['draft', 'scheduled', 'published'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              style={{
                flex: 1,
                padding: 11,
                borderRadius: 8,
                border: `1px solid ${status === s ? '#c8952a' : '#2a3f72'}`,
                background: status === s ? '#c8952a22' : 'transparent',
                color: status === s ? '#f0c060' : '#7888b8',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {s === 'draft' ? '下書き' : s === 'scheduled' ? '予約投稿' : '公開'}
            </button>
          ))}
        </div>

        {status === 'scheduled' && (
          <div style={{ marginTop: 10 }}>
            <label style={labelStyle}>公開日時</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={isoToDatetimeLocal(new Date().toISOString())}
              style={inputStyle}
              required
            />
            <div style={hintStyle}>
              指定した日時を過ぎると自動で公開されます。サイトへのアクセスが発生した時点で反映されるほか、1日1回のバッチ処理でも取りこぼしを回収します。
            </div>
          </div>
        )}
      </div>

      {error && <div style={{ color: '#ff8080', fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 8,
            border: 'none',
            background: saving ? '#5a4a20' : 'linear-gradient(135deg, #c8952a, #e0a830)',
            color: '#1a0c00',
            fontSize: 14,
            fontWeight: 700,
            cursor: saving ? 'default' : 'pointer',
          }}
        >
          {saving ? '保存中…' : mode === 'new' ? '作成する' : '保存する'}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '14px 18px',
              borderRadius: 8,
              border: '1px solid #ff808055',
              background: 'transparent',
              color: '#ff8080',
              fontSize: 13,
              cursor: deleting ? 'default' : 'pointer',
            }}
          >
            {deleting ? '削除中…' : '削除'}
          </button>
        )}
      </div>

      {mode === 'edit' && initial?.status === 'published' && (
        <a
          href={`/column/${initial.slug}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: '#a898f8', fontSize: 12 }}
        >
          → 公開ページを見る
        </a>
      )}
    </form>
  )
}
