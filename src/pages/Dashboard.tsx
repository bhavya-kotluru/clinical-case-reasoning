import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  MessageSquareText,
  Search,
  Gauge,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Activity,
} from 'lucide-react';
import QuestionInput from '@/components/QuestionInput';
import { useToast } from '@/contexts/ToastContext';
import { stats, exampleQuestions } from '@/data/mockData';

const statCards = [
  { label: 'Case Reports Indexed', value: stats.caseReportsIndexed.toLocaleString(), icon: FileText, change: '+124 this week', color: 'from-primary-500 to-primary-600' },
  { label: 'Questions Answered', value: stats.questionsAnswered.toLocaleString(), icon: MessageSquareText, change: '+42 today', color: 'from-teal-500 to-teal-600' },
  { label: 'Evidence Retrieved', value: stats.evidenceRetrieved.toLocaleString(), icon: Search, change: '+856 this week', color: 'from-blue-500 to-blue-600' },
  { label: 'Average Confidence', value: `${stats.averageConfidence}%`, icon: Gauge, change: '+2.3% this month', color: 'from-emerald-500 to-emerald-600' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = (question: string) => {
    navigate('/qa', { state: { question } });
  };

  const handleClear = () => {
    showToast('Input cleared', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-teal-500 p-8 sm:p-10 text-white shadow-elevated"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-teal-300/20 rounded-full translate-y-1/2 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-white/80" />
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">AI-Powered Clinical Research</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
            Clinical Case-Report Intelligence
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed mb-6">
            Ask clinical questions and receive evidence-grounded answers with transparent reasoning and supporting case reports.
          </p>

          {/* Question Input */}
          <QuestionInput onSubmit={handleSubmit} onClear={handleClear} />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
                <stat.icon className="h-5.5 w-5.5 text-white" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mb-0.5">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{stat.label}</p>
            <div className="flex items-center gap-1 text-[11px] font-medium text-teal-600 dark:text-teal-400">
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Access + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-6"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Quick Access</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Jump to key features</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Clinical Q&A', desc: 'Ask a question', icon: MessageSquareText, route: '/qa' },
              { label: 'Case Reports', desc: 'Browse library', icon: FileText, route: '/case-reports' },
              { label: 'Retrieved Evidence', desc: 'View evidence', icon: Search, route: '/evidence' },
              { label: 'Reasoning', desc: 'Explainability', icon: Activity, route: '/reasoning' },
              { label: 'History', desc: 'Past questions', icon: TrendingUp, route: '/history' },
              { label: 'About Project', desc: 'Learn more', icon: Sparkles, route: '/about' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.route)}
                className="group flex flex-col items-start gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all text-left"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-primary-500 group-hover:border-primary-500 transition-colors">
                  <item.icon className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.label}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Example Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-6"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Try a Question</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Example clinical queries</p>

          <div className="space-y-2">
            {exampleQuestions.slice(0, 4).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(q)}
                className="w-full text-left text-xs px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 hover:border-primary-200 dark:hover:border-primary-800 transition-colors line-clamp-2"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
