import { CheckCircle } from 'lucide-react';

const NODES = [
  {
    key: 'input',
    emoji: '💬',
    color: '#38bdf8',
    label: 'User Question',
    sub: 'Raw input',
  },
  {
    key: 'rewriter',
    emoji: '✏️',
    color: '#f59e0b',
    label: 'Query Rewriter',
    sub: 'query_rewriter.py',
  },
  {
    key: 'retriever',
    emoji: '🔍',
    color: '#6366f1',
    label: 'Retriever',
    sub: 'retriever.py · ChromaDB',
  },
  {
    key: 'reranker',
    emoji: '📊',
    color: '#e879f9',
    label: 'Reranker',
    sub: 'reranker.py · top-3',
  },
  {
    key: 'llm',
    emoji: '🤖',
    color: '#22c55e',
    label: 'LLM',
    sub: 'gpt-oss-120b · OpenRouter',
  },
  {
    key: 'answer',
    emoji: '✅',
    color: '#34d399',
    label: 'Response',
    sub: 'Grounded answer',
  },
];

export default function Pipeline({ activeStep }) {
  return (
    <div style={{ marginBottom: 40 }}>
      {/* Title */}
      <p style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
        RAG Pipeline
      </p>

      {/* Nodes row */}
      <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 8, gap: 0 }}>
        {NODES.map((node, i) => {
          const status =
            activeStep === null  ? 'idle'
            : i < activeStep     ? 'done'
            : i === activeStep   ? 'active'
            : 'idle';

          const borderColor =
            status === 'active' ? node.color
            : status === 'done' ? '#22c55e'
            : 'var(--border)';

          const glow =
            status === 'active'
              ? `0 0 18px ${node.color}55`
              : 'none';

          return (
            <div key={node.key} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Node card */}
              <div style={{
                flexShrink: 0,
                minWidth: 130,
                background: 'var(--surface)',
                border: `1.5px solid ${borderColor}`,
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: glow,
                transition: 'border-color .25s, box-shadow .25s',
              }}>
                {/* Step badge */}
                <span style={{
                  position: 'absolute', top: -9, right: -9,
                  width: 20, height: 20, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.6rem', fontWeight: 700,
                  background: status === 'done' ? '#22c55e' : status === 'active' ? node.color : 'var(--border)',
                  color: '#fff',
                  animation: status === 'active' ? 'pulse 1s infinite' : 'none',
                }}>
                  {status === 'done' ? <CheckCircle size={11} /> : i + 1}
                </span>

                {/* Icon */}
                <div style={{
                  fontSize: '1.4rem', lineHeight: 1,
                  marginBottom: 8,
                  filter: status === 'idle' ? 'grayscale(80%) opacity(.5)' : 'none',
                  transition: 'filter .25s',
                }}>
                  {node.emoji}
                </div>

                <div style={{ fontSize: '.78rem', fontWeight: 600, color: status === 'idle' ? 'var(--muted)' : 'var(--text)', marginBottom: 3 }}>
                  {node.label}
                </div>
                <div style={{ fontSize: '.65rem', color: 'var(--muted)', lineHeight: 1.3 }}>
                  {node.sub}
                </div>

                {/* Active pulse bar */}
                {status === 'active' && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    borderRadius: '0 0 12px 12px',
                    background: `linear-gradient(90deg, transparent, ${node.color}, transparent)`,
                    animation: 'shimmer 1.2s infinite',
                  }} />
                )}
              </div>

              {/* Arrow connector */}
              {i < NODES.length - 1 && (
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', width: 32, position: 'relative' }}>
                  <div style={{
                    flex: 1, height: 2,
                    background: i < (activeStep ?? -1)
                      ? `linear-gradient(90deg, #22c55e, #22c55e)`
                      : 'var(--border)',
                    transition: 'background .3s',
                  }} />
                  <div style={{
                    width: 0, height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderLeft: `6px solid ${i < (activeStep ?? -1) ? '#22c55e' : 'var(--border)'}`,
                    transition: 'border-left-color .3s',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step labels below */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {NODES.map((node, i) => {
          const status =
            activeStep === null ? 'idle'
            : i < activeStep    ? 'done'
            : i === activeStep  ? 'active'
            : 'idle';
          return (
            <span key={node.key} style={{
              fontSize: '.65rem', padding: '2px 8px', borderRadius: 99,
              background: status === 'active' ? `${node.color}22` : status === 'done' ? '#22c55e22' : 'var(--surface)',
              border: `1px solid ${status === 'active' ? node.color : status === 'done' ? '#22c55e' : 'var(--border)'}`,
              color: status === 'active' ? node.color : status === 'done' ? '#22c55e' : 'var(--muted)',
              fontWeight: 600,
              transition: 'all .25s',
            }}>
              {status === 'done' ? '✓ ' : status === 'active' ? '⟳ ' : ''}{node.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
