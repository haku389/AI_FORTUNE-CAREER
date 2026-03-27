import Image from 'next/image'

export default function MoonImage() {
  return (
    <div
      className="fixed z-0 pointer-events-none"
      style={{
        top: -16,
        left: '50%',
        width: 260,
        height: 260,
        transform: 'translateX(-50%)',
        mixBlendMode: 'screen',
        animation: 'moon-rise 1.4s cubic-bezier(.2,0,.3,1) forwards',
      }}
    >
      <Image
        src="/moon.png"
        alt=""
        width={260}
        height={260}
        priority
        style={{
          width: '100%',
          height: '100%',
          filter:
            'brightness(1.1) contrast(1.05) saturate(1.15) drop-shadow(0 0 30px #c8952aaa) drop-shadow(0 0 70px #c8952a66) drop-shadow(0 0 130px #c8952a33)',
        }}
      />
    </div>
  )
}
