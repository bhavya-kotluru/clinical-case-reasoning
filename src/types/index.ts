export interface CaseReport {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  specialty: string;
  relevance: number;
  snippet: string;
  abstract: string;
  url: string;
  split?: string;
  answer?: string;
  answer_idx?: string | number | null;
  retrievalScore?: number;
}

export interface ReasoningStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  details: string[];
  icon: string;
}

export interface Evidence {
  id: string;
  caseReportId: string;
  snippet: string;
  relevance: number;
  supportsAnswer: boolean;
}

export interface QAResponse {
  question: string;
  answer: string;
  highlightedAnswer: { text: string; isKeyTerm: boolean }[];
  answer_idx?: string | number | null;
  answer_option?: string;
  confidence: number;
  retrievalScore: number;
  sources: CaseReport[];
  evidence: Evidence[];
  reasoning: ReasoningStep[];
  evidenceStrength: number;
  supportingReports: number;
  retrievalQuality: number;
  sourceAgreement: number;
  concepts: string[];
  timestamp: string;
  dataset?: string;
  matchedQuestion?: string;
  matchedSplit?: string;
}

export interface HistoryEntry {
  id: string;
  question: string;
  date: string;
  confidence: number;
  evidenceCount: number;
  status: 'completed' | 'failed' | 'processing';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'question' | 'concept' | 'case' | 'evidence' | 'answer';
  x: number;
  y: number;
  description: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  strength: number;
}

export interface EvidenceGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
