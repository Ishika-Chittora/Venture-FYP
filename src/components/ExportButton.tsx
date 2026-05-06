import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import type { EvaluationResult, IdeaInput } from '@/types/evaluation';

interface Props {
  result: EvaluationResult;
  input: IdeaInput;
}

export function ExportButton({ result, input }: Props) {
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const w = doc.internal.pageSize.getWidth();
      let y = 20;

      doc.setFillColor(2, 6, 23);
      doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('VentureIQ Risk Report', 15, y);
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated ${new Date().toLocaleDateString()}`, 15, y);
      y += 12;

      doc.setDrawColor(30, 41, 59);
      doc.line(15, y, w - 15, y);
      y += 10;

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(input.name, 15, y);
      y += 7;
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`${input.industry} · ${input.fundingStage} · ${input.targetMarket}`, 15, y);
      y += 12;

// ...existing code...
      const metrics = [
        ['Overall Score', `${result.overallScore ?? 0}/100`],
        ['Risk Level', result.riskLevel],
        ['Burn Rate', `$${(result.burnRate ? (result.burnRate / 1000).toFixed(0) : '0')}K/mo`],
        ['CAC/LTV', `${result.cacLtvRatio?.toFixed(2) ?? '0.00'}x`],
        ['Break-even', `Month ${result.breakEvenMonth ?? 'N/A'}`],
        ['Sentiment', `${(result.marketSentiment ? (result.marketSentiment * 100).toFixed(0) : '0')}%`],
      ];
// ...existing code...

      const colW = (w - 30) / 3;
      metrics.forEach(([label, value], i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 15 + col * colW;
        const yPos = y + row * 16;
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(x, yPos - 5, colW - 4, 14, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(label, x + 3, yPos);
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(value, x + 3, yPos + 7);
        doc.setFont('helvetica', 'normal');
      });
      y += 36;

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 15, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      const summaryLines = doc.splitTextToSize(result.summary, w - 30);
      doc.text(summaryLines, 15, y);
      y += summaryLines.length * 4.5 + 8;

      const feasLabels = ['Market', 'Technical', 'Financial', 'Team', 'Timing'];
      const feasValues = [result.feasibility.market, result.feasibility.technical, result.feasibility.financial, result.feasibility.team, result.feasibility.timing];
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Feasibility Scores', 15, y);
      y += 7;
      feasLabels.forEach((label, i) => {
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(label, 15, y);
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(50, y - 3.5, 80, 5, 1, 1, 'F');
        const barW = (feasValues[i] / 100) * 80;
        doc.setFillColor(34, 197, 94);
        doc.roundedRect(50, y - 3.5, barW, 5, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(`${feasValues[i]}`, 134, y);
        y += 7;
      });
      y += 5;

      if (y < 250) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Top Recommendations', 15, y);
        y += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(203, 213, 225);
        result.recommendations.slice(0, 4).forEach((rec) => {
          const recLines = doc.splitTextToSize(`• ${rec}`, w - 30);
          doc.text(recLines, 15, y);
          y += recLines.length * 4.5 + 2;
        });
      }

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('VentureIQ · AI-Powered Startup Risk Engine · ventureiq.ai', 15, doc.internal.pageSize.getHeight() - 10);

      doc.save(`VentureIQ_${input.name.replace(/\s+/g, '_')}_Report.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generate}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition disabled:opacity-50"
    >
      {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {generating ? 'Generating...' : 'Download PDF Report'}
    </button>
  );
}
