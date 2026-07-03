'use client'

import { useEffect, useRef, useState } from 'react'

export default function TagGroupDropdown({
  groupName,
  options,
  selectedValue,
  onSelect,
}: {
  groupName: string
  options: { value: string; label: string }[]
  selectedValue: string
  onSelect: (value: string) => void
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

  const selectedLabel = options.find((o) => o.value === selectedValue)?.label

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: '1 1 180px' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          padding: '11px 13px',
          borderRadius: 8,
          border: `1px solid ${selectedValue ? '#c8952a' : '#2a3f72'}`,
          background: '#070c1a',
          color: selectedValue ? '#f0c060' : '#7888b8',
          fontSize: 14,
          fontFamily: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{selectedLabel ?? `${groupName}を選択…`}</span>
        <span style={{ fontSize: 10, color: '#5a6a9a', marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
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
          <div
            onClick={() => {
              onSelect('')
              setOpen(false)
            }}
            style={{
              padding: '9px 13px',
              fontSize: 12,
              color: '#5a6a9a',
              cursor: 'pointer',
              borderBottom: '1px solid #1a2444',
            }}
          >
            （選択解除）
          </div>
          {options.map((opt) => {
            const isSelected = opt.value === selectedValue
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value)
                  setOpen(false)
                }}
                style={{
                  padding: '9px 13px',
                  fontSize: 13,
                  color: isSelected ? '#f0c060' : '#dde4f8',
                  background: isSelected ? '#c8952a22' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
