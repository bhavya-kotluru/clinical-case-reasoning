import { motion } from 'framer-motion';
import { Gauge, FileText, Search, CheckSquare } from 'lucide-react';
import type { QAResponse } from '@/types';

interface ConfidenceScoreProps {
  response: QAResponse;
}

interface MetricProps {
  icon: typeof Gauge;
  label: string;
  value: number;
  index: number;
}

function Metric({ icon: Icon, label, value, index }: MetricProps) {
  const color =
    value >= 80 ? 'text-teal-600 dark:text-teal-400' :
    value >= 60 ? 'text-primary-600 dark:text-primary-400' :
    'text-amber-600 dark:text-amber-400';
  const barColor =
    value >= 80 ? 'from-teal-400 to-teal-500' :
    value >= 60 ? 'from-primary-400 to-primary-500' :
    'from-amber-400 to-amber-500';

  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xl font-bold ${color}`}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
        />
      </div>
    </div>
  );
}

export default function ConfidenceScore({ response }: ConfidenceScoreProps) {
  const confidence = Math.round(response.confidence * 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Answer Confidence</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Quality & reliability metrics</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Circular progress */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                className="stroke-slate-100 dark:stroke-slate-700"
                strokeWidth="10"
              />
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#confidenceGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-slate-800 dark:text-white"
              >
                {confidence}%
              </motion.span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Confidence</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Metric icon={FileText} label="Evidence Strength" value={response.evidenceStrength} index={0} />
          <Metric icon={FileText} label="Supporting Reports" value={Math.round((response.supportingReports / 8) * 100)} index={1} />
          <Metric icon={Search} label="Retrieval Quality" value={response.retrievalQuality} index={2} />
          <Metric icon={CheckSquare} label="Source Agreement" value={response.sourceAgreement} index={3} />
        </div>

        {/* Supporting reports count */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 p-3.5 border border-primary-100 dark:border-primary-800">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Supporting Case Reports</span>
          <span className="text-lg font-bold text-primary-700 dark:text-primary-300">{response.supportingReports}</span>
        </div>
      </div>
    </motion.div>
  );
}
