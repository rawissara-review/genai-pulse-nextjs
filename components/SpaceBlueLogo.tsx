'use client';

interface Props { size?: 'sm' | 'md' | 'lg' }

export default function SpaceBlueLogo({ size = 'md' }: Props) {
  const scale = { sm: 0.72, md: 1, lg: 1.4 }[size];
  return (
    <div style={{ display: 'inline-block', lineHeight: 1, userSelect: 'none' }}>
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        <div
          style={{
            color: '#FFFFFF',
            fontSize: `${22 * scale}px`,
            letterSpacing: '0.22em',
            display: 'flex',
            alignItems: 'center',
            gap: `${3 * scale}px`,
          }}
        >
          SPACE
        </div>
        <div
          style={{
            color: '#00D9FF',
            fontSize: `${13 * scale}px`,
            letterSpacing: '0.48em',
            marginTop: `${1 * scale}px`,
          }}
        >
          BLUE
        </div>
      </div>
    </div>
  );
}
