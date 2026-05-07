import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Copy, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { FullAnalysis, AnalysisResult } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface AnalysisViewProps {
  data: FullAnalysis;
}

export function AnalysisView({ data }: AnalysisViewProps) {
  const getLevelBadge = (level: AnalysisResult['level']) => {
    switch (level) {
      case 'KRITIS': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-2 py-0.5 text-[10px] font-black uppercase rounded">KRITIS</Badge>;
      case 'WARNING': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-2 py-0.5 text-[10px] font-black uppercase rounded">WARNING</Badge>;
      case 'AMAN': return <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 border-none px-2 py-0.5 text-[10px] font-black uppercase rounded">AMAN</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const kritisCount = data.analyses.filter(a => a.level === 'KRITIS').length;
  const warningCount = data.analyses.filter(a => a.level === 'WARNING').length;
  const amanCount = data.analyses.filter(a => a.level === 'AMAN').length;

  return (
    <div className="space-y-8 pb-20">
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Skor Kualitas" 
          value={data.scores.overall.toString()} 
          suffix="/ 100" 
          desc="+4 poin dari standar rata-rata"
          trend="up"
        />
        <StatCard 
          title="Orisinalitas" 
          value={`${data.originalityScore}%`} 
          desc="Sangat Baik (Indikasi Plagiasi Rendah)"
        />
        <StatCard 
          title="Probabilitas AI" 
          value={`${data.aiProbability}%`} 
          desc="Indikasi penggunaan LLM terdeteksi"
          isWarning={data.aiProbability > 20}
        />
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Temuan Masalah</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-center">
              <span className="block text-lg font-bold text-red-500">{kritisCount}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Kritis</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-amber-500">{warningCount}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Warning</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-teal-500">{amanCount}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Aman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Daftar Detail Temuan Berdasarkan AI</h3>
        {data.analyses.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className={cn(
              "bg-white rounded-2xl border-l-4 p-5 shadow-sm border-t border-r border-b border-slate-200 group transition-all hover:shadow-md",
              item.level === 'KRITIS' ? "border-l-red-500" : 
              item.level === 'WARNING' ? "border-l-amber-400" : "border-l-teal-500"
            )}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getLevelBadge(item.level)}
                  <h4 className="font-bold text-slate-800 text-base">{item.problem}</h4>
                </div>
                <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-400 font-medium">Bagian: {item.category}</Badge>
              </div>
              
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                {item.reason}
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Saran Perbaikan AI</p>
                <p className="text-sm text-slate-700 italic font-medium">"{item.suggestion}"</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm shadow-teal-100 flex items-center gap-1.5 active:scale-95 transition-all">
                  <Sparkles className="w-3.5 h-3.5" /> Perbaiki dengan AI
                </button>
                <button 
                  onClick={() => copyToClipboard(item.revision)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm active:scale-95 transition-all"
                >
                  Salin Saran
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, suffix, desc, trend, isWarning }: { 
  title: string, 
  value: string, 
  suffix?: string, 
  desc: string, 
  trend?: 'up' | 'down',
  isWarning?: boolean
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
        <div className="flex items-end gap-1.5">
          <span className={cn("text-3xl font-bold tracking-tight", isWarning ? "text-red-500" : "text-slate-800")}>{value}</span>
          {suffix && <span className="text-teal-500 font-bold mb-1 text-sm">{suffix}</span>}
        </div>
      </div>
      <p className={cn(
        "text-xs mt-3 font-medium flex items-center gap-1",
        trend === 'up' ? "text-teal-600" : isWarning ? "text-red-500" : "text-slate-500"
      )}>
        {trend === 'up' && <TrendingUp className="w-3 h-3" />}
        {isWarning && <AlertTriangle className="w-3 h-3" />}
        {desc}
      </p>
    </div>
  );
}
