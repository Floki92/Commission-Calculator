import React from 'react';
import { CommissionInput, CommissionResult, ComponentInput } from '../features/commission/commission.types';
import { COMMISSION_WEIGHTS, UNITS } from '../features/commission/commission.constants';
import { formatPercentage } from '../features/commission/commission.utils';
import { Zap, Building2, Smartphone, Wifi, Layers, Boxes } from 'lucide-react';

interface CommissionMatrixProps {
  input: CommissionInput;
  result: CommissionResult;
  onChange: (updater: (prev: CommissionInput) => CommissionInput) => void;
}

interface ColumnTheme {
  accentDot: string;
  subHeaderBg: string;
  titleColor: string;
  badgeBg: string;
  badgeText: string;
  unitColor: string;
  focusRing: string;
  contribBg: string;
  contribBorder: string;
  contribText: string;
}

interface ColumnConfig {
  id: string;
  category: string;
  categoryWeight: string;
  subTitle: string;
  weight: number;
  weightLabel: string;
  unit: string;
  theme: ColumnTheme;
  getter: (input: CommissionInput) => ComponentInput;
  setter: (prev: CommissionInput, val: ComponentInput) => CommissionInput;
  resultGetter: (result: CommissionResult) => { achievement: number | null; contribution: number | null; missing: number | null };
}

export function CommissionMatrix({ input, result, onChange }: CommissionMatrixProps) {
  const columns: ColumnConfig[] = [
    {
      id: 'voice',
      category: 'Acquisition',
      categoryWeight: '60%',
      subTitle: 'Acq Points',
      weight: COMMISSION_WEIGHTS.VOICE,
      weightLabel: '60%',
      unit: UNITS.VOICE,
      theme: {
        accentDot: 'bg-[#E60000]',
        subHeaderBg: 'bg-red-50/50 hover:bg-red-50/70 border-t-2 border-t-red-400',
        titleColor: 'text-red-950',
        badgeBg: 'bg-red-100',
        badgeText: 'text-[#E60000]',
        unitColor: 'text-red-700/80',
        focusRing: 'focus:ring-[#E60000] focus:border-[#E60000]',
        contribBg: 'bg-red-50/90',
        contribBorder: 'border-red-200',
        contribText: 'text-[#E60000]',
      },
      getter: (inp) => inp.voice,
      setter: (prev, val) => ({ ...prev, voice: val }),
      resultGetter: (res) => res.voice,
    },
    {
      id: 'ent-accounts',
      category: 'Enterprise',
      categoryWeight: '10%',
      subTitle: 'Accounts',
      weight: COMMISSION_WEIGHTS.ENTERPRISE_ACCOUNTS,
      weightLabel: '5%',
      unit: UNITS.ENTERPRISE_ACCOUNTS,
      theme: {
        accentDot: 'bg-indigo-600',
        subHeaderBg: 'bg-indigo-50/50 hover:bg-indigo-50/70 border-t-2 border-t-indigo-400',
        titleColor: 'text-indigo-950',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-700',
        unitColor: 'text-indigo-700/80',
        focusRing: 'focus:ring-indigo-500 focus:border-indigo-500',
        contribBg: 'bg-indigo-50/90',
        contribBorder: 'border-indigo-200',
        contribText: 'text-indigo-700',
      },
      getter: (inp) => inp.enterprise.accounts,
      setter: (prev, val) => ({
        ...prev,
        enterprise: { ...prev.enterprise, accounts: val },
      }),
      resultGetter: (res) => res.enterprise.accounts,
    },
    {
      id: 'ent-lines',
      category: 'Enterprise',
      categoryWeight: '10%',
      subTitle: 'Lines',
      weight: COMMISSION_WEIGHTS.ENTERPRISE_LINES,
      weightLabel: '5%',
      unit: UNITS.ENTERPRISE_LINES,
      theme: {
        accentDot: 'bg-blue-600',
        subHeaderBg: 'bg-blue-50/50 hover:bg-blue-50/70 border-t-2 border-t-blue-400',
        titleColor: 'text-blue-950',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-700',
        unitColor: 'text-blue-700/80',
        focusRing: 'focus:ring-blue-500 focus:border-blue-500',
        contribBg: 'bg-blue-50/90',
        contribBorder: 'border-blue-200',
        contribText: 'text-blue-700',
      },
      getter: (inp) => inp.enterprise.lines,
      setter: (prev, val) => ({
        ...prev,
        enterprise: { ...prev.enterprise, lines: val },
      }),
      resultGetter: (res) => res.enterprise.lines,
    },
    {
      id: 'terminal',
      category: 'Terminal',
      categoryWeight: '10%',
      subTitle: 'Sales Value',
      weight: COMMISSION_WEIGHTS.TERMINAL,
      weightLabel: '10%',
      unit: UNITS.TERMINAL,
      theme: {
        accentDot: 'bg-amber-600',
        subHeaderBg: 'bg-amber-50/50 hover:bg-amber-50/70 border-t-2 border-t-amber-400',
        titleColor: 'text-amber-950',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        unitColor: 'text-amber-800/80',
        focusRing: 'focus:ring-amber-500 focus:border-amber-500',
        contribBg: 'bg-amber-50/90',
        contribBorder: 'border-amber-200',
        contribText: 'text-amber-700',
      },
      getter: (inp) => inp.terminal,
      setter: (prev, val) => ({ ...prev, terminal: val }),
      resultGetter: (res) => res.terminal,
    },
    {
      id: 'fixed-dsl',
      category: 'Fixed',
      categoryWeight: '20%',
      subTitle: 'DSL',
      weight: COMMISSION_WEIGHTS.DSL,
      weightLabel: '16%',
      unit: UNITS.DSL,
      theme: {
        accentDot: 'bg-emerald-600',
        subHeaderBg: 'bg-emerald-50/50 hover:bg-emerald-50/70 border-t-2 border-t-emerald-400',
        titleColor: 'text-emerald-950',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800',
        unitColor: 'text-emerald-800/80',
        focusRing: 'focus:ring-emerald-500 focus:border-emerald-500',
        contribBg: 'bg-emerald-50/90',
        contribBorder: 'border-emerald-200',
        contribText: 'text-emerald-700',
      },
      getter: (inp) => inp.fixed.dsl,
      setter: (prev, val) => ({
        ...prev,
        fixed: { ...prev.fixed, dsl: val },
      }),
      resultGetter: (res) => res.fixed.dsl,
    },
    {
      id: 'fixed-conn',
      category: 'Fixed',
      categoryWeight: '20%',
      subTitle: 'Connectivity',
      weight: COMMISSION_WEIGHTS.CONNECTIVITY,
      weightLabel: '4%',
      unit: UNITS.CONNECTIVITY,
      theme: {
        accentDot: 'bg-teal-600',
        subHeaderBg: 'bg-teal-50/50 hover:bg-teal-50/70 border-t-2 border-t-teal-400',
        titleColor: 'text-teal-950',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-800',
        unitColor: 'text-teal-800/80',
        focusRing: 'focus:ring-teal-500 focus:border-teal-500',
        contribBg: 'bg-teal-50/90',
        contribBorder: 'border-teal-200',
        contribText: 'text-teal-700',
      },
      getter: (inp) => inp.fixed.connectivity,
      setter: (prev, val) => ({
        ...prev,
        fixed: { ...prev.fixed, connectivity: val },
      }),
      resultGetter: (res) => res.fixed.connectivity,
    },
  ];

  const handleTargetChange = (col: ColumnConfig, rawValue: string) => {
    const target = rawValue === '' ? null : Number(rawValue);
    onChange((prev) => {
      const current = col.getter(prev);
      return col.setter(prev, { ...current, target });
    });
  };

  const handleActualChange = (col: ColumnConfig, rawValue: string) => {
    const actual = rawValue === '' ? null : Number(rawValue);
    onChange((prev) => {
      const current = col.getter(prev);
      return col.setter(prev, { ...current, actual });
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Mobile Swipe Hint Bar */}
      <div className="md:hidden flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-medium">
        <span>Swipe horizontally to view all metrics</span>
        <span className="text-[#E60000] font-semibold flex items-center gap-1">6 Components &rarr;</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px] sm:min-w-[850px]">
          {/* Header Row: Main Categories & Weights */}
          <thead>
            {/* Top Categories grouping */}
            <tr className="border-b border-slate-200 text-xs">
              {/* Category Header Label Box */}
              <th className="p-2 sm:p-3.5 w-28 sm:w-44 text-center border-r border-slate-200 bg-slate-100 border-t-4 border-t-slate-400 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 font-black text-slate-700 uppercase tracking-wider text-[11px] sm:text-xs">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
                  <span>Category</span>
                </div>
              </th>

              {/* Acquisition Category Box (1 col) - Red theme */}
              <th className="p-2.5 sm:p-3.5 text-center border-r border-slate-200 bg-gradient-to-b from-red-100/80 via-red-50/60 to-red-50/30 border-t-4 border-t-[#E60000]">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E60000] shrink-0" />
                  <span className="font-black text-red-950 text-xs sm:text-sm tracking-tight">Acquisition</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-[#E60000] text-white font-extrabold text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs">
                  Weight: 60%
                </div>
              </th>

              {/* Enterprise Category Box (2 cols) - Indigo theme */}
              <th colSpan={2} className="p-2.5 sm:p-3.5 text-center border-r border-slate-200 bg-gradient-to-b from-indigo-100/80 via-indigo-50/60 to-indigo-50/30 border-t-4 border-t-indigo-600">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
                  <span className="font-black text-indigo-950 text-xs sm:text-sm tracking-tight">Enterprise</span>
                  <span className="bg-indigo-600 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs">
                    Total: 10%
                  </span>
                </div>
                <div className="text-indigo-800 font-semibold text-[10px] sm:text-[11px]">Accounts 5% • Lines 5%</div>
              </th>

              {/* Terminal Category Box (1 col) - Amber theme */}
              <th className="p-2.5 sm:p-3.5 text-center border-r border-slate-200 bg-gradient-to-b from-amber-100/80 via-amber-50/60 to-amber-50/30 border-t-4 border-t-amber-500">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                  <span className="font-black text-amber-950 text-xs sm:text-sm tracking-tight">Terminal</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-amber-600 text-white font-extrabold text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs">
                  Weight: 10%
                </div>
              </th>

              {/* Fixed Category Box (2 cols) - Emerald theme */}
              <th colSpan={2} className="p-2.5 sm:p-3.5 text-center bg-gradient-to-b from-emerald-100/80 via-emerald-50/60 to-emerald-50/30 border-t-4 border-t-emerald-600">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span className="font-black text-emerald-950 text-xs sm:text-sm tracking-tight">Fixed</span>
                  <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs">
                    Total: 20%
                  </span>
                </div>
                <div className="text-emerald-800 font-semibold text-[10px] sm:text-[11px]">DSL 16% • Connectivity 4%</div>
              </th>
            </tr>

            {/* Sub-column Titles and Units (Component Boxes Row) */}
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-700">
              {/* Component Header Label Box */}
              <th className="p-2 sm:p-3 text-center border-r border-slate-200 bg-slate-100 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 font-black text-slate-700 uppercase tracking-wider text-[11px] sm:text-xs">
                  <Boxes className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 shrink-0" />
                  <span>Component</span>
                </div>
              </th>

              {/* 6 Unique Component Header Boxes */}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`p-2 sm:p-2.5 text-center border-r last:border-r-0 border-slate-200 transition-colors ${col.theme.subHeaderBg}`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${col.theme.accentDot} shrink-0`}></span>
                    <span className={`font-extrabold text-xs sm:text-sm ${col.theme.titleColor}`}>{col.subTitle}</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-normal flex items-center justify-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
                    <span className={`font-extrabold px-1.5 sm:px-2 py-0.5 rounded-sm text-[9px] sm:text-[10px] ${col.theme.badgeBg} ${col.theme.badgeText}`}>
                      {col.weightLabel}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className={`text-[10px] sm:text-[11px] font-medium ${col.theme.unitColor}`}>{col.unit}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ROW 1: Target */}
            <tr className="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
              <td className="p-2 sm:p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-100 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-800 shrink-0"></span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Target</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Assigned target</div>
                  </div>
                </div>
              </td>
              {columns.map((col) => {
                const currentInput = col.getter(input);
                const isZero = currentInput.target === 0;
                const isNegative = currentInput.target !== null && currentInput.target < 0;

                return (
                  <td key={col.id} className="p-2 sm:p-2.5 border-r last:border-r-0 border-slate-200 align-top">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={currentInput.target ?? ''}
                        onChange={(e) => handleTargetChange(col, e.target.value)}
                        className={`w-full text-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all focus:outline-none focus:ring-2 print:hidden export-hide-input ${
                          isZero || isNegative
                            ? 'border-red-500 bg-red-50/50 text-red-900 focus:ring-red-500'
                            : currentInput.target !== null
                            ? `border-slate-300 bg-white text-slate-900 ${col.theme.focusRing}`
                            : `border-slate-300 bg-white text-slate-900 ${col.theme.focusRing}`
                        }`}
                      />
                      <div className="hidden print:flex export-show-text items-center justify-center text-center font-bold text-xs sm:text-sm text-slate-900 py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg min-h-[34px] sm:min-h-[38px]">
                        {currentInput.target !== null ? currentInput.target : <span className="text-slate-400 font-normal">0</span>}
                      </div>
                      <span className="block text-[10px] text-slate-400 text-center mt-0.5 sm:mt-1">
                        {col.unit}
                      </span>
                      {isZero && (
                        <span className="block text-[9px] sm:text-[10px] text-[#E60000] text-center font-semibold print:hidden export-hide-input">
                          Must be &gt; 0
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* ROW 2: Actual / Achieve */}
            <tr className="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
              <td className="p-2 sm:p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-100 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#E60000] shrink-0"></span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Actual</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Delivered result</div>
                  </div>
                </div>
              </td>
              {columns.map((col) => {
                const currentInput = col.getter(input);
                const isNegative = currentInput.actual !== null && currentInput.actual < 0;

                return (
                  <td key={col.id} className="p-2 sm:p-2.5 border-r last:border-r-0 border-slate-200 align-top">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={currentInput.actual ?? ''}
                        onChange={(e) => handleActualChange(col, e.target.value)}
                        className={`w-full text-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all focus:outline-none focus:ring-2 print:hidden export-hide-input ${
                          isNegative
                            ? 'border-red-500 bg-red-50/50 text-red-900 focus:ring-red-500'
                            : currentInput.actual !== null
                            ? `border-slate-300 bg-white text-slate-900 ${col.theme.focusRing}`
                            : `border-slate-300 bg-white text-slate-900 ${col.theme.focusRing}`
                        }`}
                      />
                      <div className="hidden print:flex export-show-text items-center justify-center text-center font-bold text-xs sm:text-sm text-slate-900 py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg min-h-[34px] sm:min-h-[38px]">
                        {currentInput.actual !== null ? currentInput.actual : <span className="text-slate-400 font-normal">0</span>}
                      </div>
                      <span className="block text-[10px] text-slate-400 text-center mt-0.5 sm:mt-1">
                        {col.unit}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* ROW 3: Percentages & Contributions */}
            <tr className="bg-slate-50/60">
              <td className="p-2 sm:p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-100 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] align-top">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#E60000] shrink-0"></span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Percentages</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Achieve & Contrib</div>
                  </div>
                </div>
              </td>
              {columns.map((col) => {
                const res = col.resultGetter(result);
                const isExceeded = res.missing === 0 && res.achievement !== null && res.achievement >= 100;

                return (
                  <td key={col.id} className="p-2 sm:p-3 border-r last:border-r-0 border-slate-200 align-top">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      {/* Achievement % */}
                      <div className="bg-white border border-slate-200 rounded-lg p-1.5 sm:p-2 text-center shadow-2xs">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                          Achievement %
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-slate-900">
                          {formatPercentage(res.achievement)}
                        </span>
                      </div>

                      {/* Contribution % with unique category theme color */}
                      <div className={`${col.theme.contribBg} border ${col.theme.contribBorder} rounded-lg p-1.5 sm:p-2 text-center shadow-2xs`}>
                        <span className={`text-[9px] sm:text-[10px] uppercase font-extrabold ${col.theme.contribText} block mb-0.5`}>
                          Contribution %
                        </span>
                        <span className={`text-sm sm:text-base font-extrabold ${col.theme.contribText}`}>
                          {formatPercentage(res.contribution)}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5">
                          of {col.weightLabel}
                        </span>
                      </div>

                      {/* Missing */}
                      <div className="bg-white border border-slate-200 rounded-lg p-1.5 sm:p-2 text-center shadow-2xs">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                          Missing
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            res.missing !== null
                              ? res.missing > 0
                                ? 'text-[#E60000]'
                                : 'text-emerald-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {res.missing !== null ? (
                            res.missing > 0 ? (
                              `-${res.missing.toLocaleString()}`
                            ) : (
                              isExceeded ? '✓ Met' : '0'
                            )
                          ) : (
                            '—'
                          )}
                        </span>
                        {res.missing !== null && (
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block">
                            {col.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Parent Categories Summary Sub-Row with Distinct Category Color Themes */}
            <tr className="border-t-2 border-slate-200 bg-slate-50 text-xs">
              <td className="p-2 sm:p-3 font-bold text-slate-700 border-r border-slate-200 text-center bg-slate-100 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Category Total
              </td>
              {/* Voice / Acquisition Total */}
              <td className="p-2 sm:p-2.5 text-center border-r border-slate-200 bg-red-50/70 font-bold">
                <div className="text-xs sm:text-sm font-black text-[#E60000]">
                  {formatPercentage(result.voice.contribution)}
                </div>
                <span className="text-[9px] sm:text-[10px] text-red-700 font-semibold block">of 60%</span>
              </td>
              {/* Enterprise Combined Total */}
              <td colSpan={2} className="p-2 sm:p-2.5 text-center border-r border-slate-200 bg-indigo-50/70">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <span className="text-indigo-900 font-bold text-xs">Enterprise:</span>
                  <span className="text-xs sm:text-sm font-black text-indigo-700">
                    {formatPercentage(result.enterprise.totalContribution)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-indigo-600 font-bold">(10%)</span>
                </div>
              </td>
              {/* Terminal Total */}
              <td className="p-2 sm:p-2.5 text-center border-r border-slate-200 bg-amber-50/70 font-bold">
                <div className="text-xs sm:text-sm font-black text-amber-700">
                  {formatPercentage(result.terminal.contribution)}
                </div>
                <span className="text-[9px] sm:text-[10px] text-amber-800 font-semibold block">of 10%</span>
              </td>
              {/* Fixed Combined Total */}
              <td colSpan={2} className="p-2 sm:p-2.5 text-center bg-emerald-50/70">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <span className="text-emerald-900 font-bold text-xs">Fixed:</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-700">
                    {formatPercentage(result.fixed.totalContribution)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold">(20%)</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
