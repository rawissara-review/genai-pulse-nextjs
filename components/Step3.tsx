'use client';
import { useState } from 'react';
import type { FormData } from './types';
import { NavButtons } from './Step1';

const glass = 'bg-[rgba(10,21,53,0.8)] border border-[rgba(0,163,255,0.25)] rounded-2xl';

const RATINGS: { key: keyof FormData['ratings']; label: string; desc: string }[] = [
  { key: 'confidence', label: 'ความมั่นใจในการใช้ AI', desc: 'คุณรู้สึกมั่นใจแค่ไหนในการใช้ AI Tools ในงานประจำวัน' },
  { key: 'efficiency', label: 'ประสิทธิภาพการทำงาน', desc: 'AI Tools ช่วยให้คุณทำงานได้เร็วขึ้นหรือดีขึ้นแค่ไหน' },
  { key: 'prompt', label: 'คุณภาพ Prompt ที่เขียน', desc: 'คุณพอใจกับผลลัพธ์จาก Prompt ที่เขียนแค่ไหน' },
  { key: 'teamSupport', label: 'การสนับสนุนจากทีม', desc: 'ทีมและหัวหน้าสนับสนุนการใช้ AI แค่ไหน' },
];

interface Props { formData: FormData; onNext: (d: Partial<FormData>) => void; onBack: () => void; }

export default function Step3({ formData, onNext, onBack }: Props) {
  const [ratings, setRatings] = useState(formData.ratings);
  const canNext = Object.values(ratings).every(v => v > 0);

  const setRating = (key: keyof typeof ratings, val: number) =>
    setRatings(prev => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 pb-0"><ProgressBar step={3} /></div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-4">
          {RATINGS.map(({ key, label, desc }) => (
            <div key={key} className={`${glass} p-5`}>
              <p className="text-sm font-semibold text-white mb-1">{label}</p>
              <p className="text-xs text-white/45 mb-4">{desc}</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(key, n)}
                    className="flex-1 h-10 rounded-lg text-sm font-bold border transition-all"
                    style={{
                      background: n <= ratings[key] ? 'rgba(0,163,255,0.2)' : 'transparent',
                      borderColor: n <= ratings[key] ? '#00A3FF' : 'rgba(0,163,255,0.2)',
                      color: n <= ratings[key] ? '#00E5FF' : 'rgba(255,255,255,0.4)',
                    }}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-white/30">น้อยมาก</span>
                <span className="text-[10px] text-white/30">มากที่สุด</span>
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
        {[1,2,3,4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i <= step ? '#00A3FF' : 'rgba(0,163,255,0.2)' }} />
        ))}
      </div>
    </div>
  );
}
