
import React from 'react';

interface StatSliderProps {
  label: string;
  value: number;
  max: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const StatSlider: React.FC<StatSliderProps> = ({ label, value, max, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-[#b0b0b0]">{label}</label>
        <span className="text-lg medieval-font font-bold text-[#c9a962]">{value} / {max}</span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#c9a962] hover:opacity-80 transition-all"
        style={{
          background: `linear-gradient(to right, #c9a962 0%, #c9a962 ${(value / max) * 100}%, #2a2a2a ${(value / max) * 100}%, #2a2a2a 100%)`
        }}
      />
    </div>
  );
};
