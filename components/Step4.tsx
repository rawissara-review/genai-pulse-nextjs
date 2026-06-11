'use client';
import { useState } from 'react';
import type { FormData } from './types';
import { NavButtons } from './Step1';

const glass = 'bg-[rgba(10,21,53,0.8)] border border-[rgba(0,163,255,0.25)] rounded-2xl';
const chipBase = 'px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all border select-none';
const chipOff = `${chipBase} border-[rgba(0,163,255,0.2)] text-white/60 bg-[rgba(0,163,255,0.04)] hover:border-[rgba(0,163,255,0.4)]`;
const chipOn = `${chipBase} border-[#00A3FF] text-[#00E5FF] bg-[rgba(0,163,255,0.15)]`;

const TIME_OPTS = ['ไม่ได้ประหยัดเลย', 'น้อยกว่า 1 ชม/วัน', '1–2 ชม/วัน', '3–5 ชม/วัน', '5+ ชม/วัน'];
const BARRIERS = ['ขาด Training / ทักษะ', 'Tools ไม่เหมาะกับงาน', 'Security / Data Policy', 'ไม่มั่นใจในผลลัพธ์', 'ไม่มีเวลาทดลอง', 'ทีม / หัวหน้าไม่สนับสนุน', 'อื่นๆ'];

interface Props { formData: FormData; onSubmit: (d: Partial<FormData>) => void; onBack: () => void; }

export default function Step4({ formData, onSubmit, onBack }: Props) {
  const [timeSaved, setTimeSaved] = useState(formData.timeSaved);
  const [barriers, setBarriers] = useState<string[]>(formData.barriers);
  const [freeText, setFreeText] = useState(formData.freeText);
  const [followUp, setFollowUp] = useState(formData.followUp);

  const toggleBarrier = (b: string) =>
    setBarriers(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const canSubmit = !!timeSaved;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 pb-0"><ProgressBar step={4} /></div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-6">
          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">เวลาที่ AI ช่วยประหยัดต่อวัน (โดยประมาณ)</label>
            <div className="space-y-2">
              {TIME_OPTS.map(t => (
                <button key={t} onClick={() => setTimeSaved(t)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all ${timeSaved === t ? 'border-[#00A3FF] text-[#00E5FF] bg-[rgba(0,163,255,0.15)]' : 'border-[rgba(0,163,255,0.2)] text-white/60 hover:border-[rgba(0,163,255,0.4)]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">อุปสรรคในการใช้ AI (เลือกได้หลายข้อ)</label>
            <div className="flex flex-wrap gap-2">
              {BARRIERS.map(b => (
                <button key={b} onClick={() => toggleBarrier(b)} className={barriers.includes(b) ? chipOn : chipOff}>{b}</button>
              ))}
            </div>
          </div>

          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-3">ความคิดเห็นเพิ่มเติม (ไม่บังคับ)</label>
            <textarea
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              rows={3}
              placeholder="มีอะไรอยากแชร์เพิ่มเติมไหม?"
              className="w-full bg-[#0A1535] border border-[rgba(0,163,255,0.3)] rounded-xl px-4 py-3 text-white text-sm outline-none resize-none placeholder:text-white/25"
            />
          </div>

          <div className={`${glass} p-6`}>
            <label className="block text-[11px] tracking-widest uppercase text-[#00A3FF] font-semibold mb-4">อยากให้ทีม core contact มา follow-up ไหม?</label>
            <div className="flex gap-3">
              {[{ label: 'ใช่', value: true }, { label: 'ไม่ต้องการ', value: false }].map(opt => (
                <button key={String(opt.value)} onClick={() => setFollowUp(opt.value)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${followUp === opt.value ? 'border-[#00A3FF] text-[#00E5FF] bg-[rgba(0,163,255,0.15)]' : 'border-[rgba(0,163,255,0.2)] text-white/60 hover:border-[rgba(0,163,255,0.4)]'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <NavButtons onBack={onBack} onNext={() => onSubmit({ timeSaved, barriers, freeText, followUp })} canNext={canSubmit} />
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
