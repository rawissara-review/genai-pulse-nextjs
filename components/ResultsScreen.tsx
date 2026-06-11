'use client';
import type { FormData } from './types';
import SpaceBlueLogo from './SpaceBlueLogo';

// ─── Tip cards (Q1–Q4 + ALL_STRONG) ──────────────────────────────────────────
const TIP_CARDS = {
  Q1: {
    dimension: 'ความมั่นใจ',
    title: 'เพิ่มความมั่นใจในการใช้ AI',
    headline: 'เริ่มต้นทีละก้าว ความมั่นใจจะตามมาเอง',
    tips: [
      'เริ่มจาก task ง่ายๆ ที่ทำบ่อย เช่น สรุปประชุม หรือ draft email ก่อน',
      'ใช้ role prompting: "คุณเป็น [expert] ช่วยฉัน [task] หน่อย"',
      'ถ้าผลไม่ดี ให้ iterate ต่อได้เลย บอก AI ว่าอยากให้ปรับยังไง',
    ],
  },
  Q2: {
    dimension: 'Productivity',
    title: 'ปลดล็อกพลัง AI ให้ช่วยงานได้จริง',
    headline: 'AI ไม่ได้แค่ตอบคำถาม แต่ช่วยทำงานแทนได้เลย',
    tips: [
      'ลอง delegate งาน draft/summarize/research ให้ AI ทำก่อน แล้วค่อย edit',
      'ตั้ง routine: ก่อนทำงานใหม่ทุกครั้ง ถาม AI ว่า "มีวิธีทำให้เร็วขึ้นไหม"',
      'วัดผลจริง: จดเวลาก่อน/หลังใช้ AI เพื่อดูว่าประหยัดได้จริงแค่ไหน',
    ],
  },
  Q3: {
    dimension: 'Prompt Relevance',
    title: 'Prompt ให้ตรงงาน ผลลัพธ์ถึงจะใช้ได้จริง',
    headline: 'Prompt ที่ดี = บอก AI ว่าคุณเป็นใคร ทำอะไร อยากได้แบบไหน',
    tips: [
      'ระบุ role ของตัวเอง: "ฉันเป็น [BA/Dev/QA] กำลังทำ [งาน] ช่วย [สิ่งที่ต้องการ]"',
      'บอก format ที่ต้องการด้วยเสมอ: "ตอบเป็น bullet / table / สรุป 3 ข้อ"',
      'ถ้าได้คำตอบไม่ตรง ให้บอกเพิ่ม: "ปรับให้เหมาะกับ [context จริง] หน่อย"',
    ],
  },
  Q4: {
    dimension: 'Team Support',
    title: 'สร้าง AI Culture ในทีม',
    headline: 'เปลี่ยนทีมด้วยการแชร์ win เล็กๆ ให้ทุกคนเห็น',
    tips: [
      'แชร์ตัวอย่างที่ AI ช่วยได้จริงในที่ประชุม เช่น ประหยัดเวลาได้กี่ชั่วโมง',
      'ชวนหัวหน้า/ทีม ลอง AI ด้วยกัน 1 task เล็กๆ เพื่อให้เห็นของจริง',
      'สร้าง prompt template กลางให้ทีมใช้ร่วมกัน ลด learning curve ของทุกคน',
    ],
  },
  ALL_STRONG: {
    dimension: 'All Strong',
    title: 'คุณพร้อมแล้ว! 🎉',
    headline: 'ก้าวต่อไปคือการเป็น AI Champion ให้ทีม',
    tips: [
      'ลอง multi-step prompting หรือ AI agents สำหรับงานที่ซับซ้อนขึ้น',
      'สร้าง prompt library ของทีม เพื่อ standardize การใช้งานทั้งองค์กร',
      'Coach เพื่อนร่วมทีมที่ยังใช้ AI ไม่คล่อง แชร์ประสบการณ์ที่ได้ผลจริง',
    ],
  },
};

// Returns exactly 1 card: lowest dimension (Q1 priority on tie), or ALL_STRONG
function getSingleCard(r: FormData['ratings']) {
  if (r.confidence >= 5 && r.efficiency >= 5 && r.prompt >= 5 && r.teamSupport >= 5) {
    return TIP_CARDS.ALL_STRONG;
  }
  const scores: [string, number][] = [
    ['Q1', r.confidence],
    ['Q2', r.efficiency],
    ['Q3', r.prompt],
    ['Q4', r.teamSupport],
  ];
  const min = Math.min(...scores.map(([, v]) => v));
  const key = scores.find(([, v]) => v === min)![0]; // first = Q1 priority
  return TIP_CARDS[key as keyof typeof TIP_CARDS];
}

// ─── Q&A summary rows (exact questions from Excel) ───────────────────────────
function buildSummary(f: FormData) {
  return [
    {
      section: 'โปรไฟล์',
      rows: [
        { q: 'บทบาทหลักของคุณในทีมคืออะไร?',                        a: f.role || '—' },
        { q: 'คุณเป็น AI Advocate ในทีมไหม?',                        a: f.isChampion === null ? '—' : f.isChampion ? 'ใช่' : 'ไม่ใช่' },
        { q: 'ตอนนี้คุณเข้าถึง AI tools อะไรได้บ้าง?',               a: f.tools.length ? f.tools.join(', ') : '—' },
      ],
    },
    {
      section: 'การใช้งาน',
      rows: [
        { q: 'เดือนที่ผ่านมา คุณใช้ AI tools บ่อยแค่ไหน?',           a: f.frequency || '—' },
        { q: 'วันที่ใช้ AI tools คุณ prompt ไปกี่ครั้งโดยประมาณ?',   a: f.promptCount || '—' },
      ],
    },
    {
      section: 'คุณค่า & ความพึงพอใจ',
      rows: [
        { q: 'ฉันมั่นใจในการใช้ AI tools ได้อย่างมีประสิทธิภาพ',     a: `${f.ratings.confidence}/5`, score: f.ratings.confidence },
        { q: 'AI tools ช่วยให้ฉันทำงานได้เร็วและดีขึ้น',              a: `${f.ratings.efficiency}/5`, score: f.ratings.efficiency },
        { q: 'สิ่งที่ฉัน prompt ตรงกับงานจริงที่ทำอยู่',              a: `${f.ratings.prompt}/5`,     score: f.ratings.prompt },
        { q: 'หัวหน้าและทีมสนับสนุนให้ฉันใช้ AI tools',               a: `${f.ratings.teamSupport}/5`, score: f.ratings.teamSupport },
      ],
    },
    {
      section: 'เวลาที่ประหยัด',
      rows: [
        { q: 'คุณประหยัดเวลาได้กี่ชั่วโมงต่อสัปดาห์?',               a: f.timeSaved || '—' },
      ],
    },
  ];
}

function scoreColor(s?: number) {
  if (!s) return 'rgba(255,255,255,0.7)';
  if (s >= 4) return '#00D68F';
  if (s >= 3) return '#FFD166';
  return '#FF4D6A';
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props { formData: FormData; onRestart: () => void; }

export default function ResultsScreen({ formData, onRestart }: Props) {
  const card    = getSingleCard(formData.ratings);
  const summary = buildSummary(formData);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <SpaceBlueLogo size="sm" />
        <span className="text-xs text-white/40 tracking-wide hidden sm:block">
          GenAI Pulse Survey · แผนพัฒนาของคุณ
        </span>
      </div>

      <div className="flex-1 flex justify-center px-4 py-10">
        <div className="w-full max-w-xl space-y-6">

          {/* Title */}
          <h1
            className="text-center font-extrabold text-white"
            style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 'clamp(30px,5vw,48px)', letterSpacing: '0.02em' }}
          >
            ขอขอบคุณในความร่วมมือ
          </h1>

          {/* ── Single tip card ── */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(8,16,42,0.78)', border: '1px solid rgba(0,163,255,0.22)', backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span>⚡</span>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,163,255,0.12)', border: '1px solid rgba(0,163,255,0.35)', color: '#00D9FF', letterSpacing: '0.04em' }}
              >
                เคล็ดลับสำหรับคุณ · {card.dimension}
              </span>
            </div>
            <h2 className="text-white font-bold text-lg mb-1">{card.title}</h2>
            <p className="text-white/45 text-sm mb-5">{card.headline}</p>
            <ul className="space-y-3">
              {card.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/80 leading-relaxed">
                  <span className="text-[#00A3FF] mt-0.5 shrink-0">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Q&A summary ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(8,16,42,0.65)', border: '1px solid rgba(0,163,255,0.15)' }}
          >
            <div className="px-6 py-4 border-b border-white/5">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#00A3FF]">สรุปคำตอบของคุณ</p>
            </div>
            {summary.map(({ section, rows }) => (
              <div key={section} className="border-b border-white/5 last:border-0">
                <div className="px-6 py-2 bg-[rgba(0,163,255,0.05)]">
                  <p className="text-[11px] font-semibold text-white/40 tracking-wider uppercase">{section}</p>
                </div>
                <div className="divide-y divide-white/5">
                  {rows.map((row) => {
                    const score = 'score' in row ? row.score : undefined;
                    return (
                      <div key={row.q} className="flex items-start justify-between gap-4 px-6 py-3">
                        <p className="text-xs text-white/55 leading-relaxed flex-1">{row.q}</p>
                        <p
                          className="text-xs font-semibold text-right shrink-0 max-w-[45%]"
                          style={{ color: score !== undefined ? scoreColor(score) : 'rgba(255,255,255,0.8)' }}
                        >
                          {row.a}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)' }}
          >
            ส่งคำตอบใหม่
          </button>

          <p className="text-center text-xs text-white/25 pb-4">
            ข้อมูลของคุณถูกเก็บเพื่อใช้ในการวิเคราะห์ภายในทีมสนับสนุนเท่านั้น
          </p>
        </div>
      </div>
    </div>
  );
}
