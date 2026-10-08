import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2, Search, Mic, Sparkles } from 'lucide-react';
import { exampleQuestions } from '@/data/mockData';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  onClear: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export default function QuestionInput({ onSubmit, onClear, disabled, compact }: QuestionInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className={`relative rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all focus-within:border-primary-400 dark:focus-within:border-primary-500 shadow-card ${compact ? '' : 'shadow-elevated'}`}>
        <div className="flex items-start gap-3 p-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/30 dark:to-teal-900/30 shrink-0">
            <Search className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask a clinical case-report question…"
            rows={compact ? 2 : 3}
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none disabled:opacity-50"
          />
          <button
            className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
            title="Voice input"
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 pb-4 gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
              Press ⌘+Enter to ask
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-primary-700 hover:to-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Ask AI
          </button>
        </div>
      </div>

      {!compact && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="h-3.5 w-3.5 text-primary-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Example Questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setValue(q)}
                className="text-left text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors max-w-full"
              >
                {q.length > 60 ? q.substring(0, 60) + '…' : q}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
