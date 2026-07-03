'use client'

import { useEffect, useRef, useState } from 'react'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// value: "YYYY-MM-DDTHH:mm"（<input type="datetime-local">と同じローカル時刻表現）
function parseLocal(value: string): { y: number; m: number; d: number; hh: number; mm: number } {
  if (value) {
    const [datePart, timePart] = value.split('T')
    const [y, m, d] = datePart.split('-').map(Number)
    const [hh, mm] = (timePart ?? '00:00').split(':').map(Number)
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
      return { y, m: m - 1, d, hh: hh || 0, mm: mm || 0 }
    }
  }
  const now = new Date()
  return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate(), hh: now.getHours(), mm: now.getMinutes() }
}

function formatLocal(y: number, m: number, d: number, hh: number, mm: number): string {
  return `${y}-${pad(m + 1)}-${pad(d)}T${pad(hh)}:${pad(mm)}`
}

export default function DateTimePicker({
  value,
  onChange,
  placeholder = '日時を選択…',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const parsed = parseLocal(value)
  const [viewYear, setViewYear] = useState(parsed.y)
  const [viewMonth, setViewMonth] = useState(parsed.m)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const selectDay = (day: number) => {
    onChange(formatLocal(viewYear, viewMonth, day, parsed.hh, parsed.mm))
  }
  const changeTime = (hh: number, mm: number) => {
    onChange(formatLocal(parsed.y, parsed.m, parsed.d, hh, mm))
  }
  const goToday = () => {
    const now = new Date()
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    onChange(formatLocal(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()))
  }

  const displayLabel = value
    ? `${parsed.y}年${parsed.m + 1}月${parsed.d}日 ${pad(parsed.hh)}:${pad(parsed.mm)}`
    : placeholder

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => {
          setViewYear(parsed.y)
          setViewMonth(parsed.m)
          setOpen((v) => !v)
        }}
        style={{
          width: '100%',
          padding: '11px 13px',
          borderRadius: 8,
          border: '1px solid #2a3f72',
          background: '#070c1a',
          color: value ? '#f0f4ff' : '#7888b8',
          fontSize: 14,
          fontFamily: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        {displayLabel}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 20,
            background: '#0d1428',
            border: '1px solid #2a3f72',
            borderRadius: 10,
            padding: 14,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            width: 280,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewYear((y) => y - 1)
                  setViewMonth(11)
                } else {
                  setViewMonth((m) => m - 1)
                }
              }}
              style={navButtonStyle}
            >
              ‹
            </button>
            <div style={{ fontSize: 13, color: '#dde4f8', fontWeight: 700 }}>
              {viewYear}年{viewMonth + 1}月
            </div>
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewYear((y) => y + 1)
                  setViewMonth(0)
                } else {
                  setViewMonth((m) => m + 1)
                }
              }}
              style={navButtonStyle}
            >
              ›
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {WEEKDAYS.map((w) => (
              <div key={w} style={{ textAlign: 'center', fontSize: 11, color: '#5a6a9a', padding: '4px 0' }}>
                {w}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />
              const isSelected = value !== '' && viewYear === parsed.y && viewMonth === parsed.m && day === parsed.d
              return (
                <div
                  key={day}
                  onClick={() => selectDay(day)}
                  style={{
                    textAlign: 'center',
                    padding: '6px 0',
                    fontSize: 12,
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: isSelected ? '#f0c060' : '#dde4f8',
                    background: isSelected ? '#c8952a22' : 'transparent',
                  }}
                >
                  {day}
                </div>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid #1a2444',
            }}
          >
            <span style={{ fontSize: 11, color: '#7888b8' }}>時刻</span>
            <select value={parsed.hh} onChange={(e) => changeTime(Number(e.target.value), parsed.mm)} style={timeSelectStyle}>
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {pad(h)}
                </option>
              ))}
            </select>
            <span style={{ color: '#5a6a9a' }}>:</span>
            <select value={parsed.mm} onChange={(e) => changeTime(parsed.hh, Number(e.target.value))} style={timeSelectStyle}>
              {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                <option key={m} value={m}>
                  {pad(m)}
                </option>
              ))}
            </select>
            <button type="button" onClick={goToday} style={{ marginLeft: 'auto', fontSize: 11, color: '#a898f8', background: 'none', border: 'none', cursor: 'pointer' }}>
              今すぐ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const navButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#a898f8',
  fontSize: 18,
  cursor: 'pointer',
  padding: '0 8px',
}
const timeSelectStyle: React.CSSProperties = {
  background: '#070c1a',
  border: '1px solid #2a3f72',
  borderRadius: 6,
  color: '#f0f4ff',
  fontSize: 13,
  padding: '4px 6px',
}
