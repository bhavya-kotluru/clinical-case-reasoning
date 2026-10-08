import { motion } from 'framer-motion';
import {
  Info,
  Target,
  Lightbulb,
  GitBranch,
  Search,
  Brain,
  Eye,
  Code2,
  ArrowDown,
  Database,
  Cpu,
  CheckCircle,
} from 'lucide-react';

const architectureSteps = [
  { label: 'User Question', icon: Info, color: 'from-primary-400 to-primary-500' },
  { label: 'Question Processing', icon: Cpu, color: 'from-primary-500 to-primary-600' },
  { label: 'Retriever', icon: Search, color: 'from-teal-400 to-teal-500' },
  { label: 'Clinical Case Reports', icon: Database, color: 'from-teal-500 to-teal-600' },
  { label: 'Relevant Evidence', icon: GitBranch, color: 'from-blue-400 to-blue-500' },
  { label: 'RAG Reasoning Layer', icon: Brain, color: 'from-blue-500 to-blue-600' },
  { label: 'Explainable Answer', icon: CheckCircle, color: 'from-teal-500 to-teal-600' },
  { label: 'Citations & Evidence', icon: Eye, color: 'from-primary-500 to-teal-500' },
];

const technologies = [
  { name: 'React + TypeScript', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'Recharts', category: 'Visualization' },
  { name: 'React Router', category: 'Routing' },
  { name: 'Lucide Icons', category: 'Icons' },
  { name: 'Vite', category: 'Build Tool' },
  { name: 'BM25 + Dense Retrieval', category: 'Retrieval' },
  { name: 'Sentence Transformers', category: 'Embeddings' },
  { name: 'LLM (GPT/LLaMA)', category: 'Generation' },
  { name: 'UMLS / SNOMED CT', category: 'Medical NLP' },
  { name: 'PubMed Central Corpus', category: 'Data Source' },
];

const sections = [
  {
    icon: Target,
    title: 'Problem Statement',
    content: 'Open clinical question answering requires not just accurate answers but also transparency. Existing systems often produce answers without clear evidence or reasoning, making them unsuitable for clinical decision support. There is a need for a system that grounds its answers in verifiable clinical case reports while explaining how it arrived at those answers.',
  },
  {
    icon: Lightbulb,
    title: 'Proposed Solution',
    content: 'An explainable Retrieval-Augmented Generation (RAG) system that answers open clinical questions using evidence retrieved from a corpus of clinical case reports. The system provides transparent reasoning traces, source citations, and confidence assessments, enabling users to verify the evidence supporting each answer.',
  },
];

const ragComponents = [
  {
    icon: Search,
    title: 'Retrieval',
    points: [
      'Hy retrieval combining BM25 sparse matching with dense semantic search',
      'Clinical case report corpus indexed using sentence-transformer embeddings',
      'Medical entity recognition and concept expansion using UMLS/SNOMED CT',
      'Relevance scoring with domain-specific clinical term weighting',
    ],
  },
  {
    icon: Brain,
    title: 'Reasoning',
    points: [
      'LLM-based reasoning over retrieved evidence with context window optimization',
      'Multi-step evidence comparison and synthesis',
      'Differential diagnosis generation with confidence weighting',
      'Cross-referencing with clinical guidelines (e.g., Rome IV criteria)',
    ],
  },
  {
    icon: Eye,
    title: 'Explainability',
    points: [
      'User-facing reasoning trace (not raw chain-of-thought)',
      'Evidence-to-answer mapping with relevance scores',
      'Visual evidence map showing question → concepts → evidence → answer',
      'Confidence assessment with source agreement metrics',
    ],
  },
];

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 shadow-md">
          <Info className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">About Project</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Explainable Retrieval-Augmented Reasoning for Clinical QA</p>
        </div>
      </div>

      {/* Project Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-primary-600 to-teal-500 p-8 text-white shadow-elevated"
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-white/80" />
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Project Goal</span>
        </div>
        <p className="text-base sm:text-lg leading-relaxed">
          An explainable Retrieval-Augmented Generation system for answering open clinical questions using evidence retrieved from clinical case reports.
        </p>
      </motion.div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700">
                <section.icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">{section.title}</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>

      {/* RAG Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500">
            <GitBranch className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">RAG Architecture</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">End-to-end pipeline from question to answer</p>
          </div>
        </div>

        {/* Flow diagram */}
        <div className="flex flex-col items-center py-4">
          {architectureSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r ${step.color} text-white shadow-md min-w-[200px]`}
              >
                <step.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">{step.label}</span>
              </motion.div>
              {i < architectureSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.05 }}
                >
                  <ArrowDown className="h-5 w-5 text-slate-300 dark:text-slate-600 my-1" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* RAG Components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ragComponents.map((component, i) => (
          <motion.div
            key={component.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                <component.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{component.title}</h4>
            </div>
            <ul className="space-y-2">
              {component.points.map((point, j) => (
                <li key={j} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700">
            <Code2 className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Technologies Used</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 p-3 text-center"
            >
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{tech.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{tech.category}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
