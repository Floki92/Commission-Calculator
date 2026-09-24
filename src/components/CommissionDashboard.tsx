import React, { useState, useMemo, useEffect } from 'react';
import { CommissionInput, ComponentInput } from '../features/commission/commission.types';
import { calculateCommission } from '../features/commission/commission.calculator';
import { formatPercentage } from '../features/commission/commission.utils';
import { CommissionMatrix } from './CommissionMatrix';
import { VodafoneLogo } from './VodafoneLogo';
import { TNPSCalculator } from './TNPSCalculator';
import { RefreshCw, CheckCircle2, AlertCircle, Heart, FileText, Loader2, Zap, Building2, Smartphone, Wifi } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const emptyComponent: ComponentInput = { target: null, actual: null };

const initialInput: CommissionInput = {
  voice: { ...emptyComponent },
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

const COMMISSION_STORAGE_KEY = 'vodafone_commission_input_v1';

function getStoredCommissionInput(): CommissionInput {
  if (typeof window === 'undefined') return initialInput;
  try {
    const raw = localStorage.getItem(COMMISSION_STORAGE_KEY);
    if (!raw) return initialInput;
    const parsed = JSON.parse(raw);
    return {
      voice: {
        target: typeof parsed?.voice?.target === 'number' ? parsed.voice.target : null,
        actual: typeof parsed?.voice?.actual === 'number' ? parsed.voice.actual : null,
      },
      enterprise: {
        accounts: {
          target: typeof parsed?.enterprise?.accounts?.target === 'number' ? parsed.enterprise.accounts.target : null,
          actual: typeof parsed?.enterprise?.accounts?.actual === 'number' ? parsed.enterprise.accounts.actual : null,
        },
        lines: {
          target: typeof parsed?.enterprise?.lines?.target === 'number' ? parsed.enterprise.lines.target : null,
          actual: typeof parsed?.enterprise?.lines?.actual === 'number' ? parsed.enterprise.lines.actual : null,
        },
      },
      terminal: {
        target: typeof parsed?.terminal?.target === 'number' ? parsed.terminal.target : null,
        actual: typeof parsed?.terminal?.actual === 'number' ? parsed.terminal.actual : null,
      },
      fixed: {
        dsl: {
          target: typeof parsed?.fixed?.dsl?.target === 'number' ? parsed.fixed.dsl.target : null,
          actual: typeof parsed?.fixed?.dsl?.actual === 'number' ? parsed.fixed.dsl.actual : null,
        },
        connectivity: {
          target: typeof parsed?.fixed?.connectivity?.target === 'number' ? parsed.fixed.connectivity.target : null,
          actual: typeof parsed?.fixed?.connectivity?.actual === 'number' ? parsed.fixed.connectivity.actual : null,
        },
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
    } catch (err) {
      console.error('Error clearing saved commission input:', err);
    }
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
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-8 font-sans">
      {/* Top Navigation with Vodafone Brandmark */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-[1920px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Vodafone Logo */}
            <div className="flex-shrink-0 transition-transform hover:scale-105">
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

      {/* Main Content Area: Expanded Desktop Width & Optimized Mobile Spacing */}
      <main className="max-w-[1920px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        
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
                <div className="flex items-center justify-between mb-2.5 sm:mb-4 gap-2">
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
                      <span className="bg-white/20 text-white font-bold px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">Target Met & Exceeded</span>
                    ) : (
                      <span>Total Weighted Contribution</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category breakdown boxes - Clean neutral styling without individual theme colors */}
              <div className="relative z-10 pt-2.5 sm:pt-4 mt-2.5 sm:mt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2.5 text-xs">
                {/* Acquisition */}
                <div className="bg-black/20 hover:bg-black/30 rounded-xl p-2 sm:p-2.5 border border-white/15 shadow-xs transition-colors backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px] font-bold truncate">
                    <Zap className="w-3 h-3 text-white/80 shrink-0" />
                    <span>Acquisition (60%)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black mt-0.5 sm:mt-1 text-white">{formatPercentage(result.voice.contribution)}</div>
                </div>

                {/* Enterprise */}
                <div className="bg-black/20 hover:bg-black/30 rounded-xl p-2 sm:p-2.5 border border-white/15 shadow-xs transition-colors backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px] font-bold truncate">
                    <Building2 className="w-3 h-3 text-white/80 shrink-0" />
                    <span>Enterprise (10%)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black mt-0.5 sm:mt-1 text-white">{formatPercentage(result.enterprise.totalContribution)}</div>
                </div>

                {/* Terminal */}
                <div className="bg-black/20 hover:bg-black/30 rounded-xl p-2 sm:p-2.5 border border-white/15 shadow-xs transition-colors backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px] font-bold truncate">
                    <Smartphone className="w-3 h-3 text-white/80 shrink-0" />
                    <span>Terminal (10%)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black mt-0.5 sm:mt-1 text-white">{formatPercentage(result.terminal.contribution)}</div>
                </div>

                {/* Fixed */}
                <div className="bg-black/20 hover:bg-black/30 rounded-xl p-2 sm:p-2.5 border border-white/15 shadow-xs transition-colors backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-white/80 text-[9px] sm:text-[10px] font-bold truncate">
                    <Wifi className="w-3 h-3 text-white/80 shrink-0" />
                    <span>Fixed (20%)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black mt-0.5 sm:mt-1 text-white">{formatPercentage(result.fixed.totalContribution)}</div>
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

          {/* 3-ROW MATRIX TABLE:
              Row 1: Target
              Row 2: Actual / Achieve
              Row 3: Percentages, Contributions & Missing */}
          <section aria-labelledby="matrix-section">
            <CommissionMatrix 
              input={input}
              result={result}
              onChange={(updater) => setInput(updater)}
            />
          </section>

          {/* Report Footer - Included in PDF, PNG export and Print */}
          <div className="hidden print:flex report-export-header items-center justify-between border-t border-slate-200 pt-3 text-[11px] text-slate-500">
            <div>Vodafone Store Performance & Commission Tracking • Confidential</div>
            <div>Generated with Vodafone Commission Calculator</div>
          </div>
        </div>

      </main>
    </div>
  );
}
