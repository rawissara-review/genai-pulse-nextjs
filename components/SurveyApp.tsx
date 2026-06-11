'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type FormData, INITIAL_FORM } from './types';
import Background from './Background';
import WelcomeScreen from './WelcomeScreen';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import ResultsScreen from './ResultsScreen';
import BackOfficeLogin from './BackOfficeLogin';
import BackOffice from './BackOffice';

async function saveResponse(data: FormData) {
  const id = Math.random().toString(36).slice(2, 10);
  const submittedAt = new Date().toISOString();
  const avg = (data.ratings.confidence + data.ratings.efficiency + data.ratings.prompt + data.ratings.teamSupport) / 4;
  const payload = {
    id, submittedAt,
    email: data.email, role: data.role,
    isAdvocate: data.isChampion ? 'เป็น' : 'ไม่ได้เป็น',
    tools: data.tools.join('; '),
    frequency: data.frequency, promptCount: data.promptCount,
    confidence: data.ratings.confidence, efficiency: data.ratings.efficiency,
    prompt: data.ratings.prompt, teamSupport: data.ratings.teamSupport,
    avgScore: parseFloat(avg.toFixed(2)),
    timeSaved: data.timeSaved, barriers: data.barriers.join('; '),
    freeText: data.freeText,
  };
  try {
    await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Sheets sync error:', err);
  }
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 72 : -72, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -72 : 72, opacity: 0 }),
};

type AdminView = 'closed' | 'login' | 'open';

export default function SurveyApp() {
  const [screen, setScreen] = useState(0);
  const [dir, setDir] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [adminView, setAdminView] = useState<AdminView>('closed');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [screen]);

  const goNext = (data?: Partial<FormData>) => {
    if (data) setFormData(prev => ({ ...prev, ...data }));
    setDir(1);
    setScreen(prev => Math.min(prev + 1, 5));
  };
  const goBack = () => { setDir(-1); setScreen(prev => Math.max(prev - 1, 0)); };

  const handleSubmit = (data: Partial<FormData>) => {
    const final = { ...formData, ...data };
    setFormData(final);
    saveResponse(final);
    setDir(1);
    setScreen(5);
  };

  const handleRestart = () => { setFormData(INITIAL_FORM); setDir(-1); setScreen(0); };

  if (adminView === 'login') {
    return (
      <div className="relative w-full min-h-screen">
        <Background />
        <div className="relative z-10 min-h-screen">
          <BackOfficeLogin onSuccess={() => setAdminView('open')} onCancel={() => setAdminView('closed')} />
        </div>
      </div>
    );
  }

  if (adminView === 'open') {
    return (
      <div className="relative w-full min-h-screen">
        <Background />
        <div className="relative z-10 min-h-screen">
          <BackOffice onClose={() => setAdminView('closed')} />
        </div>
      </div>
    );
  }

  const screens = [
    <WelcomeScreen key="welcome" onNext={email => goNext({ email })} onBackOffice={() => setAdminView('login')} />,
    <Step1 key="step1" formData={formData} onNext={d => goNext(d)} onBack={goBack} />,
    <Step2 key="step2" formData={formData} onNext={d => goNext(d)} onBack={goBack} />,
    <Step3 key="step3" formData={formData} onNext={d => goNext(d)} onBack={goBack} />,
    <Step4 key="step4" formData={formData} onSubmit={handleSubmit} onBack={goBack} />,
    <ResultsScreen key="results" formData={formData} onRestart={handleRestart} />,
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <Background />
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={screen} custom={dir} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-h-screen"
        >
          {screens[screen]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
