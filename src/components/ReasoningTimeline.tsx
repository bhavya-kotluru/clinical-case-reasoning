import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Brain,
  Search,
  Layers,
  GitBranch,
  CheckCircle,
  ChevronDown,
  CircleDot,
  type LucideIcon,
} from 'lucide-react';
import type { ReasoningStep } from '@/types';

interface ReasoningTimelineProps {
  steps: ReasoningStep[];
}

const iconMap: Record<string, LucideIcon> = {
  MessageSquare: MessageSquare,
  Brain: Brain,
  Search: Search,
  Layers: Layers,
  GitBranch: GitBranch,
  CheckCircle: CheckCircle,
};

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/30',
    border: 'border-teal-200 dark:border-teal-800',
    label: 'Completed',
  },
  'in-progress': {
    icon: CircleDot,
    color: 'text-primary-600 dark:text-primary-400',
    bg: 'bg-primary-50 dark:bg-primary-900/30',
    border: 'border-primary-200 dark:border-primary-800',
    label: 'In Progress',
  },
  pending: {
    icon: CircleDot,
    color: 'text-slate-400 dark:text-slate-500',
    bg: 'bg-slate-50 dark:bg-slate-800',
    border: 'border-slate-200 dark:border-slate-700',
    label: 'Pending',
  },
};

export default function ReasoningTimeline({ steps }: ReasoningTimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500">
            <GitBranch className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Why this answer?</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Step-by-step reasoning trace</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

          {steps.map((step, index) => {
            const status = statusConfig[step.status];
            const StatusIcon = status.icon;
            const StepIcon = iconMap[step.icon] || CheckCircle;
            const isExpanded = expandedId === step.id;

            return (
              <div key={step.id} className="relative pb-6 last:pb-0">
                <div className="flex gap-4">
                  {/* Node */}
                  <div className="relative shrink-0 z-10">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${status.border} ${status.bg}`}>
                      <StatusIcon className={`h-5 w-5 ${status.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : step.id)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-start justify-between gap-2 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border border-slate-100 dark:border-slate-700">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <StepIcon className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Step {step.id}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${status.bg} ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">{step.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.description}</p>
                          </div>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 ml-[26px] rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 space-y-2">
                            {step.details.map((detail, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-2"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{detail}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
