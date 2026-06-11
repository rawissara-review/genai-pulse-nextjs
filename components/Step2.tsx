'use client';
import { useState } from 'react';
import type { FormData } from './types';
import { NavButtons } from './Step1';

const FREQ    = ['ทุกวัน', '3–4 วันต่อสัปดาห์', '1–2 วันต่อสัปดาห์', 'ลองใช้ครั้งเดียว', 'ยังไม่เคยใช้เลย'];
const PROMPTS = ['ไม่ได้ใช้', '1–2 ครั้ง', '3–5 ครั้ง', '6–10 ครั้ง', 'มากกว่า 10 ครั้ง'];

const glass = 'bg-[rgba(10,21,53,0.8)] border border-[rgba(0,163,255,0.25)] rounded-2xl';

interface Props { formData: FormData; onNext: (d: Partial<FormData>) => void; onBack: () => void; }

export default function Step2({ formData, onNext, onBack }: Props) {
  const [frequency, setFrequency]     = useState(formData.frequency);
  const [promptCount, setPromptCount] = useState(formData.promptCount);
  const canNext = !!frequency && !!promptCount;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 pb-0"><ProgressBar step={2} /></div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-5">

          <div className={`${glass} p-6`}>
            <p className="text-sm font-semibold text-white mb-4">เดือนที่ผ่านมา คุณใช้ AI tools บ่อยแค่ไหน?</p>
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
            <p className="text-sm font-semibold text-white mb-4">วันที่ใช้ AI tools คุณ prompt ไปกี่ครั้งโดยประมาณ?</p>
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
        {[1,2,3,4].map(i => <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? '#00A3FF' : 'rgba(0,163,255,0.2)' }} />)}
      </div>
    </div>
  );
}
