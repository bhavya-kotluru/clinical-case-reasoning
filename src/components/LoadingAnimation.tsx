import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, FileSearch, BarChart3, BrainCircuit, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  active: boolean;
}

const steps = [
  { label: 'Understanding clinical question…', icon: BrainCircuit },
  { label: 'Searching case reports…', icon: Search },
  { label: 'Ranking relevant evidence…', icon: BarChart3 },
  { label: 'Analyzing retrieved evidence…', icon: FileSearch },
  { label: 'Generating evidence-grounded answer…', icon: Sparkles },
];

export default function LoadingAnimation({ active }: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setCurrentStep(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden"
        >
          <div className="p-8">
            {/* Animated icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-700 border-t-primary-500 border-r-teal-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Processing…</span>
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-teal-500"
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2.5">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                const isPending = i > currentStep;

                return (
                  <motion.div
                    key={i}
                    animate={{ opacity: isPending ? 0.4 : 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative shrink-0">
                      {isDone && (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800">
                          <svg className="h-4 w-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {isActive && (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
                          <Loader2 className="h-4 w-4 text-primary-600 dark:text-primary-400 animate-spin" />
                        </div>
                      )}
                      {isPending && (
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                          <StepIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        </div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      isDone ? 'text-teal-600 dark:text-teal-400 font-medium' :
                      isActive ? 'text-primary-700 dark:text-primary-300 font-semibold' :
                      'text-slate-500 dark:text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
