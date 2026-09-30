import React, { useState } from 'react';
import { CommissionInput, CommissionResult, ComponentResult } from '../features/commission/commission.types';
import { formatPercentage } from '../features/commission/commission.utils';
import { MATRIX_COLUMNS, ColumnConfig } from './CommissionMatrix';
import { Zap, Building2, Smartphone, Wifi, CheckCircle2, TrendingUp, Target, CalendarDays } from 'lucide-react';
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
  showDailyRequired?: boolean;
  isCurrency?: boolean;
  onTargetChange?: (val: string) => void;
  onActualChange?: (val: string) => void;
}

const DAILY_WORK_DAYS = 22; // 22 working days assuming 8 days OFF in a month

const MobileCard = React.memo(function MobileCard({
  title,
  weightLabel,
  unit,
  target,
  actual,
  res,
  accentColor,
  isSummary = false,
  showDailyRequired = false,
  isCurrency = false,
  onTargetChange,
  onActualChange,
}: SingleCardProps) {
  const isZero = target === 0;
  const isNegative = (target !== null && target < 0) || (actual !== null && actual < 0);
  const isExceeded = res.missing === 0 && res.achievement !== null && res.achievement >= 100;
  const vs = res.vs ?? res.achievement;
  const re = res.re ?? null;

  // Formula: Target / 22 Day (8 Day OFF) = Daily Required
  const dailyRequired = target !== null && target > 0 ? target / DAILY_WORK_DAYS : null;

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isSummary
          ? 'bg-gradient-to-br from-red-50/90 via-white to-red-50/50 border-red-300 shadow-sm'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
      } p-3.5 sm:p-4`}
    >
      {/* 1. Header: Component Title, Weight Badge & Unit */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full ${accentColor} shrink-0 ring-4 ring-slate-100`} />
          <div className="min-w-0">
            <h4 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
              {title}
            </h4>
            {isSummary && (
              <span className="text-[10px] text-[#E60000] font-bold block mt-0.5">
                Auto-calculated total sum
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {weightLabel && (
            <span className="font-extrabold text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {weightLabel}
            </span>
          )}
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">
            {unit}
          </span>
        </div>
      </div>

      {/* 2. Interactive Input Grid: Target & Actual */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        {/* Target Input */}
        <div className="flex flex-col bg-slate-50/90 hover:bg-slate-50 border border-slate-200/90 focus-within:border-[#E60000] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 rounded-xl p-2 transition-all shadow-2xs">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-slate-400" />
              <span>Target</span>
            </span>
            <span className="text-[9px] font-medium text-slate-400">Assigned</span>
          </div>

          {isSummary ? (
            <div className="h-11 flex items-center justify-center font-black text-base text-red-950 bg-red-100/70 border border-red-200 rounded-lg">
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
              className={`w-full h-11 text-center font-black text-base rounded-lg border outline-none transition-all ${
                isZero
                  ? 'border-red-500 bg-red-50 text-red-900 focus:ring-red-400'
                  : 'border-slate-200 bg-white text-slate-900 focus:border-[#E60000]'
              }`}
            />
          )}
        </div>

        {/* Actual Input */}
        <div className="flex flex-col bg-slate-50/90 hover:bg-slate-50 border border-slate-200/90 focus-within:border-[#E60000] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 rounded-xl p-2 transition-all shadow-2xs">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-slate-400" />
              <span>Actual</span>
            </span>
            <span className="text-[9px] font-medium text-slate-400">Delivered</span>
          </div>

          {isSummary ? (
            <div className="h-11 flex items-center justify-center font-black text-base text-red-950 bg-red-100/70 border border-red-200 rounded-lg">
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
              className="w-full h-11 text-center font-black text-base rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-[#E60000] outline-none transition-all"
            />
          )}
        </div>
      </div>

      {/* Target Warnings */}
      {isZero && (
        <div className="text-[10px] text-red-600 font-bold mb-2 px-1">
          * Target must be greater than 0
        </div>
      )}
      {isNegative && (
        <div className="text-[10px] text-red-600 font-bold mb-2 px-1">
          * Values cannot be negative
        </div>
      )}

      {/* 3. Daily Required from Target (Target / 22 Day - 8 Day OFF) */}
      {showDailyRequired && (
        <div className="mb-3 bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 border border-indigo-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-black text-slate-800 leading-tight">
                Daily Required
              </div>
              <div className="text-[9px] text-slate-500 font-medium">
                Target / 22 Day (8 Day OFF)
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs sm:text-sm font-black text-indigo-950 leading-tight">
              {dailyRequired !== null ? (
                isCurrency ? (
                  `${Math.round(dailyRequired).toLocaleString()} EGP`
                ) : (
                  `${dailyRequired.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${unit || 'Acq'}`
                )
              ) : (
                <span className="text-slate-400 font-normal">0 {unit || 'Acq'}</span>
              )}
              <span className="text-[10px] text-indigo-600 font-bold ml-1">/ Day</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Ergonomic 2x2 Metric Grid: VS%, RE%, Contribution, Gap / Missing */}
      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-150">
        {/* Metric 1: VS% (Actual Achievement) */}
        <div className="flex flex-col justify-between p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-slate-700 tracking-wider">VS%</span>
            <span className="text-[8px] font-bold text-slate-400">Actual</span>
          </div>
          <div className="mt-1">
            <span className={`text-base font-black leading-tight ${
              vs !== null && vs >= 100 ? 'text-emerald-700' : 'text-slate-900'
            }`}>
              {formatPercentage(vs)}
            </span>
          </div>
        </div>

        {/* Metric 2: RE% (Projected by Month End) */}
        <div className="flex flex-col justify-between p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-indigo-700 tracking-wider">RE%</span>
            <span className="text-[8px] font-bold text-indigo-500">Projected</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-black text-indigo-950 leading-tight">
              {formatPercentage(re)}
            </span>
          </div>
        </div>

        {/* Metric 3: Weighted Contribution */}
        <div className="flex flex-col justify-between p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Contribution</span>
            <span className="text-[8px] font-medium text-slate-400">Weight</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm font-black text-slate-800 leading-tight">
              {res.contribution !== null ? formatPercentage(res.contribution) : '—'}
            </span>
            {weightLabel && (
              <span className="text-[9px] font-semibold text-slate-400">of {weightLabel}</span>
            )}
          </div>
        </div>

        {/* Metric 4: Gap or Missing */}
        <div className="flex flex-col justify-between p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Gap / Missing</span>
            <span className="text-[8px] font-medium text-slate-400">{unit}</span>
          </div>
          <div className="mt-1">
            <span className={`text-sm font-black leading-tight flex items-center gap-1 ${
              res.missing !== null
                ? res.missing > 0
                  ? 'text-[#E60000]'
                  : 'text-emerald-600'
                : 'text-slate-400'
            }`}>
              {res.missing !== null ? (
                res.missing > 0 ? (
                  `-${res.missing.toLocaleString()}`
                ) : (
                  <span className="flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Target Met</span>
                  </span>
                )
              ) : (
                '—'
              )}
            </span>
          </div>
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
  getRE: (res: CommissionResult) => number | null;
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
    getRE: (res) => (res.acquisition.total.re !== null && res.acquisition.total.re !== undefined ? res.acquisition.total.re * 0.60 : null),
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
    getRE: (res) => res.enterprise.totalRE ?? null,
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
    getRE: (res) => (res.terminal.re !== null && res.terminal.re !== undefined ? res.terminal.re * 0.10 : null),
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
    getRE: (res) => res.fixed.totalRE ?? null,
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
      {/* Category Segmented Scrollable Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs font-semibold px-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`h-9 px-3.5 rounded-xl whitespace-nowrap transition-all shrink-0 flex items-center gap-1 font-bold ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Categories</span>
        </button>

        {CATEGORY_GROUPS.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveTab(cat.name)}
              className={`h-9 px-3.5 rounded-xl whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 font-bold ${
                isActive
                  ? `${cat.badgeBg} text-white shadow-xs`
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                isActive ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.weight.replace(/[^0-9%]/g, '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render Category Sections Dynamically from MATRIX_COLUMNS */}
      {CATEGORY_GROUPS.map((cat) => {
        if (activeTab !== 'all' && activeTab !== cat.name) return null;

        const Icon = cat.icon;
        const catColumns = MATRIX_COLUMNS.filter((c) => c.category === cat.name);
        const vsContribution = cat.getContribution(result);
        const reContribution = cat.getRE(result);

        return (
          <div
            key={cat.name}
            className={`bg-white rounded-2xl border ${cat.borderColor} p-3.5 sm:p-4 shadow-xs space-y-3.5`}
          >
            {/* Category Header with both VS% and RE% */}
            <div className={`flex flex-col gap-2 pb-2.5 border-b ${cat.headerBorder}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${cat.badgeBg} text-white flex items-center justify-center shadow-2xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-slate-900 text-base">{cat.name}</h3>
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {cat.weight}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-black">
                  <span className="text-slate-800 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                    VS: {formatPercentage(vsContribution)}
                  </span>
                  <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                    RE: {formatPercentage(reContribution)}
                  </span>
                </div>
              </div>

              {/* News Bar for Acquisition Rule */}
              {cat.name === 'Acquisition' && (
                <NewsTickerNote
                  note={acqNote}
                  onNoteChange={onAcqNoteChange}
                  className="w-full"
                  editable={false}
                />
              )}
            </div>

            {/* Component Cards */}
            <div className="space-y-3">
              {catColumns.map((col) => {
                const isSummary = col.isSummary ?? false;
                const colInput = col.getter(input);
                const colResult = col.resultGetter(result);
                const title = isSummary
                  ? 'Total Acquisition (Sum)'
                  : col.subTitle;

                const targetVal = isSummary ? result.acquisition.totalTarget : colInput.target;
                const actualVal = isSummary ? result.acquisition.totalActual : colInput.actual;

                // Daily Required applies to: Low, High, Cash, Total Acquisition, and Terminal
                const showDailyRequired = ['acq-low', 'acq-high', 'acq-cash', 'acq-total', 'terminal'].includes(col.id);
                const isCurrency = col.id === 'terminal' || col.unit === 'EGP';

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
                    showDailyRequired={showDailyRequired}
                    isCurrency={isCurrency}
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
