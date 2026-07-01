import { useState } from 'react';
import { Send, ChevronDown, ChevronUp, MessageSquare, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:8000';

// 6 pipeline steps: input → rewriter → retriever → reranker → llm → answer
const STEP_COUNT = 6;
const STEP_LABELS = [
  'Reading question…',
  'Rewriting query…',
  'Searching ChromaDB…',
  'Reranking chunks…',
  'Generating answer…',
  'Done ✓',
];

export default function ChatBox({ onResult, setActiveStep }) {
  const [question, setQuestion]     = useState('');
  const [loading,  setLoading]      = useState(false);
  const [stepLabel, setStepLabel]   = useState('');
  const [result,   setResult]       = useState(null);
  const [error,    setError]        = useState(null);
  const [showSrc,  setShowSrc]      = useState(false);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function animatePipeline(onDone) {
    for (let i = 0; i < STEP_COUNT; i++) {
      setActiveStep(i);
      setStepLabel(STEP_LABELS[i]);
      await sleep(400);
    }
    onDone();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setShowSrc(false);
    setStepLabel(STEP_LABELS[0]);

    // resolve when animation completes
    const animDone = new Promise(resolve => animatePipeline(resolve));

    try {
      const [{ data }] = await Promise.all([
        axios.post(`${API}/chat`, { question }),
        animDone,
      ]);
      setResult(data);
      setActiveStep(STEP_COUNT - 1);
      setStepLabel('Done ✓');
      onResult();
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Request failed');
      setActiveStep(null);
      setStepLabel('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-section">
      <h2><MessageSquare size={16} /> Ask the HR Assistant</h2>

      <form className="input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. What is the leave policy?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button className="btn btn-primary" type="submit" disabled={loading || !question.trim()}>
          {loading ? <span className="spinner" /> : <Send size={15} />}
          {loading ? stepLabel : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="error-box">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {result && (
        <div className="answer-card">
          {/* Pipeline steps used */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {['Query Rewriter', 'Retriever', 'Reranker', 'LLM'].map(step => (
              <span key={step} style={{
                fontSize: '.65rem', padding: '2px 8px', borderRadius: 99,
                background: 'rgba(99,102,241,.15)', border: '1px solid rgba(99,102,241,.4)',
                color: '#818cf8', fontWeight: 600,
              }}>✓ {step}</span>
            ))}
          </div>

          <div className="label">Question</div>
          <div className="q-text">{result.question}</div>

          <div className="label">Answer</div>
          <div className="a-text">{result.answer}</div>

          <button className="sources-toggle" onClick={() => setShowSrc(v => !v)}>
            {showSrc ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showSrc ? 'Hide' : 'Show'} {result.sources?.length} reranked chunks
          </button>

          {showSrc && (
            <div className="sources-list">
              {result.sources.map(([chunkLabel, content], i) => (
                <div className="source-item" key={i}>
                  <div className="chunk-label">{chunkLabel}</div>
                  <div className="chunk-text">{content.replace('Content: ', '')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
