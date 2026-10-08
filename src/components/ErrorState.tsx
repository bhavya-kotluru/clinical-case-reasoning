import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'No Sufficiently Relevant Evidence',
  message = 'No sufficiently relevant evidence was retrieved for this question.',
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 shadow-card overflow-hidden"
    >
      <div className="p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 mb-4 mx-auto">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1.5">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
          >
            <RefreshCw className="h-4 w-4" />
            Try another question
          </button>
        )}
      </div>
    </motion.div>
  );
}
