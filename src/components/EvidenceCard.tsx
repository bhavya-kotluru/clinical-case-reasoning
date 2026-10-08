import { motion } from 'framer-motion';
import { FileText, ExternalLink, Eye, Calendar, Users, BookMarked } from 'lucide-react';
import type { CaseReport } from '@/types';

interface EvidenceCardProps {
  report: CaseReport;
  index?: number;
}

function getRelevanceBadge(relevance: number) {
  if (relevance >= 0.8)
    return { label: 'High Relevance', className: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800', barColor: 'bg-teal-500' };
  if (relevance >= 0.6)
    return { label: 'Medium Relevance', className: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', barColor: 'bg-amber-500' };
  return { label: 'Low Relevance', className: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600', barColor: 'bg-slate-400' };
}

export default function EvidenceCard({ report, index = 0 }: EvidenceCardProps) {
  const badge = getRelevanceBadge(report.relevance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-elevated transition-shadow overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={`h-1 ${badge.barColor}`} />

      <div className="p-5">
        {/* Title + Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0">
              <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">{report.title}</h4>
          </div>
        </div>

        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.className} mb-3`}>
          {badge.label}
        </span>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {report.authors.join(', ')}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {report.year}
          </span>
          <span className="flex items-center gap-1">
            <BookMarked className="h-3.5 w-3.5" />
            {report.journal}
          </span>
        </div>

        {/* Snippet */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 p-3 mb-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{report.snippet}</p>
        </div>

        {/* Relevance bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Relevance Score</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{Math.round(report.relevance * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${report.relevance * 100}%` }}
              transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${badge.barColor}`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex-1 justify-center">
            <Eye className="h-3.5 w-3.5" />
            View Details
          </button>
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex-1 justify-center"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Source
          </a>
        </div>
      </div>
    </motion.div>
  );
}
