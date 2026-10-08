import { motion } from 'framer-motion';
import { GitBranch, Info } from 'lucide-react';
import ReasoningTimeline from '@/components/ReasoningTimeline';
import EvidenceMap from '@/components/EvidenceMap';
import { mockQAResponse, mockEvidenceGraph } from '@/data/mockData';

export default function Reasoning() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 shadow-md">
          <GitBranch className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Reasoning</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Explainable reasoning trace and evidence map</p>
        </div>
      </div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 p-4 flex items-start gap-3"
      >
        <Info className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
        <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
          This panel shows a user-facing explanation of how the answer is supported by retrieved evidence. No hidden chain-of-thought or private internal reasoning is exposed. The reasoning trace is a concise summary of the retrieval and synthesis process.
        </p>
      </motion.div>

      {/* Reasoning Timeline */}
      <ReasoningTimeline steps={mockQAResponse.reasoning} />

      {/* Evidence Map */}
      <EvidenceMap graph={mockEvidenceGraph} />
    </div>
  );
}
