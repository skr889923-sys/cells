import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Organelle } from '../../data/cellsData';

interface InfoPanelProps {
  organelle: Organelle | null;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ organelle }) => {
  if (!organelle) {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        اضغط على أي جزء من الخلية لعرض معلوماته هنا
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={organelle.id}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-panel" 
        style={{ padding: '1.5rem', marginBottom: '1.5rem' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="color-dot" style={{ backgroundColor: organelle.color }}></span>
          {organelle.name}
        </h3>
      <div className="flex-col gap-3">
        <div className="info-item">
          <div className="info-label">الوظيفة:</div>
          <div>{organelle.function}</div>
        </div>
        <div className="info-item">
          <div className="info-label">الأهمية الطبية:</div>
          <div>{organelle.medicalImportance}</div>
        </div>
      </div>
      </motion.div>
    </AnimatePresence>
  );
};
