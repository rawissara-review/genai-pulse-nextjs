'use client';
export default function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #050e26 0%, #0a1535 50%, #0d1f45 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(0,163,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(59,79,216,0.08) 0%, transparent 60%)' }} />
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            background: 'rgba(255,255,255,' + (Math.random() * 0.5 + 0.1) + ')',
            animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
            animationDelay: Math.random() * 4 + 's',
          }}
        />
      ))}
      <style>{`@keyframes twinkle { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
    </div>
  );
}
