import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, BookOpen } from 'lucide-react';
import type { QAResponse } from '@/types';

interface AnswerCardProps {
  response: QAResponse;
}

export default function AnswerCard({ response }: AnswerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">AI Generated Answer</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Evidence-grounded response</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">Evidence-Based</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
            <span className="text-xs font-bold text-primary-700 dark:text-primary-300">{Math.round(response.confidence * 100)}% Confidence</span>
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="px-6 pt-5">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Question</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{response.question}</p>
      </div>

      {/* Answer */}
      <div className="px-6 py-5">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">Answer</p>
        <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 space-y-1">
          {response.highlightedAnswer.map((segment, i) => (
            <span
              key={i}
              className={
                segment.isKeyTerm
                  ? 'font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 rounded px-1 py-0.5'
                  : ''
              }
            >
              {segment.text}
            </span>
          ))}
        </div>
      </div>

      {/* Concepts */}
      <div className="px-6 pb-5">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">Clinical Concepts</p>
        <div className="flex flex-wrap gap-2">
          {response.concepts.map((concept, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-4 bg-amber-50/50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            This system is intended for research and educational purposes and does not replace professional medical advice.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
