import React, { useState } from 'react';
import type { DiagnosticCase } from '../../data/cellsData';

interface DiagnosticCasesProps {
  cases: DiagnosticCase[];
}

export const DiagnosticCases: React.FC<DiagnosticCasesProps> = ({ cases }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  if (!cases || cases.length === 0) return null;

  const handleSelect = (caseId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [caseId]: optionIndex }));
    setShowExplanation(prev => ({ ...prev, [caseId]: true }));
  };

  return (
    <div className="panel-section">
      <h2 className="panel-title">حالات تشخيصية</h2>
      <div className="flex-col gap-4">
        {cases.map((c) => {
          const answered = selectedAnswers[c.id] !== undefined;
          const isCorrect = selectedAnswers[c.id] === c.correctAnswerIndex;
          
          return (
            <div key={c.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{c.scenario}</p>
              
              <div className="flex-col gap-2">
                {c.options.map((option, idx) => {
                  let btnClass = 'btn-outline';
                  if (answered) {
                    if (idx === c.correctAnswerIndex) btnClass = 'btn-primary'; // Highlight correct always
                    else if (idx === selectedAnswers[c.id]) btnClass = 'btn-outline'; // User picked wrong
                  }
                  
                  return (
                    <button 
                      key={idx}
                      className={`btn ${btnClass}`}
                      style={{ 
                        justifyContent: 'flex-start',
                        textAlign: 'right',
                        backgroundColor: answered && idx === selectedAnswers[c.id] && !isCorrect ? '#ffe3e3' : undefined,
                        borderColor: answered && idx === selectedAnswers[c.id] && !isCorrect ? '#ff8787' : undefined,
                        color: answered && idx === selectedAnswers[c.id] && !isCorrect ? '#e03131' : undefined,
                      }}
                      onClick={() => !answered && handleSelect(c.id, idx)}
                      disabled={answered}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showExplanation[c.id] && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  backgroundColor: isCorrect ? 'var(--color-accent-light)' : '#ffe3e3',
                  color: isCorrect ? '#087f5b' : '#c92a2a'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                    {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>{c.explanation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
