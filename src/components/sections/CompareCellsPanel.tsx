import React from 'react';

export const CompareCellsPanel: React.FC = () => {
  return (
    <div className="panel-section">
      <h2 className="panel-title">مقارنة الخلايا</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
        قارن هذه الخلية مع أنواع أخرى لفهم أوجه التشابه والاختلاف في التركيب والوظيفة.
      </p>
      <button className="btn btn-primary" style={{ width: '100%' }}>
        فتح المقارنة
      </button>
    </div>
  );
};
