/**
 * 白石玲子が話している体裁にするための吹き出し（しっぽ付き）ラッパー。
 * 子要素（メッセージ本文の箱）の左上に、背景色を合わせた小さな三角形を重ねて
 * 「ここから発言している」ように見せる。
 */
export default function ReikoBubble({
  children,
  tailColor,
  tailLeft = 28,
}: {
  children: React.ReactNode
  /** 吹き出し本体の背景色に合わせる（グラデーションの場合は左上に近い色を指定） */
  tailColor: string
  /** しっぽの左端からの距離(px) */
  tailLeft?: number
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: -8,
          left: tailLeft,
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: `8px solid ${tailColor}`,
        }}
      />
      {children}
    </div>
  )
}
