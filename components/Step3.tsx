'use client';
import { useState } from 'react';
import type { FormData } from './types';
import { NavButtons } from './Step1';

const glass = 'bg-[rgba(10,21,53,0.8)] border border-[rgba(0,163,255,0.25)] rounded-2xl';

// Exact questions from Excel — คุณค่า & ความพึงพอใจ
const QUESTIONS: { key: keyof FormData['ratings']; label: string }[] = [
  { key: 'confidence',   label: 'ฉันมั่นใจในการใช้ AI tools ได้อย่างมีประสิทธิภาพ' },
  { key: 'efficiency',   label: 'AI tools ช่วยให้ฉันทำงานได้เร็วและดีขึ้น' },
  { key: 'prompt',       label: 'สิ่งที่ฉัน prompt ตรงกับงานจริงที่ทำอยู่' },
  { key: 'teamSupport',  label: 'หัวหน้าและทีมสนับสนุนให้ฉันใช้ AI tools' },
];

interface Props { formData: FormData; onNext: (d: Partial<FormData>) => void; onBack: () => void; }

export default function Step3({ formData, onNext, onBack }: Props) {
  const [ratings, setRatings] = useState(formData.ratings);
  const canNext = Object.values(ratings).every(v => v > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 pb-0"><ProgressBar step={3} /></div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-4">
          <div className={`${glass} px-6 py-4`}>
            <p className="text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold">คุณค่า & ความพึงพอใจ</p>
            <p className="text-xs text-white/40 mt-1">ให้คะแนน 1 (น้อยมาก) — 5 (มากที่สุด)</p>
          </div>

          {QUESTIONS.map(({ key, label }) => (
            <div key={key} className={`${glass} p-5`}>
              <p className="text-sm font-medium text-white mb-4 leading-snug">{label}</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRatings(prev => ({ ...prev, [key]: n }))}
                    className="flex-1 h-11 rounded-xl text-sm font-bold border transition-all"
                    style={{
                      background:     n <= ratings[key] ? 'rgba(0,163,255,0.2)' : 'transparent',
                      borderColor:    n <= ratings[key] ? '#00A3FF' : 'rgba(0,163,255,0.2)',
                      color:          n <= ratings[key] ? '#00E5FF' : 'rgba(255,255,255,0.35)',
                    }}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-white/25">น้อยมาก</span>
                <span className="text-[10px] text-white/25">มากที่สุด</span>
              </div>
            </div>
          ))}

          <NavButtons onBack={onBack} onNext={() => onNext({ ratings })} canNext={canNext} />
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
