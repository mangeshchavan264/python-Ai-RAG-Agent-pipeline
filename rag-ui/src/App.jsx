import { useState } from 'react';
import { Bot } from 'lucide-react';
import './App.css';
import Pipeline     from './components/Pipeline';
import ChatBox      from './components/ChatBox';
import HistoryTable from './components/HistoryTable';

export default function App() {
  const [activeStep,   setActiveStep]   = useState(null);
  const [refreshTick,  setRefreshTick]  = useState(0);

  function handleResult() {
    // bump tick so HistoryTable re-fetches
    setRefreshTick(t => t + 1);
  }

  return (
    <div className="app">

      {/* ── Header ── */}
      <div className="header">
        <div className="header-icon">
          <Bot size={22} color="#fff" />
        </div>
        <div>
          <h1>RAG <span>Agent</span></h1>
          <p>Retrieval-Augmented Generation · HR Knowledge Base</p>
        </div>
      </div>

      {/* ── Pipeline ── */}
      <Pipeline activeStep={activeStep} />

      {/* ── Chat ── */}
      <ChatBox onResult={handleResult} setActiveStep={setActiveStep} />

      {/* ── History / DB Table ── */}
      <HistoryTable refreshTick={refreshTick} />

    </div>
  );
}
