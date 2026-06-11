'use client';

const ARC_COUNT = 22;
const FOCAL_X = 220;
const FOCAL_Y = 920;
const ARC_STEP = 75;
const ARC_START = 120;

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base navy */}
      <div className="absolute inset-0" style={{ background: '#05091b' }} />

      {/* Right-side blue ambient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 92% 48%, rgba(15,55,220,0.28) 0%, transparent 65%)',
        }}
      />

      {/* Arc lines + focal glow */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="focalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#b8f0ff" stopOpacity="1" />
            <stop offset="15%" stopColor="#40c8ff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#0080ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#001aff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="focalCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor="#80dfff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00aaff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric arc rings */}
        {Array.from({ length: ARC_COUNT }, (_, i) => {
          const r = ARC_START + i * ARC_STEP;
          const alpha = Math.max(0.025, 0.16 - i * 0.006);
          return (
            <circle
              key={i}
              cx={FOCAL_X}
              cy={FOCAL_Y}
              r={r}
              fill="none"
              stroke={`rgba(0,160,255,${alpha.toFixed(3)})`}
              strokeWidth="0.75"
            />
          );
        })}

        {/* Wide outer glow */}
        <ellipse cx={FOCAL_X} cy={FOCAL_Y} rx="320" ry="220" fill="url(#focalGrad)" opacity="0.55" />

        {/* Tight core glow */}
        <ellipse cx={FOCAL_X} cy={FOCAL_Y} rx="80" ry="55" fill="url(#focalCore)" opacity="0.85" />

        {/* Bright point */}
        <circle cx={FOCAL_X} cy={FOCAL_Y} r="7" fill="rgba(200,245,255,0.95)" />
        <circle cx={FOCAL_X} cy={FOCAL_Y} r="2.5" fill="white" />
      </svg>
    </div>
  );
}
