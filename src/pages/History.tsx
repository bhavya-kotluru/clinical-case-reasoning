import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Trash2, ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { mockHistory } from '@/data/mockData';
import { useToast } from '@/contexts/ToastContext';

export default function HistoryPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(mockHistory);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return entries;
    return entries.filter((e) => e.question.toLowerCase().includes(search.toLowerCase()));
  }, [search, entries]);

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
    showToast('History entry deleted', 'success');
  };

  const statusConfig = {
    completed: { icon: CheckCircle, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30', label: 'Completed' },
    failed: { icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', label: 'Failed' },
    processing: { icon: Loader2, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/30', label: 'Processing' },
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 shadow-md">
          <History className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">History</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Previously asked clinical questions</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search history…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 transition-colors shadow-soft"
        />
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      {filtered.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-5 py-3">Question</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-5 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-5 py-3">Confidence</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-5 py-3">Evidence</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-5 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => {
                  const status = statusConfig[entry.status];
                  const StatusIcon = status.icon;
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-5 py-3.5 max-w-md">
                        <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">{entry.question}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(entry.date)}</td>
                      <td className="px-5 py-3.5">
                        {entry.confidence > 0 ? (
                          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{entry.confidence}%</span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{entry.evidenceCount}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                          <StatusIcon className={`h-3 w-3 ${entry.status === 'processing' ? 'animate-spin' : ''}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => showToast('Opening question…', 'info')}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(entry.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((entry, i) => {
              const status = statusConfig[entry.status];
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-4"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">{entry.question}</p>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(entry.date)}</span>
                    {entry.confidence > 0 && (
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{entry.confidence}%</span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">{entry.evidenceCount} evidence</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.color}`}>
                      <StatusIcon className={`h-2.5 w-2.5 ${entry.status === 'processing' ? 'animate-spin' : ''}`} />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Opening question…', 'info')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open
                    </button>
                    <button
                      onClick={() => setDeleteId(entry.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card py-16 text-center"
        >
          <History className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No history entries found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Ask a clinical question to start building your history</p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-2xl bg-white dark:bg-slate-800 shadow-elevated p-6 max-w-sm w-full"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 mb-4 mx-auto">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white text-center mb-1.5">Delete History Entry?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5">
                  This action cannot be undone. The question will be permanently removed from your history.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
