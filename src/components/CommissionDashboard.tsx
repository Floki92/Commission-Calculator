import React, { useState, useMemo, useEffect } from 'react';
import { CommissionInput, ComponentInput } from '../features/commission/commission.types';
import { calculateCommission } from '../features/commission/commission.calculator';
import { formatPercentage } from '../features/commission/commission.utils';
import { CommissionMatrix } from './CommissionMatrix';
import { MobileCommissionCards } from './MobileCommissionCards';
import { VodafoneLogo } from './VodafoneLogo';
import { TNPSCalculator } from './TNPSCalculator';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  FileText, 
  Loader2, 
  Zap, 
  Building2, 
  Smartphone, 
  Wifi, 
  Table as TableIcon, 
  LayoutGrid, 
  ArrowUp 
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const emptyComponent: ComponentInput = { target: null, actual: null };

const initialInput: CommissionInput = {
  acquisition: {
    low: { ...emptyComponent },
    high: { ...emptyComponent },
    cash: { ...emptyComponent },
  },
  enterprise: {
    accounts: { ...emptyComponent },
    lines: { ...emptyComponent },
  },
  terminal: { ...emptyComponent },
  fixed: {
    dsl: { ...emptyComponent },
    connectivity: { ...emptyComponent },
  }
};

const COMMISSION_STORAGE_KEY = 'vodafone_commission_input_v2';
const LEGACY_COMMISSION_STORAGE_KEY = 'vodafone_commission_input_v1';
const ACQ_NOTE_STORAGE_KEY = 'vodafone_acq_note_v2';
const DEFAULT_ACQ_NOTE = "Must Get 90% of High GA's to not lose any Over in Low GA's";

const parseComp = (comp?: any, fbT: number | null = null, fbA: number | null = null): ComponentInput => ({
  target: typeof comp?.target === 'number' ? comp.target : fbT,
  actual: typeof comp?.actual === 'number' ? comp.actual : fbA,
});

function getStoredCommissionInput(): CommissionInput {
  if (typeof window === 'undefined') return initialInput;
  try {
    const raw = localStorage.getItem(COMMISSION_STORAGE_KEY) || localStorage.getItem(LEGACY_COMMISSION_STORAGE_KEY);
    if (!raw) return initialInput;
    const parsed = JSON.parse(raw);
    
    const legacyVoiceTarget = typeof parsed?.voice?.target === 'number' ? parsed.voice.target : null;
    const legacyVoiceActual = typeof parsed?.voice?.actual === 'number' ? parsed.voice.actual : null;

    return {
      acquisition: {
        low: parseComp(parsed?.acquisition?.low, legacyVoiceTarget, legacyVoiceActual),
        high: parseComp(parsed?.acquisition?.high),
        cash: parseComp(parsed?.acquisition?.cash),
      },
      enterprise: {
        accounts: parseComp(parsed?.enterprise?.accounts),
        lines: parseComp(parsed?.enterprise?.lines),
      },
      terminal: parseComp(parsed?.terminal),
      fixed: {
        dsl: parseComp(parsed?.fixed?.dsl),
        connectivity: parseComp(parsed?.fixed?.connectivity),
      },
    };
  } catch (err) {
    console.error('Error reading saved commission input:', err);
    return initialInput;
  }
}

export function CommissionDashboard() {
  const [input, setInput] = useState<CommissionInput>(getStoredCommissionInput);
  const [isExporting, setIsExporting] = useState(false);
  
  // Responsive default: cards on mobile, table on desktop
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return 'table';
    }
    return 'cards';
  });

  // Note state for Acquisition rule
  const [acqNote, setAcqNote] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_ACQ_NOTE;
    try {
      const stored = localStorage.getItem(ACQ_NOTE_STORAGE_KEY);
      if (stored) return stored;
      const legacy = localStorage.getItem('vodafone_acq_note_v1');
      if (legacy && legacy !== "Must Get 90% of High GA's to get Over Achieve in Low GA's") {
        return legacy;
      }
      return DEFAULT_ACQ_NOTE;
    } catch {
      return DEFAULT_ACQ_NOTE;
    }
  });

  const handleAcqNoteChange = (val: string) => {
    setAcqNote(val);
    try {
      localStorage.setItem(ACQ_NOTE_STORAGE_KEY, val);
    } catch (err) {
      console.error('Error saving acquisition note:', err);
    }
  };

  // Save changes to device local storage
  useEffect(() => {
    try {
      localStorage.setItem(COMMISSION_STORAGE_KEY, JSON.stringify(input));
    } catch (err) {
      console.error('Error saving commission input:', err);
    }
  }, [input]);

  // Ensure dark mode class is completely removed
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('vodafone_commission_theme');
  }, []);

  const result = useMemo(() => calculateCommission(input), [input]);

  const handleReset = () => {
    setInput(initialInput);
    try {
      localStorage.removeItem(COMMISSION_STORAGE_KEY);
      localStorage.removeItem(LEGACY_COMMISSION_STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing saved commission input:', err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Generates a complete, high-resolution Full Report PDF using jsPDF.
   * Ensures all input values, columns, and executive sections are fully captured without cutoffs.
   */
  const handleDownloadPDFReport = async () => {
    const reportElement = document.getElementById('printable-report');
    if (!reportElement) return;

    try {
      setIsExporting(true);

      // Synchronize input attributes so cloned nodes have values
      const inputs = reportElement.querySelectorAll<HTMLInputElement>('input');
      inputs.forEach((inp) => {
        inp.setAttribute('value', inp.value);
      });

      // Temporarily apply full-width export mode
      reportElement.classList.add('report-export-mode');

      // Wait for layout reflow
      await new Promise((resolve) => setTimeout(resolve, 150));

      const exportWidth = 1440;
      const imgDataUrl = await toPng(reportElement, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#f8fafc',
        width: exportWidth,
        style: {
          width: `${exportWidth}px`,
          maxWidth: `${exportWidth}px`,
          overflow: 'visible',
        },
      });

      // Generate landscape A4 PDF document
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 8;
      const availableWidth = pageWidth - margin * 2; // 281mm
      const availableHeight = pageHeight - margin * 2; // 194mm

      const imgProps = pdf.getImageProperties(imgDataUrl);
      const pdfImgHeight = (imgProps.height * availableWidth) / imgProps.width;

      if (pdfImgHeight <= availableHeight) {
        // Fits on single page
        const yOffset = margin + (availableHeight - pdfImgHeight) / 3;
        pdf.addImage(imgDataUrl, 'PNG', margin, yOffset, availableWidth, pdfImgHeight, undefined, 'FAST');
      } else {
        // Scale to fit available page height
        const scale = availableHeight / pdfImgHeight;
        const scaledWidth = availableWidth * scale;
        const xOffset = margin + (availableWidth - scaledWidth) / 2;
        pdf.addImage(imgDataUrl, 'PNG', xOffset, margin, scaledWidth, availableHeight, undefined, 'FAST');
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`vodafone-commission-full-report-${dateStr}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF report', err);
    } finally {
      const reportEl = document.getElementById('printable-report');
      if (reportEl) {
        reportEl.classList.remove('report-export-mode');
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      {/* Top Navigation with Vodafone Brandmark */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-[1920px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Vodafone Logo */}
            <div className="shrink-0 transition-transform hover:scale-105">
              <VodafoneLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                  Commission Calculator
                </h1>
                <span className="bg-red-50 text-[#E60000] border border-red-200 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  Vodafone
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                <span className="hidden sm:inline">Made With Love by</span>
                <span className="sm:hidden">By</span>
                <span className="font-bold text-slate-800">S3D</span>
                <span className="text-slate-500">( Qena Store )</span>
                <Heart className="w-3 h-3 text-[#E60000] fill-[#E60000] inline-block shrink-0 ml-0.5" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPDFReport}
              disabled={isExporting}
              className="no-print flex items-center gap-1.5 text-xs font-semibold bg-[#E60000] hover:bg-[#CC0000] active:bg-[#B30000] text-white transition-colors px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg shadow-xs hover:shadow-sm disabled:opacity-70"
              title="Download Full Commission Report as PDF"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="no-print flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#E60000] hover:bg-red-50 transition-colors px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 hover:border-red-200"
              title="Reset all target and actual input fields"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1920px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 mt-3 sm:mt-6 space-y-4 sm:space-y-6">
        
        {/* Full Printable/Exportable Report Container */}
        <div id="printable-report" className="w-full space-y-4 sm:space-y-6">
          
          {/* Executive Branded Header - Included in PDF, PNG export and Print */}
          <div className="hidden print:flex report-export-header items-center justify-between border-b-2 border-[#E60000] pb-4 mb-2">
            <div className="flex items-center gap-3">
              <VodafoneLogo className="w-10 h-10 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Vodafone Commission & Achievement Report
                  </h1>
                  <span className="bg-red-50 text-[#E60000] border border-red-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Official
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sales Employee Performance, Weighted Contributions & TNPS Matrix
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div className="font-bold text-slate-900 flex items-center justify-end gap-1">
                <span>Made With Love by</span>
                <span className="text-[#E60000]">S3D ( Qena Store )</span>
                <Heart className="w-3.5 h-3.5 text-[#E60000] fill-[#E60000]" />
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Report Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* EXECUTIVE KPI & TNPS BAR (Top Grid) */}
          <section aria-labelledby="executive-summary" className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 lg:gap-6">
            
            {/* Main KPI Card in Vodafone Red Palette (7 cols on lg) */}
            <div className="commission-summary-card lg:col-span-7 bg-gradient-to-br from-[#E60000] via-[#CC0000] to-[#990000] rounded-2xl shadow-md p-3.5 sm:p-5 lg:p-6 text-white flex flex-col justify-between relative overflow-hidden transition-all">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-4 gap-2">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/90 bg-black/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-white/20 truncate">
                    Overall Commission Achievement
                  </span>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium bg-black/25 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md backdrop-blur-xs shrink-0">
                    {result.overall.isComplete ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span className="text-white font-semibold">Fully Calculated</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-white/80" />
                        <span className="text-white/80">Enter Targets &gt; 0</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 sm:gap-3 my-1.5 sm:my-3">
                  <div className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                    {formatPercentage(result.overall.achievement)}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium">
                    {result.overall.achievement !== null && result.overall.achievement >= 100 ? (
                      <span className="bg-white/20 text-white font-bold px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">
                        Target Met & Exceeded
                      </span>
                    ) : (
                      <span>Total Weighted Contribution</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category breakdown boxes */}
              <div className="relative z-10 pt-2.5 sm:pt-4 mt-2 sm:mt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2.5 text-xs">
                {/* Acquisition */}
                <div className="bg-black/20 hover:bg-black/30 rounded-xl p-2 sm:p-2.5 border border-white/15 shadow-xs transition-colors backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px] font-bold truncate">
                    <Zap className="w-3 h-3 text-white/80 shrink-0" />
                    <span>Acquisition (60%)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black mt-0.5 sm:mt-1 text-white">
                    {formatPercentage(result.acquisition.total.contribution)}
                  </div>
                  <div className="text-[9px] text-white/70 font-medium truncate mt-0.5">
                    {result.acquisition.totalTarget !== null || result.acquisition.totalActual !== null
                      ? `Sum: ${result.acquisition.totalActual ?? 0} / ${result.acquisition.totalTarget ?? 0} Pts`
                      : 'Low • High • Cash'}
                  </div>
                </div>

                {/* Enterprise */}
                <div className="bg-black/20 hover:bg-black/30 rounded-xl p-2 sm:p-2.5 border border-white/15 shadow-xs transition-colors backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px] font-bold truncate">
                    <Building2 className="w-3 h-3 text-white/80 shrink-0" />
                    <span>Enterprise (10%)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black mt-0.5 sm:mt-1 text-white">
                    {formatPercentage(result.enterprise.totalContribution)}
                  </div>
                  <div className="text-[9px] text-white/70 font-medium truncate mt-0.5">
                    Accounts 5% • Lines 5%
                  </div>
                </div>

                {/* Terminal */}
                <div className="bg-black/20 hover:bg-black/30 rounded-xl p-2 sm:p-2.5 border border-white/15 shadow-xs transition-colors backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px] font-bold truncate">
                    <Smartphone className="w-3 h-3 text-white/80 shrink-0" />
                    <span>Terminal (10%)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black mt-0.5 sm:mt-1 text-white">
                    {formatPercentage(result.terminal.contribution)}
                  </div>
                  <div className="text-[9px] text-white/70 font-medium truncate mt-0.5">
                    Sales Value
                  </div>
                </div>

                {/* Fixed */}
                <div className="bg-black/20 hover:bg-black/30 rounded-xl p-2 sm:p-2.5 border border-white/15 shadow-xs transition-colors backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px] font-bold truncate">
                    <Wifi className="w-3 h-3 text-white/80 shrink-0" />
                    <span>Fixed (20%)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black mt-0.5 sm:mt-1 text-white">
                    {formatPercentage(result.fixed.totalContribution)}
                  </div>
                  <div className="text-[9px] text-white/70 font-medium truncate mt-0.5">
                    DSL 16% • Conn 4%
                  </div>
                </div>
              </div>

              {/* Progress bar line */}
              {result.overall.achievement !== null && result.overall.achievement > 0 && (
                <div 
                  className="absolute bottom-0 left-0 h-1.5 bg-white transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(result.overall.achievement, 100)}%` }}
                />
              )}
            </div>

            {/* TNPS Calculator Card (5 cols on lg) */}
            <div className="lg:col-span-5">
              <TNPSCalculator />
            </div>
          </section>

          {/* View Mode Switcher for Mobile & Desktop */}
          <div className="flex items-center justify-between gap-2 pt-1 no-print">
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Mobile Cards</span>
                <span className="md:hidden bg-red-50 text-[#E60000] text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                  Fast
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Full Table</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              {viewMode === 'cards' ? 'Touch-optimized cards layout' : 'Comprehensive 9-column grid layout'}
            </div>
          </div>

          {/* MAIN DATA INPUT SECTION:
              - Mobile Cards View: Friendly cards for touchscreens
              - Full Matrix Table View: Full desktop matrix table */}
          <section aria-labelledby="matrix-section">
            {/* 1. Mobile Cards View (Visible when viewMode === 'cards', hidden in print/export) */}
            <div className={viewMode === 'cards' ? 'block print:hidden report-hide-on-export' : 'hidden print:hidden report-hide-on-export'}>
              <MobileCommissionCards
                input={input}
                result={result}
                onChange={(updater) => setInput(updater)}
                acqNote={acqNote}
                onAcqNoteChange={handleAcqNoteChange}
              />
            </div>

            {/* 2. Full Matrix Table View (Visible when viewMode === 'table', ALWAYS visible in print & PDF export) */}
            <div className={viewMode === 'table' ? 'block' : 'hidden print:block report-show-on-export'}>
              <CommissionMatrix 
                input={input}
                result={result}
                onChange={(updater) => setInput(updater)}
                acqNote={acqNote}
                onAcqNoteChange={handleAcqNoteChange}
              />
            </div>
          </section>

          {/* Report Footer - Included in PDF, PNG export and Print */}
          <div className="hidden print:flex report-export-header items-center justify-between border-t border-slate-200 pt-3 text-[11px] text-slate-500">
            <div>Vodafone Store Performance & Commission Tracking • Confidential</div>
            <div>Generated with Vodafone Commission Calculator</div>
          </div>
        </div>

      </main>

      {/* Mobile Floating Bottom Bar - Sticky status for the 90% mobile users */}
      <aside aria-label="Mobile summary" className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg flex items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E60000] shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-500 font-semibold truncate leading-none">
              Overall Achievement
            </div>
            <div className="text-base font-black text-[#E60000] leading-tight">
              {formatPercentage(result.overall.achievement)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {result.overall.achievement !== null && result.overall.achievement >= 100 ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-md">
              Target Met
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md">
              {result.overall.isComplete ? 'Complete' : 'In Progress'}
            </span>
          )}

          <button
            type="button"
            onClick={scrollToTop}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Scroll to Top"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </div>
  );
}
