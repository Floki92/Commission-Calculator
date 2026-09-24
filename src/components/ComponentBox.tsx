import React from 'react';
import { ComponentInput, ComponentResult } from '../features/commission/commission.types';
import { formatPercentage } from '../features/commission/commission.utils';

interface ComponentBoxProps {
  title?: string;
  weight: number;
  unit: string;
  input: ComponentInput;
  result: ComponentResult;
  onChange: (input: ComponentInput) => void;
  isSubComponent?: boolean;
  colorTheme?: 'red' | 'indigo' | 'blue' | 'amber' | 'emerald' | 'teal';
}

export function ComponentBox({ title, weight, unit, input, result, onChange, isSubComponent, colorTheme = 'red' }: ComponentBoxProps) {
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const target = val === '' ? null : Number(val);
    onChange({ ...input, target });
  };

  const handleActualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const actual = val === '' ? null : Number(val);
    onChange({ ...input, actual });
  };

  const idPrefix = title?.toLowerCase().replace(/\s+/g, '-') || 'comp';

  const themeStyles = {
    red: { border: 'border-t-4 border-t-red-600', badge: 'bg-red-100 text-[#E60000]', text: 'text-[#E60000]' },
    indigo: { border: 'border-t-4 border-t-indigo-600', badge: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-700' },
    blue: { border: 'border-t-4 border-t-blue-600', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
    amber: { border: 'border-t-4 border-t-amber-500', badge: 'bg-amber-100 text-amber-800', text: 'text-amber-700' },
    emerald: { border: 'border-t-4 border-t-emerald-600', badge: 'bg-emerald-100 text-emerald-800', text: 'text-emerald-700' },
    teal: { border: 'border-t-4 border-t-teal-600', badge: 'bg-teal-100 text-teal-800', text: 'text-teal-700' },
  }[colorTheme];

  return (
    <div className={`flex flex-col gap-4 ${!isSubComponent ? `p-6 bg-white rounded-xl shadow-sm border border-slate-200 ${themeStyles.border}` : 'p-4 bg-slate-50 rounded-lg border border-slate-100'}`}>
      <div className="flex justify-between items-center">
        {title && <h3 className={`font-bold text-slate-800 ${!isSubComponent ? 'text-lg' : 'text-md uppercase tracking-wider'}`}>{title}</h3>}
        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${themeStyles.badge}`}>
          Weight: {(weight * 100).toFixed(0)}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-target`} className="text-xs font-medium text-slate-700">
            Target {unit}
          </label>
          <input
            id={`${idPrefix}-target`}
            type="number"
            min="0"
            step="any"
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            value={input.target ?? ''}
            onChange={handleTargetChange}
            placeholder={`Target`}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-actual`} className="text-xs font-medium text-slate-700">
            Actual {unit}
          </label>
          <input
            id={`${idPrefix}-actual`}
            type="number"
            min="0"
            step="any"
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            value={input.actual ?? ''}
            onChange={handleActualChange}
            placeholder={`Actual`}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100 mt-1">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Missing</p>
          <p className={`text-base font-semibold ${result.missing !== null && result.missing > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {result.missing !== null ? result.missing.toLocaleString() : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Achievement</p>
          <p className="text-base font-semibold text-slate-900">{formatPercentage(result.achievement)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Contribution</p>
          <p className="text-base font-semibold text-indigo-600">{formatPercentage(result.contribution)}</p>
        </div>
      </div>
      
      {input.target === 0 && (
        <p className="text-sm text-amber-600 mt-1">Enter a target greater than 0.</p>
      )}
      {(input.target !== null && input.target < 0) || (input.actual !== null && input.actual < 0) ? (
        <p className="text-sm text-red-600 mt-1">Values cannot be negative.</p>
      ) : null}
    </div>
  );
}
