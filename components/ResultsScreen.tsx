'use client';
import { useEffect } from 'react';
import type { FormData } from './types';

interface Props { formData: FormData; onRestart: () => void; }

function getSegment(avg: number) {
  if (avg >= 4) return { label: 'Active User', color: '#00D68F', emoji: '🟢', msg: 'คุณเป็นผู้ใช้ AI ที่มีความเชี่ยวชาญสูง! ขอบคุณที่เป็นแบบอย่างให้ทีม' };
  if (avg >= 3) return { label: 'Moderate User', color: '#FFD166', emoji: '🟡', msg: 'คุณใช้ AI ได้ดีในระดับหนึ่ง ทีมจะช่วยเสริมทักษะให้คุณไปได้ไกลกว่านี้' };
  return { label: 'Growing User', color: '#FF4D6A', emoji: '🔴', msg: 'ขอบคุณที่แชร์ข้อมูล ทีม core จะช่วยหา training ที่เหมาะกับคุณ' };
}

export default function ResultsScreen({ formData, onRestart }: Props) {
  const { confidence, efficiency, prompt, teamSupport } = formData.ratings;
  const avg = (confidence + efficiency + prompt + teamSupport) / 4;
  const seg = getSegment(avg);

  useEffect(() => {
    if (typeof window !== 'undefined' && avg >= 4) {
      // fire confetti on high score
      const end = Date.now() + 1500;
      const colors = ['#00A3FF', '#00E5FF', '#00D68F'];
      const frame = () => {
        if (Date.now() > end) return;
        const r = Math.random;
        const el = document.createElement('canvas');
        el.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
        el.width = window.innerWidth; el.height = window.innerHeight;
        document.body.appendChild(el);
        const ctx = el.getContext('2d')!;
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = colors[i % colors.length];
          ctx.beginPath();
          ctx.rect(r() * window.innerWidth, -10, 8, 8);
          ctx.fill();
        }
        setTimeout(() => document.body.removeChild(el), 1400);
      };
      frame();
    }
  }, [avg]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="text-6xl mb-2">✅</div>

        <div>
          <h2 className="font-heading text-4xl font-extrabold text-white mb-2" style={{ letterSpacing: '0.02em' }}>
            ส่งแบบสำรวจแล้ว!
          </h2>
          <p className="text-white/55 text-sm">ขอบคุณที่สละเวลาตอบ</p>
        </div>

        <div className="bg-[rgba(10,21,53,0.85)] border border-[rgba(0,163,255,0.25)] rounded-2xl p-6">
          <p className="text-xs tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">คะแนนรวมของคุณ</p>
          <div className="text-6xl font-heading font-extrabold mb-2" style={{ color: seg.color, fontFamily: "'Barlow Condensed',sans-serif" }}>
            {avg.toFixed(1)}<span className="text-2xl text-white/30">/5</span>
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: `${seg.color}22`, border: `1px solid ${seg.color}66`, color: seg.color }}>
            {seg.emoji} {seg.label}
          </span>
          <p className="mt-4 text-sm text-white/65 leading-relaxed">{seg.msg}</p>
        </div>

        <div className="bg-[rgba(10,21,53,0.8)] border border-[rgba(0,163,255,0.2)] rounded-2xl p-5">
          <p className="text-xs tracking-widest uppercase text-[#00A3FF] font-semibold mb-3">คะแนนแต่ละด้าน</p>
          <div className="space-y-2">
            {[
              { label: 'ความมั่นใจ', val: confidence },
              { label: 'ประสิทธิภาพ', val: efficiency },
              { label: 'คุณภาพ Prompt', val: prompt },
              { label: 'ทีมสนับสนุน', val: teamSupport },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-white/45 w-28 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-[rgba(0,163,255,0.1)]">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(val / 5) * 100}%`, background: '#00A3FF' }} />
                </div>
                <span className="text-xs font-bold text-[#00E5FF] w-6 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onRestart} className="w-full py-3.5 rounded-xl border border-[rgba(0,163,255,0.3)] text-[#00A3FF] text-sm font-semibold hover:bg-[rgba(0,163,255,0.08)] transition-all">
          ← กลับหน้าแรก
        </button>
      </div>
    </div>
  );
}
