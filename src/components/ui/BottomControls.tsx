import React from 'react';
import { RotateCw, Maximize, EyeOff, Camera, RefreshCw } from 'lucide-react';

export const BottomControls: React.FC = () => {
  return (
    <div className="bottom-controls glass-panel">
      <button className="btn btn-icon btn-outline" title="تدوير"><RotateCw size={20} /></button>
      <button className="btn btn-icon btn-outline" title="عزل"><Maximize size={20} /></button>
      <button className="btn btn-icon btn-outline" title="إخفاء الآخرين"><EyeOff size={20} /></button>
      <button className="btn btn-icon btn-outline" title="إعادة العرض"><RefreshCw size={20} /></button>
      <button className="btn btn-icon btn-outline" title="لقطة شاشة"><Camera size={20} /></button>
    </div>
  );
};
