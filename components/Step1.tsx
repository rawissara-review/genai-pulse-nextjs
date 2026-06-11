'use client';
import { useState } from 'react';
import type { FormData } from './types';

const ROLES = ['Product Manager', 'Developer (Frontend)', 'Developer (Backend)', 'Developer (Fullstack)', 'Developer (Mobile)', 'Designer (UX/UI)', 'QA / Tester', 'Business Analyst', 'DevOps / SRE', 'Technical Lead', 'Scrum Master', 'อื่นๆ'];
const AI_TOOLS = ['GitHub Copilot', 'ChatGPT', 'Claude', 'Gemini', 'Cursor', 'Microsoft Copilot', 'อื่นๆ'];

const glass = 'bg-[rgba(10,21,53,0.8)] border border-[rgba(0,163,255,0.25)] rounded-2xl';
const chipBase = 'px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all border select-none';
const chipOff = `${chipBase} border-[rgba(0,163,255,0.2)] text-white/60 bg-[rgba(0,163,255,0.04)] hover:border-[rgba(0,163,255,0.4)]`;
const chipOn = `${chipBase} border-[#00A3FF] text-[#00E5FF] bg-[rgba(0,163,255,0.15)]`;

interface Props { formData: FormData; onNext: (d: Partial<FormData>) => void; onBack: () => void; }

export default function Step1({ formData, onNext, onBack }: Props) {
  const [role, setRole] = useState(formData.role);
  const [isChampion, setIsChampion] = useState<boolean | null>(formData.isChampion);
  const [tools, setTools] = useState<string[]>(formData.tools);

  const toggleTool = (t: string) =>
    setTools(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const canNext = !!role && isChampion !== null && tools.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 pb-0">
        <ProgressBar step={1} />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-6">
          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">บทบาทของคุณ</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(r => (
                <button key={r} onClick={() => setRole(r)} className={role === r ? chipOn : chipOff}>{r}</button>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">คุณเป็น AI Champion / Advocate ของทีมหรือไม่?</label>
            <div className="flex gap-3">
              {[{ label: 'เป็น', value: true }, { label: 'ไม่ได้เป็น', value: false }].map(opt => (
                <button key={String(opt.value)} onClick={() => setIsChampion(opt.value)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${isChampion === opt.value ? 'border-[#00A3FF] text-[#00E5FF] bg-[rgba(0,163,255,0.15)]' : 'border-[rgba(0,163,255,0.2)] text-white/60 hover:border-[rgba(0,163,255,0.4)]'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">AI Tools ที่ใช้อยู่ (เลือกได้หลายข้อ)</label>
            <div className="flex flex-wrap gap-2">
              {AI_TOOLS.map(t => (
                <button key={t} onClick={() => toggleTool(t)} className={tools.includes(t) ? chipOn : chipOff}>{t}</button>
              ))}
            </div>
          </div>

          <NavButtons onBack={onBack} onNext={() => onNext({ role, isChampion, tools })} canNext={canNext} />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-2">
      <p className="text-[11px] text-[#00A3FF] tracking-widest uppercase font-semibold mb-2">ขั้นตอนที่ {step} / 4</p>
      <div className="flex gap-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i <= step ? '#00A3FF' : 'rgba(0,163,255,0.2)' }} />
        ))}
      </div>
    </div>
  );
}

export function NavButtons({ onBack, onNext, canNext }: { onBack: () => void; onNext: () => void; canNext: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-white/15 text-white/55 text-sm font-medium hover:border-white/30 transition-all">
        ← ย้อนกลับ
      </button>
      <button onClick={onNext} disabled={!canNext} className="flex-[2] py-3 rounded-xl text-sm font-bold transition-all"
        style={{
          background: canNext ? 'linear-gradient(135deg, #00A3FF 0%, #3B4FD8 100%)' : 'rgba(255,255,255,0.08)',
          color: canNext ? '#fff' : 'rgba(255,255,255,0.25)',
          boxShadow: canNext ? '0 0 20px rgba(0,163,255,0.35)' : 'none',
          cursor: canNext ? 'pointer' : 'not-allowed',
        }}>
        ถัดไป →
      </button>
    </div>
  );
}
