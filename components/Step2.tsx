'use client';
import { useState } from 'react';
import type { FormData } from './types';
import { NavButtons } from './Step1';

const FREQ = ['ทุกวัน', '3–4 ครั้ง/สัปดาห์', '1–2 ครั้ง/สัปดาห์', 'น้อยกว่า 1 ครั้ง/สัปดาห์', 'ไม่ได้ใช้เลย'];
const PROMPTS = ['1–5 ครั้ง', '6–10 ครั้ง', '11–20 ครั้ง', '20+ ครั้ง'];

const glass = 'bg-[rgba(10,21,53,0.8)] border border-[rgba(0,163,255,0.25)] rounded-2xl';

interface Props { formData: FormData; onNext: (d: Partial<FormData>) => void; onBack: () => void; }

export default function Step2({ formData, onNext, onBack }: Props) {
  const [frequency, setFrequency] = useState(formData.frequency);
  const [promptCount, setPromptCount] = useState(formData.promptCount);
  const canNext = !!frequency && !!promptCount;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 pb-0"><ProgressBar step={2} /></div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-6">
          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">ความถี่ในการใช้ AI Tools ต่อสัปดาห์</label>
            <div className="space-y-2">
              {FREQ.map(f => (
                <button key={f} onClick={() => setFrequency(f)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all ${frequency === f ? 'border-[#00A3FF] text-[#00E5FF] bg-[rgba(0,163,255,0.15)]' : 'border-[rgba(0,163,255,0.2)] text-white/60 hover:border-[rgba(0,163,255,0.4)]'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">จำนวน Prompt ที่พิมพ์ต่อวัน (โดยเฉลี่ย)</label>
            <div className="grid grid-cols-2 gap-2">
              {PROMPTS.map(p => (
                <button key={p} onClick={() => setPromptCount(p)}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all ${promptCount === p ? 'border-[#00A3FF] text-[#00E5FF] bg-[rgba(0,163,255,0.15)]' : 'border-[rgba(0,163,255,0.2)] text-white/60 hover:border-[rgba(0,163,255,0.4)]'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <NavButtons onBack={onBack} onNext={() => onNext({ frequency, promptCount })} canNext={canNext} />
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
