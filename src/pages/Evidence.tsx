import { motion } from 'framer-motion';
import { Search, FileText, Layers, Filter } from 'lucide-react';
import EvidenceCard from '@/components/EvidenceCard';
import { mockCaseReports } from '@/data/mockData';

export default function Evidence() {
  const sorted = [...mockCaseReports].sort((a, b) => b.relevance - a.relevance);

  const highRelevance = sorted.filter((r) => r.relevance >= 0.8);
  const mediumRelevance = sorted.filter((r) => r.relevance >= 0.6 && r.relevance < 0.8);
  const lowRelevance = sorted.filter((r) => r.relevance < 0.6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 shadow-md">
          <Search className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Retrieved Evidence</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Clinical case reports ranked by relevance</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Relevance', count: highRelevance.length, color: 'bg-teal-500', textColor: 'text-teal-600 dark:text-teal-400' },
          { label: 'Medium Relevance', count: mediumRelevance.length, color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' },
          { label: 'Low Relevance', count: lowRelevance.length, color: 'bg-slate-400', textColor: 'text-slate-600 dark:text-slate-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-4 text-center"
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} mx-auto mb-2`}>
              <Layers className="h-5 w-5 text-white" />
            </div>
            <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.count}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Evidence cards grouped by relevance */}
      {[
        { title: 'High Relevance Evidence', subtitle: 'Most directly supporting case reports', items: highRelevance, icon: FileText },
        { title: 'Medium Relevance Evidence', subtitle: 'Partially supporting or related evidence', items: mediumRelevance, icon: Filter },
        { title: 'Low Relevance Evidence', subtitle: 'Peripheral or tangential findings', items: lowRelevance, icon: Filter },
      ].map((group) => group.items.length > 0 && (
        <div key={group.title}>
          <div className="flex items-center gap-2 mb-3">
            <group.icon className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">{group.title}</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">— {group.subtitle}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((report, i) => (
              <EvidenceCard key={report.id} report={report} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
