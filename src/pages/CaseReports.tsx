import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import EvidenceCard from '@/components/EvidenceCard';
import { mockCaseReports, specialties } from '@/data/mockData';

const RESULTS_PER_PAGE = 6;

export default function CaseReports() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');
  const [yearFilter, setYearFilter] = useState('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = [...mockCaseReports];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.authors.some((a) => a.toLowerCase().includes(q)) ||
          r.journal.toLowerCase().includes(q) ||
          r.snippet.toLowerCase().includes(q)
      );
    }

    if (specialty !== 'all') {
      result = result.filter((r) => r.specialty === specialty);
    }

    if (yearFilter !== 'all') {
      result = result.filter((r) => r.year === Number(yearFilter));
    }

    if (sortBy === 'relevance') {
      result.sort((a, b) => b.relevance - a.relevance);
    } else {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [search, specialty, sortBy, yearFilter]);

  const totalPages = Math.ceil(filtered.length / RESULTS_PER_PAGE);
  const paginated = filtered.slice(page * RESULTS_PER_PAGE, (page + 1) * RESULTS_PER_PAGE);

  const years = [...new Set(mockCaseReports.map((r) => r.year))].sort((a, b) => b - a);

  const resetPage = () => setPage(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 shadow-md">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Case Reports</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Browse and search the clinical case report library</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder="Search by title, author, journal, or content…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="h-4 w-4" />
            Filters:
          </div>

          <select
            value={specialty}
            onChange={(e) => { setSpecialty(e.target.value); resetPage(); }}
            className="text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary-400 transition-colors"
          >
            <option value="all">All Specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value); resetPage(); }}
            className="text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary-400 transition-colors"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date')}
              className="text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary-400 transition-colors"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>{filtered.length} case reports found</span>
        </div>
      </div>

      {/* Cards */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((report, i) => (
            <EvidenceCard key={report.id} report={report} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card py-16 text-center"
        >
          <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No case reports match your filters</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                page === i
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
