import React, { useState } from 'react';
import { CommissionInput, CommissionResult, ComponentResult } from '../features/commission/commission.types';
import { formatPercentage } from '../features/commission/commission.utils';
import { MATRIX_COLUMNS, ColumnConfig } from './CommissionMatrix';
import { Zap, Building2, Smartphone, Wifi } from 'lucide-react';
import { NewsTickerNote } from './NewsTickerNote';

interface MobileCommissionCardsProps {
  input: CommissionInput;
  result: CommissionResult;
  onChange: (updater: (prev: CommissionInput) => CommissionInput) => void;
  acqNote: string;
  onAcqNoteChange: (note: string) => void;
}

type CategoryTab = 'all' | 'Acquisition' | 'Enterprise' | 'Terminal' | 'Fixed';

interface SingleCardProps {
  title: string;
  weightLabel?: string;
  unit: string;
  target: number | null;
  actual: number | null;
  res: ComponentResult;
  accentColor: string;
  isSummary?: boolean;
  onTargetChange?: (val: string) => void;
  onActualChange?: (val: string) => void;
}

const MobileCard = React.memo(function MobileCard({
  title,
  weightLabel,
  unit,
  target,
  actual,
  res,
  accentColor,
  isSummary = false,
  onTargetChange,
  onActualChange,
}: SingleCardProps) {
  const isZero = target === 0;
  const isNegative = (target !== null && target < 0) || (actual !== null && actual < 0);
  const isExceeded = res.missing === 0 && res.achievement !== null && res.achievement >= 100;

  return (
    <div
      className={`rounded-xl border p-3 transition-all ${
        isSummary
          ? 'bg-gradient-to-b from-red-50/90 to-red-50/40 border-red-300 shadow-xs'
          : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full ${accentColor} shrink-0`} />
          <h4 className="font-extrabold text-slate-900 text-sm truncate">{title}</h4>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {weightLabel && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {weightLabel}
            </span>
          )}
          <span className="text-[10px] text-slate-500 font-medium">{unit}</span>
        </div>
      </div>

      {/* Target & Actual Inputs / Displays */}
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        {/* Target */}
        <div className="flex flex-col">
          <label className="text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
            <span>Target</span>
            <span className="text-[9px] font-normal text-slate-400">Assigned</span>
          </label>
          {isSummary ? (
            <div className="w-full h-11 flex items-center justify-center font-black text-base text-red-950 bg-red-100/70 border border-red-200 rounded-lg">
              {target !== null ? target.toLocaleString() : '0'}
            </div>
          ) : (
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="0"
              value={target ?? ''}
              onChange={(e) => onTargetChange?.(e.target.value)}
              className={`w-full h-11 text-center font-bold text-base rounded-lg border px-2 focus:outline-none focus:ring-2 transition-all ${
                isZero
                  ? 'border-red-500 bg-red-50 text-red-900 focus:ring-red-400'
                  : 'border-slate-300 bg-white text-slate-900 focus:ring-[#E60000] focus:border-[#E60000]'
              }`}
            />
          )}
        </div>

        {/* Actual */}
        <div className="flex flex-col">
          <label className="text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
            <span>Actual</span>
            <span className="text-[9px] font-normal text-slate-400">Delivered</span>
          </label>
          {isSummary ? (
            <div className="w-full h-11 flex items-center justify-center font-black text-base text-red-950 bg-red-100/70 border border-red-200 rounded-lg">
              {actual !== null ? actual.toLocaleString() : '0'}
            </div>
          ) : (
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="0"
              value={actual ?? ''}
              onChange={(e) => onActualChange?.(e.target.value)}
              className="w-full h-11 text-center font-bold text-base rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] transition-all"
            />
          )}
        </div>
      </div>

      {isZero && (
        <div className="text-[10px] text-red-600 font-semibold mb-2">
          * Target must be greater than 0
        </div>
      )}
      {isNegative && (
        <div className="text-[10px] text-red-600 font-semibold mb-2">
          * Values cannot be negative
        </div>
      )}

      {/* Results Bar */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 bg-slate-50/70 -mx-3 -mb-3 p-2 rounded-b-xl">
        <div className="text-center">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Achievement</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
            {formatPercentage(res.achievement)}
          </span>
        </div>

        <div className="text-center">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Contribution</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
            {res.contribution !== null ? formatPercentage(res.contribution) : '—'}
          </span>
        </div>

        <div className="text-center">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Missing</span>
          <span
            className={`text-xs sm:text-sm font-bold ${
              res.missing !== null
                ? res.missing > 0
                  ? 'text-[#E60000]'
                  : 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            {res.missing !== null
              ? res.missing > 0
                ? `-${res.missing.toLocaleString()}`
                : isExceeded
                ? 'Met'
                : '0'
              : '—'}
          </span>
        </div>
      </div>
    </div>
  );
});

interface CategoryGroup {
  name: 'Acquisition' | 'Enterprise' | 'Terminal' | 'Fixed';
  weight: string;
  icon: typeof Zap;
  borderColor: string;
  headerBorder: string;
  badgeBg: string;
  textColor: string;
  getContribution: (res: CommissionResult) => number | null;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: 'Acquisition',
    weight: 'Weight: 60%',
    icon: Zap,
    borderColor: 'border-red-200',
    headerBorder: 'border-red-100',
    badgeBg: 'bg-[#E60000]',
    textColor: 'text-[#E60000]',
    getContribution: (res) => res.acquisition.total.contribution,
  },
  {
    name: 'Enterprise',
    weight: 'Total: 10%',
    icon: Building2,
    borderColor: 'border-indigo-200',
    headerBorder: 'border-indigo-100',
    badgeBg: 'bg-indigo-600',
    textColor: 'text-indigo-700',
    getContribution: (res) => res.enterprise.totalContribution,
  },
  {
    name: 'Terminal',
    weight: 'Weight: 10%',
    icon: Smartphone,
    borderColor: 'border-amber-200',
    headerBorder: 'border-amber-100',
    badgeBg: 'bg-amber-600',
    textColor: 'text-amber-700',
    getContribution: (res) => res.terminal.contribution,
  },
  {
    name: 'Fixed',
    weight: 'Total: 20%',
    icon: Wifi,
    borderColor: 'border-emerald-200',
    headerBorder: 'border-emerald-100',
    badgeBg: 'bg-emerald-600',
    textColor: 'text-emerald-700',
    getContribution: (res) => res.fixed.totalContribution,
  },
];

export function MobileCommissionCards({
  input,
  result,
  onChange,
  acqNote,
  onAcqNoteChange,
}: MobileCommissionCardsProps) {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  const handleInputChange = (col: ColumnConfig, field: 'target' | 'actual', raw: string) => {
    if (!col.setter) return;
    const val = raw === '' ? null : Number(raw);
    onChange((prev) => {
      const current = col.getter(prev);
      return col.setter!(prev, { ...current, [field]: val });
    });
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Boxs
        </button>

        {CATEGORY_GROUPS.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveTab(cat.name)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 flex items-center gap-1 ${
                isActive
                  ? `${cat.badgeBg} text-white shadow-xs`
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.name} ({cat.weight.replace(/[^0-9%]/g, '')})</span>
            </button>
          );
        })}
      </div>

      {/* Render Category Sections Dynamically from MATRIX_COLUMNS */}
      {CATEGORY_GROUPS.map((cat) => {
        if (activeTab !== 'all' && activeTab !== cat.name) return null;

        const Icon = cat.icon;
        const catColumns = MATRIX_COLUMNS.filter((c) => c.category === cat.name);
        const contribution = cat.getContribution(result);

        return (
          <div
            key={cat.name}
            className={`bg-white rounded-2xl border ${cat.borderColor} p-3.5 shadow-xs space-y-3`}
          >
            {/* Category Header */}
            <div className={`flex flex-col gap-2 pb-2 border-b ${cat.headerBorder}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${cat.textColor}`} />
                  <h3 className="font-black text-slate-900 text-base">{cat.name}</h3>
                  <span className={`${cat.badgeBg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                    {cat.weight}
                  </span>
                </div>
                <div className={`text-xs font-black ${cat.textColor}`}>
                  {formatPercentage(contribution)}
                </div>
              </div>

              {/* News Bar for Acquisition Rule */}
              {cat.name === 'Acquisition' && (
                <NewsTickerNote
                  note={acqNote}
                  onNoteChange={onAcqNoteChange}
                  className="w-full"
                />
              )}
            </div>

            {/* Component Cards */}
            <div className="space-y-2.5">
              {catColumns.map((col) => {
                const isSummary = col.isSummary ?? false;
                const colInput = col.getter(input);
                const colResult = col.resultGetter(result);
                const title = isSummary
                  ? 'Total Acquisition (Sum of Low + High + Cash)'
                  : col.subTitle;

                const targetVal = isSummary ? result.acquisition.totalTarget : colInput.target;
                const actualVal = isSummary ? result.acquisition.totalActual : colInput.actual;

                return (
                  <MobileCard
                    key={col.id}
                    title={title}
                    weightLabel={col.weightLabel || undefined}
                    unit={col.unit}
                    target={targetVal}
                    actual={actualVal}
                    res={colResult}
                    accentColor={col.theme.accentDot}
                    isSummary={isSummary}
                    onTargetChange={(val) => handleInputChange(col, 'target', val)}
                    onActualChange={(val) => handleInputChange(col, 'actual', val)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
