import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Brain, FileText, Layers, CheckCircle, type LucideIcon } from 'lucide-react';
import type { EvidenceGraph } from '@/types';

interface EvidenceMapProps {
  graph: EvidenceGraph;
}

const nodeConfig: Record<
  string,
  { icon: LucideIcon; color: string; bg: string; border: string; size: number }
> = {
  question: { icon: HelpCircle, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/30', border: 'border-primary-300 dark:border-primary-700', size: 48 },
  concept: { icon: Brain, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30', border: 'border-teal-300 dark:border-teal-700', size: 44 },
  case: { icon: FileText, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-white dark:bg-slate-700', border: 'border-slate-300 dark:border-slate-600', size: 44 },
  evidence: { icon: Layers, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-300 dark:border-amber-700', size: 44 },
  answer: { icon: CheckCircle, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30', border: 'border-teal-300 dark:border-teal-700', size: 52 },
};

export default function EvidenceMap({ graph }: EvidenceMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNode = (id: string) => graph.nodes.find((n) => n.id === id);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Evidence Map</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Visualizing the reasoning pathway</p>
          </div>
        </div>
      </div>

      <div className="relative p-6" style={{ height: '460px' }}>
        {/* SVG edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {graph.edges.map((edge, i) => {
            const from = getNode(edge.from);
            const to = getNode(edge.to);
            if (!from || !to) return null;

            const isHighlighted =
              hoveredNode === edge.from || hoveredNode === edge.to;

            return (
              <motion.line
                key={i}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={isHighlighted ? '#14b8a6' : '#cbd5e1'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray={isHighlighted ? '0' : '4 4'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="dark:opacity-40"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        <div className="relative w-full h-full" style={{ zIndex: 2 }}>
          {graph.nodes.map((node, i) => {
            const config = nodeConfig[node.type];
            const Icon = config.icon;
            const isHovered = hoveredNode === node.id;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div
                  className={`relative flex items-center justify-center rounded-xl border-2 ${config.border} ${config.bg} shadow-card cursor-pointer transition-all ${isHovered ? 'scale-110 shadow-elevated z-10' : ''}`}
                  style={{ width: config.size, height: config.size }}
                >
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>

                {/* Label */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-[10px] font-semibold text-slate-600 dark:text-slate-300 text-center transition-opacity`}>
                  {node.label}
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-slate-800 dark:bg-slate-900 text-white text-xs p-3 shadow-elevated z-20"
                    >
                      <p className="font-semibold mb-1 text-[11px]">{node.label}</p>
                      <p className="text-[10px] text-slate-300 leading-relaxed">{node.description}</p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-900 rotate-45 -mt-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-slate-100 dark:border-slate-700 p-3">
          {[
            { label: 'Question', color: 'bg-primary-400' },
            { label: 'Concept', color: 'bg-teal-400' },
            { label: 'Case Report', color: 'bg-slate-400' },
            { label: 'Evidence', color: 'bg-amber-400' },
            { label: 'Answer', color: 'bg-teal-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
