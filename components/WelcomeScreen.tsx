'use client';
import { useState } from 'react';
import SpaceBlueLogo from './SpaceBlueLogo';

const glass = 'bg-[rgba(10,21,53,0.8)] border border-[rgba(0,163,255,0.25)] rounded-2xl backdrop-blur-sm';

interface Props { onNext: (email: string) => void; onBackOffice: () => void; }

export default function WelcomeScreen({ onNext, onBackOffice }: Props) {
  const [email, setEmail] = useState('');
  const ADMIN = 'squad1genaiforsdlc';
  const isAdmin = email === ADMIN;
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (isAdmin) { onBackOffice(); return; }
    if (valid) onNext(email);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 md:p-10">
        <SpaceBlueLogo />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <span className="inline-block border border-[rgba(0,163,255,0.45)] rounded-full px-4 py-1.5 text-[11px] tracking-widest uppercase text-[#00A3FF] bg-[rgba(0,163,255,0.08)]">
              GenAI for SDLC
            </span>
          </div>

          <h1 className="font-heading text-[44px] font-extrabold text-white leading-tight mb-4" style={{ letterSpacing: '0.02em' }}>
            GenAI Pulse Survey
          </h1>

          <p className="text-base text-white/70 leading-relaxed mb-9">
            ตอบแค่ 3 นาที ช่วยให้ทีม core team ปรับ tools และ training
            <br />ให้ตรงกับงานจริงของคุณมากขึ้น 🙌
          </p>

          <div className={`${glass} p-6 mb-4`}>
            <label className="block text-[13px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-3">
              อีเมลของคุณ
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="yourname@company.com"
              className="w-full bg-[#0A1535] rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
              style={{ border: `1px solid ${valid ? '#00E5FF' : 'rgba(0,163,255,0.3)'}` }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!valid && !isAdmin}
            className="w-full py-4 rounded-xl font-bold text-base transition-all"
            style={{
              background: (valid || isAdmin) ? 'linear-gradient(135deg, #00A3FF 0%, #3B4FD8 100%)' : 'rgba(255,255,255,0.08)',
              color: (valid || isAdmin) ? '#fff' : 'rgba(255,255,255,0.25)',
              boxShadow: (valid || isAdmin) ? '0 0 24px rgba(0,163,255,0.45)' : 'none',
              cursor: (valid || isAdmin) ? 'pointer' : 'not-allowed',
            }}
          >
            เริ่มเลย →
          </button>

          <p className="text-center text-xs text-white/35 mt-4 leading-relaxed">
            ข้อมูลของคุณถูกเก็บเพื่อใช้ในการวิเคราะห์ภายในทีมสนับสนุนเท่านั้น
          </p>
        </div>
      </div>
    </div>
  );
}
