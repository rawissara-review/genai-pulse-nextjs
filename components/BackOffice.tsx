'use client';
import { useState, useEffect, useCallback } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import type { StoredResponse } from './types';
import SpaceBlueLogo from './SpaceBlueLogo';

const glass = 'bg-[rgba(10,21,53,0.85)] border border-[rgba(0,163,255,0.25)] rounded-2xl';

type RatingKey = 'confidence' | 'efficiency' | 'prompt' | 'teamSupport';
const AXIS: Record<RatingKey, string> = { confidence: 'ความมั่นใจ', efficiency: 'ประสิทธิภาพ', prompt: 'Prompt', teamSupport: 'ทีมสนับสนุน' };

function getSegment(avg: number) {
  if (avg >= 4) return { label: 'Active User', color: '#00D68F', emoji: '🟢' };
  if (avg >= 3) return { label: 'Moderate User', color: '#FFD166', emoji: '🟡' };
  return { label: 'Low Adoption', color: '#FF4D6A', emoji: '🔴' };
}

function parseResponse(row: Record<string, unknown>): StoredResponse {
  return {
    id: String(row.id || Math.random().toString(36).slice(2)),
    submittedAt: String(row.submittedAt || ''),
    email: String(row.email || ''),
    role: String(row.role || ''),
    isChampion: row.isAdvocate === 'เป็น',
    tools: row.tools ? String(row.tools).split('; ').filter(Boolean) : [],
    frequency: String(row.frequency || ''),
    promptCount: String(row.promptCount || ''),
    ratings: {
      confidence: Number(row.confidence) || 0,
      efficiency: Number(row.efficiency) || 0,
      prompt: Number(row.prompt) || 0,
      teamSupport: Number(row.teamSupport) || 0,
    },
    timeSaved: String(row.timeSaved || ''),
    barriers: row.barriers ? String(row.barriers).split('; ').filter(Boolean) : [],
    freeText: String(row.freeText || ''),
    followUp: row.followUp === 'ใช่',
  };
}

function exportCSV(rows: StoredResponse[]) {
  const headers = ['เวลา','Email','บทบาท','Advocate','Tools','ความถี่','Prompt/วัน','ความมั่นใจ','ประสิทธิภาพ','Prompt','ทีม','เฉลี่ย','Segment','เวลาที่ประหยัด','อุปสรรค','ความคิดเห็น','Follow Up'];
  const body = rows.map(r => {
    const avg = (r.ratings.confidence + r.ratings.efficiency + r.ratings.prompt + r.ratings.teamSupport) / 4;
    return [new Date(r.submittedAt).toLocaleString('th-TH'), r.email, r.role, r.isChampion?'เป็น':'ไม่', r.tools.join(';'), r.frequency, r.promptCount, r.ratings.confidence, r.ratings.efficiency, r.ratings.prompt, r.ratings.teamSupport, avg.toFixed(2), getSegment(avg).label, r.timeSaved, r.barriers.join(';'), r.freeText, r.followUp?'ใช่':'ไม่'];
  });
  const csv = '﻿' + [headers,...body].map(row=>row.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
  a.download = `pulse-survey-${Date.now()}.csv`;
  a.click();
}

function exportExcel(rows: StoredResponse[]) {
  const data = rows.map(r => {
    const avg = (r.ratings.confidence + r.ratings.efficiency + r.ratings.prompt + r.ratings.teamSupport) / 4;
    return { 'เวลา': new Date(r.submittedAt).toLocaleString('th-TH'), Email: r.email, บทบาท: r.role, Advocate: r.isChampion?'เป็น':'ไม่', Tools: r.tools.join('; '), ความถี่: r.frequency, 'Prompt/วัน': r.promptCount, ความมั่นใจ: r.ratings.confidence, ประสิทธิภาพ: r.ratings.efficiency, Prompt: r.ratings.prompt, ทีม: r.ratings.teamSupport, เฉลี่ย: parseFloat(avg.toFixed(2)), Segment: getSegment(avg).label, 'เวลาที่ประหยัด': r.timeSaved, อุปสรรค: r.barriers.join('; '), ความคิดเห็น: r.freeText, 'Follow Up': r.followUp?'ใช่':'ไม่' };
  });
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = Object.keys(data[0]||{}).map(()=>({wch:20}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Survey');
  XLSX.writeFile(wb, `pulse-survey-${Date.now()}.xlsx`);
}

interface Props { onClose: () => void; }

export default function BackOffice({ onClose }: Props) {
  const [responses, setResponses] = useState<StoredResponse[]>([]);
  const [selected, setSelected] = useState<StoredResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResponses = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/survey?_t=${Date.now()}`);
      const json = await res.json();
      if (json.ok && json.responses) {
        const sorted = [...json.responses].sort((a:Record<string,unknown>,b:Record<string,unknown>) =>
          new Date(String(b.submittedAt)).getTime() - new Date(String(a.submittedAt)).getTime()
        );
        setResponses(sorted.map(parseResponse));
      } else {
        setError(json.error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (err) { setError(`Connection error: ${err}`); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchResponses(); }, [fetchResponses]);

  const clearAll = async () => {
    if (!confirm('ลบข้อมูลทั้งหมดใช่ไหม?')) return;
    await fetch('/api/survey', { method: 'DELETE' });
    setResponses([]); setSelected(null);
  };

  const totalAvg = responses.length
    ? responses.reduce((s,r) => s + (r.ratings.confidence+r.ratings.efficiency+r.ratings.prompt+r.ratings.teamSupport)/4, 0) / responses.length
    : 0;
  const segments = responses.reduce<Record<string,number>>((acc,r) => {
    const avg=(r.ratings.confidence+r.ratings.efficiency+r.ratings.prompt+r.ratings.teamSupport)/4;
    const seg=getSegment(avg).label; acc[seg]=(acc[seg]||0)+1; return acc;
  },{});

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <div className={`${glass} rounded-none border-l-0 border-r-0 border-t-0 px-6 py-4 flex items-center justify-between flex-wrap gap-3`}>
        <div className="flex items-center gap-4">
          <SpaceBlueLogo size="sm" />
          <div>
            <p className="text-[11px] tracking-widest uppercase text-[#00A3FF] font-bold">Back Office</p>
            <p className="text-xs text-white/45 mt-0.5">GenAI Pulse Survey · Dashboard</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {responses.length > 0 && (<>
            <button onClick={() => exportCSV(responses)} className="px-4 py-2 rounded-lg border border-[rgba(0,229,255,0.4)] text-[#00E5FF] text-xs font-semibold hover:bg-[rgba(0,229,255,0.08)] transition-all">⬇ CSV</button>
            <button onClick={() => exportExcel(responses)} className="px-4 py-2 rounded-lg border border-[rgba(0,214,143,0.4)] text-[#00D68F] text-xs font-semibold hover:bg-[rgba(0,214,143,0.08)] transition-all">⬇ Excel</button>
          </>)}
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/15 text-white/55 text-xs hover:border-white/30 transition-all">← กลับ</button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'ผู้ตอบทั้งหมด', value: responses.length, color: '#00A3FF' },
              { label: 'คะแนนเฉลี่ย', value: totalAvg > 0 ? totalAvg.toFixed(2)+'/5' : '—', color: '#00E5FF' },
              { label: '🟢 Active', value: segments['Active User']||0, color: '#00D68F' },
              { label: '🟡 Moderate', value: segments['Moderate User']||0, color: '#FFD166' },
              { label: '🔴 Low', value: segments['Low Adoption']||0, color: '#FF4D6A' },
            ].map(s => (
              <div key={s.label} className={`${glass} p-4`}>
                <p className="text-xs text-white/40 mb-1.5">{s.label}</p>
                <p className="font-heading text-3xl font-bold" style={{ color: s.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className={`${glass} p-5`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[11px] tracking-widest uppercase text-[#00A3FF] mb-1">โปรไฟล์</p>
                  <p className="font-semibold">{selected.email}</p>
                  <p className="text-xs text-white/45">{selected.role} · {new Date(selected.submittedAt).toLocaleString('th-TH')}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white/70 text-sm px-3 py-1 border border-white/15 rounded-lg">✕ ปิด</button>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={(Object.keys(AXIS) as RatingKey[]).map(k => ({ subject: AXIS[k], value: selected.ratings[k], fullMark: 5 }))}>
                      <PolarGrid stroke="rgba(0,163,255,0.2)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }} />
                      <Radar dataKey="value" stroke="#00A3FF" fill="#00A3FF" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {(Object.keys(AXIS) as RatingKey[]).map(k => (
                    <div key={k} className="bg-[rgba(0,163,255,0.06)] border border-[rgba(0,163,255,0.15)] rounded-xl p-3">
                      <p className="text-xs text-white/40 mb-2">{AXIS[k]}</p>
                      <div className="flex gap-1 items-center">
                        {[1,2,3,4,5].map(n=><div key={n} className="w-3 h-3 rounded-full" style={{ background: n<=selected.ratings[k]?'#00A3FF':'rgba(255,255,255,0.1)' }} />)}
                        <span className="ml-2 text-sm font-bold text-[#00E5FF]">{selected.ratings[k]}/5</span>
                      </div>
                    </div>
                  ))}
                  {selected.barriers.length > 0 && (
                    <div className="col-span-2 bg-[rgba(0,163,255,0.06)] border border-[rgba(0,163,255,0.15)] rounded-xl p-3">
                      <p className="text-xs text-white/40 mb-1">อุปสรรค</p>
                      <p className="text-xs text-white/75">{selected.barriers.join(' · ')}</p>
                    </div>
                  )}
                  {selected.freeText && (
                    <div className="col-span-2 bg-[rgba(0,163,255,0.06)] border border-[rgba(0,163,255,0.15)] rounded-xl p-3">
                      <p className="text-xs text-white/40 mb-1">ความคิดเห็น</p>
                      <p className="text-xs text-white/75 leading-relaxed">{selected.freeText}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className={`${glass} py-16 text-center`}>
              <p className="text-3xl mb-3">⏳</p>
              <p className="text-white/55 font-semibold">กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className={`${glass} p-8 border-[rgba(255,77,106,0.3)]`}>
              <p className="text-[#FF4D6A] font-semibold mb-2">⚠ เกิดข้อผิดพลาด</p>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">{error}</p>
              <p className="text-xs text-white/35 mb-4 leading-relaxed">ตรวจสอบว่า Google Apps Script ถูก deploy แล้ว (Who has access: Anyone) และ SHEETS_URL ถูกต้อง</p>
              <button onClick={fetchResponses} className="px-4 py-2 rounded-lg border border-[rgba(0,163,255,0.4)] text-[#00A3FF] text-sm font-semibold hover:bg-[rgba(0,163,255,0.08)] transition-all">ลองใหม่</button>
            </div>
          ) : responses.length === 0 ? (
            <div className={`${glass} py-16 text-center`}>
              <p className="text-3xl mb-3">📭</p>
              <p className="text-white/55 font-semibold">ยังไม่มีข้อมูล</p>
              <p className="text-xs text-white/30 mt-2">รอ user กรอกแบบสอบถามก่อนนะ</p>
            </div>
          ) : (
            <div className={`${glass} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(0,163,255,0.2)]">
                      {['#','เวลา','Email','บทบาท','Adv.','ความมั่นใจ','ประสิทธิภาพ','Prompt','ทีม','เฉลี่ย','Segment',''].map(h=>(
                        <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-white/40 font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((r, i) => {
                      const avg = (r.ratings.confidence+r.ratings.efficiency+r.ratings.prompt+r.ratings.teamSupport)/4;
                      const seg = getSegment(avg);
                      const isSelected = selected?.id === r.id;
                      return (
                        <tr key={r.id} onClick={() => setSelected(isSelected ? null : r)}
                          className="border-b border-[rgba(0,163,255,0.08)] cursor-pointer hover:bg-[rgba(0,163,255,0.04)] transition-colors"
                          style={{ background: isSelected ? 'rgba(0,163,255,0.08)' : 'transparent' }}>
                          <td className="px-4 py-3 text-white/30">{i+1}</td>
                          <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                            {new Date(r.submittedAt).toLocaleDateString('th-TH')}
                            <br /><span className="text-white/25">{new Date(r.submittedAt).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}</span>
                          </td>
                          <td className="px-4 py-3 font-medium">{r.email}</td>
                          <td className="px-4 py-3 text-white/70 whitespace-nowrap">{r.role}</td>
                          <td className="px-4 py-3 text-center">{r.isChampion ? <span className="text-[#00D68F] font-bold">✓</span> : <span className="text-white/20">—</span>}</td>
                          {(['confidence','efficiency','prompt','teamSupport'] as RatingKey[]).map(k=>(
                            <td key={k} className="px-4 py-3 text-center">
                              <span className="inline-flex w-7 h-7 rounded-full items-center justify-center font-bold text-xs"
                                style={{ background:'rgba(0,163,255,0.1)', border:'1px solid rgba(0,163,255,0.25)', color:'#00E5FF' }}>
                                {r.ratings[k]}
                              </span>
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center font-bold font-heading text-base" style={{ color: seg.color, fontFamily:"'Barlow Condensed',sans-serif" }}>{avg.toFixed(1)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background:`${seg.color}22`, border:`1px solid ${seg.color}55`, color: seg.color }}>
                              {seg.emoji} {seg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={e=>{e.stopPropagation();setSelected(isSelected?null:r)}}
                              className="px-3 py-1.5 rounded-lg border border-[rgba(0,163,255,0.3)] text-[#00A3FF] text-[11px] whitespace-nowrap hover:bg-[rgba(0,163,255,0.1)] transition-all">
                              {isSelected?'ปิด':'ดู'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-[rgba(0,163,255,0.1)] flex justify-between items-center">
                <span className="text-xs text-white/30">{responses.length} รายการ</span>
                <button onClick={clearAll} className="px-3 py-1.5 rounded-lg border border-[rgba(255,77,106,0.3)] text-[rgba(255,77,106,0.6)] text-xs hover:bg-[rgba(255,77,106,0.08)] transition-all">ลบข้อมูลทั้งหมด</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
