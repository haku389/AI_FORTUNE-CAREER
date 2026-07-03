'use client'

import { useEffect, useRef, useState } from 'react'

export default function TagGroupDropdown({
  groupName,
  options,
  selectedValues,
  onToggle,
}: {
  groupName: string
  options: { value: string; label: string }[]
  selectedValues: string[]
  onToggle: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const selectedLabels = options.filter((o) => selectedValues.includes(o.value)).map((o) => o.label)
  const hasSelection = selectedLabels.length > 0

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          padding: '11px 13px',
          borderRadius: 8,
          border: `1px solid ${hasSelection ? '#c8952a' : '#2a3f72'}`,
          background: '#070c1a',
          color: hasSelection ? '#f0c060' : '#7888b8',
          fontSize: 14,
          fontFamily: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {hasSelection ? `${groupName}（${selectedLabels.length}件選択中）` : `${groupName}を選択…`}
        </span>
        <span style={{ fontSize: 10, color: '#5a6a9a', flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 20,
            background: '#0d1428',
            border: '1px solid #2a3f72',
            borderRadius: 8,
            maxHeight: 260,
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value)
            return (
              <div
                key={opt.value}
                onClick={() => onToggle(opt.value)}
                style={{
                  padding: '9px 13px',
                  fontSize: 13,
                  color: isSelected ? '#f0c060' : '#dde4f8',
                  background: isSelected ? '#c8952a22' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    border: `1px solid ${isSelected ? '#f0c060' : '#3a4f82'}`,
                    background: isSelected ? '#f0c060' : 'transparent',
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    color: '#1a0c00',
                  }}
                >
                  {isSelected ? '✓' : ''}
                </span>
                {opt.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
