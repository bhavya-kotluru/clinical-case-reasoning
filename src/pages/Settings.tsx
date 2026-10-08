import { motion } from 'framer-motion';
import {
  Settings,
  Sun,
  Moon,
  MessageSquare,
  Eye,
  Sliders,
  Lock,
  Check,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { useState } from 'react';

interface ToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ label, description, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 mr-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          value ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md ${
            value ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

interface SectionProps {
  icon: typeof Settings;
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, description, children }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700">
            <Icon className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-2 divide-y divide-slate-50 dark:divide-slate-700/50">{children}</div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [showReasoning, setShowReasoning] = useState(true);
  const [showEvidenceMap, setShowEvidenceMap] = useState(true);
  const [highlightTerms, setHighlightTerms] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [saveHistory, setSaveHistory] = useState(true);
  const [numDocs, setNumDocs] = useState(10);
  const [confidenceThreshold, setConfidenceThreshold] = useState(60);
  const [answerStyle, setAnswerStyle] = useState<'detailed' | 'concise'>('detailed');

  const handleSave = () => {
    showToast('Settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 shadow-md">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Customize your Clinical RAG experience</p>
        </div>
      </div>

      {/* Theme */}
      <Section icon={theme === 'light' ? Sun : Moon} title="Theme" description="Choose your preferred color scheme">
        <div className="flex items-center justify-between py-3">
          <div className="flex-1 mr-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dark Mode</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Switch between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
              theme === 'dark' ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md ${
                theme === 'dark' ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </Section>

      {/* Response Preferences */}
      <Section icon={MessageSquare} title="Response Preferences" description="Control how answers are presented">
        <div className="py-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Answer Style</p>
          <div className="flex gap-2">
            {(['detailed', 'concise'] as const).map((style) => (
              <button
                key={style}
                onClick={() => setAnswerStyle(style)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  answerStyle === style
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <Toggle
          label="Show Reasoning Trace"
          description="Display the step-by-step reasoning timeline"
          value={showReasoning}
          onChange={setShowReasoning}
        />
        <Toggle
          label="Highlight Key Medical Terms"
          description="Emphasize important medical terminology in answers"
          value={highlightTerms}
          onChange={setHighlightTerms}
        />
        <Toggle
          label="Show Confidence Score"
          description="Display the answer confidence assessment"
          value={showConfidence}
          onChange={setShowConfidence}
        />
      </Section>

      {/* Evidence Display */}
      <Section icon={Eye} title="Evidence Display" description="Configure how evidence is shown">
        <Toggle
          label="Show Evidence Map"
          description="Display the visual evidence graph"
          value={showEvidenceMap}
          onChange={setShowEvidenceMap}
        />
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Number of Retrieved Documents</p>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{numDocs}</span>
          </div>
          <input
            type="range"
            min={3}
            max={20}
            value={numDocs}
            onChange={(e) => setNumDocs(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>3</span><span>20</span>
          </div>
        </div>
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Confidence Threshold</p>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min={30}
            max={95}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>30%</span><span>95%</span>
          </div>
        </div>
      </Section>

      {/* Privacy */}
      <Section icon={Lock} title="Privacy Settings" description="Control your data and privacy preferences">
        <Toggle
          label="Privacy Mode"
          description="Do not store questions or answers on the server"
          value={privacyMode}
          onChange={setPrivacyMode}
        />
        <Toggle
          label="Save Question History"
          description="Keep a record of your past questions"
          value={saveHistory}
          onChange={setSaveHistory}
        />
      </Section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          <Check className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
