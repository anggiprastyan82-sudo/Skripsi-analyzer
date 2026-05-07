import React, { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { AnalysisView } from '@/components/AnalysisView';
import { AcademicChat } from '@/components/AcademicChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileSearch, MessageSquare, History, GraduationCap, LayoutDashboard, Database, ShieldCheck, Upload, Clock, BookOpen, ChevronRight, FileText, BarChart3, Download } from 'lucide-react';
import { analyzeThesis } from '@/lib/gemini';
import { FullAnalysis, AnalysisResult } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function App() {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setFileName(file.name);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const parseRes = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });
      const parseData = await parseRes.json();
      
      if (parseData.error) throw new Error(parseData.error);
      
      const analysisResult = await analyzeThesis(parseData.text);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error(err);
      setError("Gagal menganalisis dokumen. Pastikan file valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">Analisis AI Skripsi</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <SidebarLink icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
          <SidebarLink icon={<Upload className="w-5 h-5" />} label="Upload Dokumen" />
          <SidebarLink icon={<Clock className="w-5 h-5" />} label="Riwayat Analisis" />
          <SidebarLink icon={<BookOpen className="w-5 h-5" />} label="Tanya AI Dosen" />
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50 shadow-sm">
            <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-widest font-bold">Status Akun</p>
            <p className="text-sm font-semibold mb-3">Premium Member</p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-2 overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full w-[80%]"></div>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">12/15 Analisis Sisa Bulan Ini</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-800 truncate max-w-md">
              {analysis ? fileName : "Selamat Datang di Analisis AI"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {analysis ? `Analisis terakhir: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}` : "Reviewer Akademik Profesional"}
            </p>
          </div>
          <div className="flex gap-3">
            {analysis && (
              <button 
                onClick={() => setAnalysis(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 ring-1 ring-slate-200 shadow-sm"
              >
                Mulai Baru
              </button>
            )}
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold shadow-sm shadow-teal-200 hover:bg-teal-700 transition-all active:scale-95 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {!analysis && !loading ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="max-w-2xl mb-12">
                  <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                    Optimalkan Skripsi Anda <br />
                    <span className="text-teal-600">dengan Kecerdasan AI.</span>
                  </h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Reviewer akademik berbasis AI yang membantu mendeteksi kesalahan struktur, 
                    typo, gaya bahasa, hingga probabilitas penggunaan LLM dalam draft penelitian Anda.
                  </p>
                </div>
                
                <div className="w-full max-w-xl">
                  <FileUploader onFileSelect={handleFileUpload} isLoading={loading} />
                  {error && <p className="mt-4 text-red-500 font-bold text-sm bg-red-50 py-2 px-4 rounded-lg border border-red-100 italic">{error}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16">
                  <FeatureBox icon={<FileSearch className="w-6 h-6 text-teal-600" />} title="Analisis Struktur" desc="Sinkronisasi otomatis antara rumusan masalah & tujuan." />
                  <FeatureBox icon={<ShieldCheck className="w-6 h-6 text-teal-600" />} title="Deteksi Orisinalitas" desc="Pengecekan probabilitas AI & kemiripan teks akademik." />
                  <FeatureBox icon={<Sparkles className="w-6 h-6 text-teal-600" />} title="Revisi Otomatis" desc="Perbaikan bahasa akademik dengan standar jurnal Scopus." />
                </div>
              </motion.div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-8">
                <div className="relative">
                  <div className="w-32 h-32 border-[6px] border-slate-200 rounded-full border-t-teal-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-teal-600 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Dosen Sedang Membaca...</h3>
                  <p className="text-slate-500 font-medium">Menganalisis 3,421 kata dan memvalidasi struktur penelitian</p>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <Tabs defaultValue="analysis" className="w-full">
                  <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-slate-200 self-start w-fit mb-8 shadow-sm">
                    <TabsList className="bg-transparent h-auto p-0">
                      <TabsTrigger value="analysis" className="px-6 py-2 rounded-lg text-sm font-bold data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-none border-none">Analisis AI</TabsTrigger>
                      <TabsTrigger value="chat" className="px-6 py-2 rounded-lg text-sm font-bold data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-none border-none">Tanya AI Dosen</TabsTrigger>
                      <TabsTrigger value="structure" className="px-6 py-2 rounded-lg text-sm font-bold data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-none border-none">Review Struktur</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="analysis" className="mt-0 ring-0 focus-visible:ring-0">
                    <AnalysisView data={analysis!} />
                  </TabsContent>

                  <TabsContent value="chat" className="mt-0 ring-0 focus-visible:ring-0">
                    <div className="grid grid-cols-1 gap-6">
                      <AcademicChat />
                    </div>
                  </TabsContent>

                  <TabsContent value="structure" className="mt-0 ring-0 focus-visible:ring-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AcademicSection title="Latar Belakang" content={analysis?.sections.background} />
                      <AcademicSection title="Rumusan Masalah" content={analysis?.sections.problemStatement} />
                      <AcademicSection title="Tujuan Penelitian" content={analysis?.sections.objectives} />
                      <AcademicSection title="Metodologi" content={analysis?.sections.methodology} />
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-teal-600/20 text-teal-400 border border-teal-500/20 font-bold" 
        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
    )}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </a>
  );
}

function FeatureBox({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
        {icon}
      </div>
      <h4 className="font-bold text-slate-800 mb-2 text-lg">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function AcademicSection({ title, content }: { title: string, content?: string }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-600" />
          {title}
        </h3>
      </div>
      <div className="p-6 flex-1">
        <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap italic">
          {content || "Konten tidak terdeteksi dalam scope dokumen yang dianalisis."}
        </p>
      </div>
    </div>
  );
}
