'use client';
import { useState, useRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import SpaceBlueLogo from './SpaceBlueLogo';

const PASSWORD = 'squad1genaiforsdlc';

interface Props { onSuccess: () => void; onCancel: () => void; }

export default function BackOfficeLogin({ onSuccess, onCancel }: Props) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const attempt = () => {
    if (value === PASSWORD) { onSuccess(); return; }
    setError(true);
    setValue('');
    setTimeout(() => { setError(false); inputRef.current?.focus(); }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-10 flex justify-center"><SpaceBlueLogo /></div>

        <div className="w-16 h-16 rounded-full bg-[rgba(0,163,255,0.1)] border border-[rgba(0,163,255,0.35)] flex items-center justify-center mx-auto mb-6"
          style={{ boxShadow: '0 0 0 0 rgba(0,163,255,0.4)', animation: 'pulse-ring 2.5s ease-in-out infinite' }}>
          <Lock size={26} color="#00A3FF" />
        </div>

        <h2 className="font-heading text-3xl font-bold text-white mb-2" style={{ letterSpacing: '0.04em' }}>Back Office</h2>
        <p className="text-sm text-white/45 mb-8 leading-relaxed">สำหรับ Core Team เท่านั้น<br />กรุณาใส่รหัสผ่านเพื่อเข้าถึงข้อมูล</p>

        <div className="relative mb-3">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00A3FF]/50 pointer-events-none" />
          <input
            ref={inputRef}
            type={show ? 'text' : 'password'}
            value={value}
            autoFocus
            onChange={e => { setValue(e.target.value); setError(false); }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="รหัสผ่าน"
            className="w-full bg-[#0A1535] rounded-xl px-12 py-4 text-white text-sm outline-none transition-all"
            style={{ border: `1px solid ${error ? '#FF4D6A' : 'rgba(0,163,255,0.3)'}`, boxShadow: error ? '0 0 0 3px rgba(255,77,106,0.18)' : 'none' }}
          />
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="h-5 mb-4">
          {error && <p className="text-xs text-[#FF4D6A] font-medium">รหัสผ่านไม่ถูกต้อง ลองใหม่</p>}
        </div>

        <button onClick={attempt} disabled={!value}
          className="w-full py-4 rounded-xl font-bold text-sm mb-3 transition-all"
          style={{
            background: value ? 'linear-gradient(135deg, #00A3FF, #3B4FD8)' : 'rgba(255,255,255,0.08)',
            color: value ? '#fff' : 'rgba(255,255,255,0.25)',
            boxShadow: value ? '0 0 20px rgba(0,163,255,0.4)' : 'none',
            cursor: value ? 'pointer' : 'not-allowed',
          }}>
          เข้าสู่ระบบ →
        </button>

        <button onClick={onCancel} className="w-full py-3 rounded-xl border border-white/10 text-white/35 text-sm hover:text-white/60 hover:border-white/25 transition-all">
          ยกเลิก
        </button>
      </div>
      <style>{`@keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(0,163,255,0.4)} 50%{box-shadow:0 0 0 12px rgba(0,163,255,0)} }`}</style>
    </div>
  );
}
