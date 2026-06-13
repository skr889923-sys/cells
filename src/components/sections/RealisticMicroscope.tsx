import React, { useMemo, useRef, useState } from 'react';
import {
  Aperture,
  Crosshair,
  Focus,
  Lightbulb,
  Move,
  RotateCcw,
  ScanLine,
  SlidersHorizontal,
  X
} from 'lucide-react';
import type { CellData } from '../../data/cellsData';
import { MicroscopeScene } from './MicroscopeScene';

interface RealisticMicroscopeProps {
  activeCell: CellData;
  onClose: () => void;
}

interface ObjectiveLens {
  label: string;
  scale: number;
  aperture: string;
  tint: string;
}

type InteractionMode = 'move' | 'rotate';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const normalizeAngle = (value: number) => {
  const normalized = ((value + 180) % 360 + 360) % 360 - 180;
  return Number(normalized.toFixed(1));
};

const objectiveLenses: ObjectiveLens[] = [
  { label: '10x', scale: 1, aperture: 'NA 0.25', tint: '#5c9ce6' },
  { label: '40x', scale: 2.5, aperture: 'NA 0.65', tint: '#d4a24f' },
  { label: '100x', scale: 5, aperture: 'Oil NA 1.25', tint: '#d15f61' }
];

export const RealisticMicroscope: React.FC<RealisticMicroscopeProps> = ({ activeCell, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [coarseFocus, setCoarseFocus] = useState<number>(50);
  const [fineFocus, setFineFocus] = useState<number>(50);
  const [lighting, setLighting] = useState<number>(58);
  const [condenser, setCondenser] = useState<number>(62);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('move');
  const [stage, setStage] = useState({ x: 0, y: 0 });
  const [sampleRotation, setSampleRotation] = useState({ x: 0, y: 0, z: 0 });
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    stageX: number;
    stageY: number;
    rotationX: number;
    rotationY: number;
  } | null>(null);

  const activeLens = useMemo(
    () => objectiveLenses.find((lens) => lens.scale === zoomLevel) ?? objectiveLenses[0],
    [zoomLevel]
  );
  const effectiveFocus = clamp(fineFocus + (coarseFocus - 50) * 0.36, 0, 100);
  const focusError = Math.abs(effectiveFocus - 50);
  const focusPercent = clamp(Math.round(100 - focusError * 2), 0, 100);
  const focusBlur = Math.min(focusError * 0.12, 7.5);
  const lightLevel = clamp(lighting / 100, 0.08, 1.2);
  const condenserLevel = clamp(condenser / 100, 0.15, 1);

  const fieldStyle = {
    '--focus-blur': `${focusBlur}px`,
    '--light-level': String(lightLevel),
    '--condenser-size': `${38 + condenserLevel * 44}%`,
    '--lens-tint': activeLens.tint
  } as React.CSSProperties & Record<string, string>;

  const updateStage = (nextX: number, nextY: number) => {
    setStage({
      x: clamp(nextX, -1.4, 1.4),
      y: clamp(nextY, -1.4, 1.4)
    });
  };

  const updateSampleRotation = (nextX: number, nextY: number, nextZ = sampleRotation.z) => {
    setSampleRotation({
      x: clamp(Number(nextX.toFixed(1)), -68, 68),
      y: normalizeAngle(nextY),
      z: normalizeAngle(nextZ)
    });
  };

  const handleFieldPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      stageX: stage.x,
      stageY: stage.y,
      rotationX: sampleRotation.x,
      rotationY: sampleRotation.y
    };
  };

  const handleFieldPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (interactionMode === 'rotate') {
      updateSampleRotation(
        drag.rotationX + (event.clientY - drag.y) * 0.28,
        drag.rotationY + (event.clientX - drag.x) * 0.42
      );
      return;
    }
    const sensitivity = zoomLevel === 5 ? 230 : zoomLevel === 2.5 ? 170 : 130;
    updateStage(
      drag.stageX + (event.clientX - drag.x) / sensitivity,
      drag.stageY - (event.clientY - drag.y) / sensitivity
    );
  };

  const handleFieldPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  const resetMicroscope = () => {
    setZoomLevel(1);
    setCoarseFocus(50);
    setFineFocus(50);
    setLighting(58);
    setCondenser(62);
    setInteractionMode('move');
    setStage({ x: 0, y: 0 });
    setSampleRotation({ x: 0, y: 0, z: 0 });
  };

  return (
    <div className="microscope-simulator" role="dialog" aria-modal="true" aria-label="محاكي المجهر">
      <aside className="microscope-control-deck">
        <button className="microscope-close" onClick={onClose}>
          <X size={18} strokeWidth={1.8} />
          <span>إغلاق المجهر</span>
        </button>

        <div className="microscope-heading">
          <span className="scope-kicker">Optical bench</span>
          <h2>محاكي المجهر الضوئي</h2>
          <p>{activeCell.title}</p>
        </div>

        <div className="scope-status-grid">
          <div>
            <Aperture size={18} strokeWidth={1.8} />
            <span>العدسة</span>
            <strong>{activeLens.label}</strong>
          </div>
          <div>
            <Crosshair size={18} strokeWidth={1.8} />
            <span>التركيز</span>
            <strong>{focusPercent}%</strong>
          </div>
        </div>

        <section className="scope-control-group">
          <div className="scope-control-title">
            <ScanLine size={18} strokeWidth={1.8} />
            <span>العدسات الشيئية</span>
          </div>
          <div className="objective-wheel" aria-label="العدسات الشيئية">
            {objectiveLenses.map((lens) => (
              <button
                key={lens.label}
                className={zoomLevel === lens.scale ? 'objective-lens active' : 'objective-lens'}
                onClick={() => setZoomLevel(lens.scale)}
                style={{ '--lens-tint': lens.tint } as React.CSSProperties}
              >
                <strong>{lens.label}</strong>
                <span>{lens.aperture}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="scope-control-group">
          <div className="scope-control-title">
            <Focus size={18} strokeWidth={1.8} />
            <span>التركيز</span>
          </div>
          <label className="scope-slider">
            <span>خشن</span>
            <input
              type="range"
              min="0"
              max="100"
              value={coarseFocus}
              onChange={(event) => setCoarseFocus(Number(event.target.value))}
            />
          </label>
          <label className="scope-slider">
            <span>دقيق</span>
            <input
              type="range"
              min="0"
              max="100"
              value={fineFocus}
              onChange={(event) => setFineFocus(Number(event.target.value))}
            />
          </label>
        </section>

        <section className="scope-control-group">
          <div className="scope-control-title">
            <Lightbulb size={18} strokeWidth={1.8} />
            <span>الإضاءة والمكثف</span>
          </div>
          <label className="scope-slider">
            <span>إضاءة</span>
            <input
              type="range"
              min="8"
              max="100"
              value={lighting}
              onChange={(event) => setLighting(Number(event.target.value))}
            />
          </label>
          <label className="scope-slider">
            <span>فتحة المكثف</span>
            <input
              type="range"
              min="10"
              max="100"
              value={condenser}
              onChange={(event) => setCondenser(Number(event.target.value))}
            />
          </label>
        </section>

        <section className="scope-control-group">
          <div className="scope-control-title">
            <Move size={18} strokeWidth={1.8} />
            <span>السحب داخل العدسة</span>
          </div>
          <div className="scope-mode-toggle" role="group" aria-label="طريقة السحب داخل العدسة">
            <button
              type="button"
              className={interactionMode === 'move' ? 'active' : ''}
              onClick={() => setInteractionMode('move')}
            >
              <Move size={16} strokeWidth={1.9} />
              <span>تحريك</span>
            </button>
            <button
              type="button"
              className={interactionMode === 'rotate' ? 'active' : ''}
              onClick={() => setInteractionMode('rotate')}
            >
              <RotateCcw size={16} strokeWidth={1.9} />
              <span>تدوير</span>
            </button>
          </div>
        </section>

        <section className="scope-control-group">
          <div className="scope-control-title">
            <SlidersHorizontal size={18} strokeWidth={1.8} />
            <span>منصة الشريحة</span>
          </div>
          <label className="scope-slider">
            <span>X</span>
            <input
              type="range"
              min="-1.4"
              max="1.4"
              step="0.05"
              value={stage.x}
              onChange={(event) => updateStage(Number(event.target.value), stage.y)}
            />
          </label>
          <label className="scope-slider">
            <span>Y</span>
            <input
              type="range"
              min="-1.4"
              max="1.4"
              step="0.05"
              value={stage.y}
              onChange={(event) => updateStage(stage.x, Number(event.target.value))}
            />
          </label>
        </section>

        <section className="scope-control-group">
          <div className="scope-control-title">
            <RotateCcw size={18} strokeWidth={1.8} />
            <span>اتجاه العينة</span>
          </div>
          <label className="scope-slider">
            <span>ميل</span>
            <input
              type="range"
              min="-68"
              max="68"
              step="1"
              value={sampleRotation.x}
              onChange={(event) => updateSampleRotation(Number(event.target.value), sampleRotation.y)}
            />
          </label>
          <label className="scope-slider">
            <span>لف</span>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={sampleRotation.y}
              onChange={(event) => updateSampleRotation(sampleRotation.x, Number(event.target.value))}
            />
          </label>
          <label className="scope-slider">
            <span>دوران</span>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={sampleRotation.z}
              onChange={(event) => updateSampleRotation(sampleRotation.x, sampleRotation.y, Number(event.target.value))}
            />
          </label>
        </section>

        <button className="scope-reset" onClick={resetMicroscope}>
          <RotateCcw size={18} strokeWidth={1.8} />
          <span>إعادة معايرة</span>
        </button>
      </aside>

      <main className="microscope-viewport">
        <div className="microscope-body" aria-hidden="true">
          <div className="microscope-ocular" />
          <div className="microscope-arm" />
          <div className="microscope-stage-piece" />
          <div className="microscope-base" />
        </div>

        <section className="eyepiece-module">
          <div className="eyepiece-meta">
            <span>{activeLens.label}</span>
            <span>{activeLens.aperture}</span>
            <span>F {Math.round(effectiveFocus)}</span>
            <span>{interactionMode === 'move' ? 'XY' : 'ROT'}</span>
          </div>

          <div className="eyepiece-rim">
            <div
              className={interactionMode === 'rotate' ? 'eyepiece-field is-rotating-sample' : 'eyepiece-field'}
              style={fieldStyle}
              onPointerDown={handleFieldPointerDown}
              onPointerMove={handleFieldPointerMove}
              onPointerUp={handleFieldPointerUp}
              onPointerCancel={handleFieldPointerUp}
            >
              <div className="microscope-canvas-focus">
                <MicroscopeScene
                  cellData={activeCell}
                  zoomLevel={zoomLevel}
                  focus={effectiveFocus}
                  lighting={lighting}
                  condenser={condenser}
                  stageOffset={stage}
                  sampleRotation={sampleRotation}
                />
              </div>
              <div className="field-condenser" />
              <div className="field-measure-grid" />
              <div className="field-reticle" />
              <div className="field-dust">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="field-vignette" />
            </div>
          </div>

          <div className="slide-stage-readout">
            <div>
              <SlidersHorizontal size={17} strokeWidth={1.8} />
              <span>الشريحة</span>
              <strong>{activeCell.title}</strong>
            </div>
            <div className="stage-axis-readout">
              <span>X {stage.x.toFixed(2)}</span>
              <span>Y {stage.y.toFixed(2)}</span>
              <span>R {Math.round(sampleRotation.y)}°</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
