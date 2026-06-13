import React, { useMemo, useState } from 'react';
import { Activity, Layers3, Microscope, Scale } from 'lucide-react';
import { cellsData, type CellData } from '../../data/cellsData';

interface CompareCellsPanelProps {
  activeCell: CellData;
}

export const CompareCellsPanel: React.FC<CompareCellsPanelProps> = ({ activeCell }) => {
  const firstAlternative = cellsData.find((cell) => cell.id !== activeCell.id) ?? activeCell;
  const [targetCellId, setTargetCellId] = useState(firstAlternative.id);
  const targetCell = cellsData.find((cell) => cell.id === targetCellId) ?? firstAlternative;

  const comparison = useMemo(() => {
    const activeIds = new Set(activeCell.organelles.map((organelle) => organelle.id));
    const targetIds = new Set(targetCell.organelles.map((organelle) => organelle.id));
    const shared = activeCell.organelles.filter((organelle) => targetIds.has(organelle.id));
    const activeOnly = activeCell.organelles.filter((organelle) => !targetIds.has(organelle.id));
    const targetOnly = targetCell.organelles.filter((organelle) => !activeIds.has(organelle.id));

    return { shared, activeOnly, targetOnly };
  }, [activeCell, targetCell]);

  return (
    <div className="compare-panel">
      <div className="compare-header">
        <div>
          <h2 className="panel-title">مقارنة الخلايا</h2>
          <p>قارن البنية والوظيفة والعضيات بين الخلية الحالية ونوع آخر.</p>
        </div>

        <label className="compare-selector">
          <span>الخلية الثانية</span>
          <select value={targetCellId} onChange={(event) => setTargetCellId(event.target.value)}>
            {cellsData
              .filter((cell) => cell.id !== activeCell.id)
              .map((cell) => (
                <option key={cell.id} value={cell.id}>
                  {cell.title}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="compare-grid">
        <article className="compare-cell-card">
          <img src={activeCell.imageUrl} alt={activeCell.title} />
          <div>
            <span>{activeCell.category}</span>
            <h3>{activeCell.title}</h3>
            <p>{activeCell.description}</p>
          </div>
        </article>

        <article className="compare-cell-card">
          <img src={targetCell.imageUrl} alt={targetCell.title} />
          <div>
            <span>{targetCell.category}</span>
            <h3>{targetCell.title}</h3>
            <p>{targetCell.description}</p>
          </div>
        </article>
      </div>

      <div className="compare-metrics" aria-label="مؤشرات المقارنة">
        <div>
          <Layers3 size={20} strokeWidth={1.8} />
          <span>عضيات الخلية الحالية</span>
          <strong>{activeCell.organelles.length}</strong>
        </div>
        <div>
          <Activity size={20} strokeWidth={1.8} />
          <span>عضيات مشتركة</span>
          <strong>{comparison.shared.length}</strong>
        </div>
        <div>
          <Microscope size={20} strokeWidth={1.8} />
          <span>مشاهد مجهرية</span>
          <strong>{activeCell.microscopeViews.length + targetCell.microscopeViews.length}</strong>
        </div>
        <div>
          <Scale size={20} strokeWidth={1.8} />
          <span>اختلافات بارزة</span>
          <strong>{comparison.activeOnly.length + comparison.targetOnly.length}</strong>
        </div>
      </div>

      <div className="compare-details">
        <section>
          <h3>أوجه التشابه</h3>
          {comparison.shared.length > 0 ? (
            <ul>
              {comparison.shared.map((organelle) => (
                <li key={organelle.id}>{organelle.name}</li>
              ))}
            </ul>
          ) : (
            <p className="compare-empty">لا توجد عضيات مشتركة بنفس التصنيف في البيانات الحالية.</p>
          )}
        </section>

        <section>
          <h3>يميز {activeCell.title}</h3>
          <ul>
            {comparison.activeOnly.slice(0, 5).map((organelle) => (
              <li key={organelle.id}>{organelle.name}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3>يميز {targetCell.title}</h3>
          <ul>
            {comparison.targetOnly.slice(0, 5).map((organelle) => (
              <li key={organelle.id}>{organelle.name}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
