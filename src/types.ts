export interface AnalysisResult {
  level: "KRITIS" | "WARNING" | "AMAN";
  category: "TYPO" | "STRUKTUR" | "BAHASA" | "ORISINALITAS";
  problem: string;
  reason: string;
  suggestion: string;
  revision: string;
}

export interface DocumentSection {
  title: string;
  background: string;
  problemStatement: string;
  objectives: string;
  methodology: string;
  references: string;
}

export interface FullAnalysis {
  sections: DocumentSection;
  analyses: AnalysisResult[];
  scores: {
    overall: number;
    structure: number;
    language: number;
    eyd: number;
    originality: number;
  };
  aiProbability: number;
  originalityScore: number;
}
