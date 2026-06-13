import React from 'react';
import { Microscope } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <Microscope size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
            استوديو الخلية
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
            استكشف الحياة على المستوى المجهري
          </p>
        </div>
      </div>
    </header>
  );
};
