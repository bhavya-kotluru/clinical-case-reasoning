import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, RotateCcw } from 'lucide-react';

import QuestionInput from '@/components/QuestionInput';
import AnswerCard from '@/components/AnswerCard';
import EvidenceCard from '@/components/EvidenceCard';
import ReasoningTimeline from '@/components/ReasoningTimeline';
import ConfidenceScore from '@/components/ConfidenceScore';
import EvidenceMap from '@/components/EvidenceMap';
import LoadingAnimation from '@/components/LoadingAnimation';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';

import { askQuestion } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';

import type { QAResponse, EvidenceGraph } from '@/types';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export default function ClinicalQA() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [state, setState] = useState<LoadingState>('idle');
  const [response, setResponse] = useState<QAResponse | null>(null);

  const initialState = location.state as { question?: string } | null;

  /*
   * Create the Evidence Map dynamically from the actual
   * question, concepts and retrieved MedQA records.
   */
  const createEvidenceGraph = (data: QAResponse): EvidenceGraph => {
    const nodes: EvidenceGraph['nodes'] = [];
    const edges: EvidenceGraph['edges'] = [];

    // Question node
    nodes.push({
      id: 'question',
      label: 'Question',
      type: 'question',
      x: 12,
      y: 50,
      description: data.question,
    });

    // Concept nodes
    const concepts = data.concepts?.slice(0, 5) || [];

    concepts.forEach((concept, index) => {
      const yPositions = [20, 35, 50, 65, 80];

      nodes.push({
        id: `concept-${index}`,
        label: concept,
        type: 'concept',
        x: 32,
        y: yPositions[index],
        description: `Clinical concept identified from the submitted question: ${concept}`,
      });

      edges.push({
        from: 'question',
        to: `concept-${index}`,
        strength: 0.8,
      });
    });

    // Retrieved MedQA questions
    const sources = data.sources?.slice(0, 5) || [];

    sources.forEach((source, index) => {
      const yPositions = [15, 32, 49, 66, 83];

      nodes.push({
        id: `source-${index}`,
        label: `MedQA ${index + 1}`,
        type: 'case',
        x: 60,
        y: yPositions[index],
        description: source.title,
      });

      if (concepts.length > 0) {
        edges.push({
          from: `concept-${index % concepts.length}`,
          to: `source-${index}`,
          strength: source.relevance,
        });
      } else {
        edges.push({
          from: 'question',
          to: `source-${index}`,
          strength: source.relevance,
        });
      }
    });

    // Evidence node
    nodes.push({
      id: 'evidence',
      label: 'Retrieved Evidence',
      type: 'evidence',
      x: 78,
      y: 50,
      description: `${sources.length} relevant MedQA-USMLE records retrieved from the dataset.`,
    });

    sources.forEach((_, index) => {
      edges.push({
        from: `source-${index}`,
        to: 'evidence',
        strength: data.sources[index]?.relevance || 0.5,
      });
    });

    // Answer node
    nodes.push({
      id: 'answer',
      label: 'Answer',
      type: 'answer',
      x: 92,
      y: 50,
      description: data.answer,
    });

    edges.push({
      from: 'evidence',
      to: 'answer',
      strength: data.confidence,
    });

    return {
      nodes,
      edges,
    };
  };

  const [evidenceGraph, setEvidenceGraph] = useState<EvidenceGraph | null>(
    null
  );

  useEffect(() => {
    if (initialState?.question) {
      handleSubmit(initialState.question);

      navigate('/qa', {
        replace: true,
        state: null,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    setState('loading');
    setResponse(null);
    setEvidenceGraph(null);

    try {
      /*
       * This calls the REAL FastAPI backend.
       * No mock fallback is used here.
       */
      const res = await askQuestion(trimmedQuestion);

      setResponse(res);
      setEvidenceGraph(createEvidenceGraph(res));
      setState('success');

      showToast('Answer generated successfully', 'success');
    } catch (error) {
      console.error('Clinical QA error:', error);

      setState('error');

      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to generate answer. Please try again.',
        'error'
      );
    }
  };

  const handleClear = () => {
    setState('idle');
    setResponse(null);
    setEvidenceGraph(null);
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 shadow-md">
          <MessageSquareText className="h-5 w-5 text-white" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            Clinical Q&A
          </h1>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Ask a medical question and retrieve evidence from the MedQA-USMLE
            dataset
          </p>
        </div>
      </div>

      {/* Question Input */}
      <QuestionInput
        onSubmit={handleSubmit}
        onClear={handleClear}
        disabled={state === 'loading'}
        compact
      />

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">

        {/* Loading */}
        {state === 'loading' && (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
          >
            <LoadingAnimation active />
          </motion.div>
        )}

        {/* Error */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorState
              title="Unable to Retrieve Evidence"
              message="The backend could not retrieve a sufficiently relevant MedQA result. Please try another medical question."
              onRetry={handleClear}
            />
          </motion.div>
        )}

        {/* Empty */}
        {state === 'idle' && !response && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              icon={MessageSquareText}
              title="Ask a Medical Question"
              description="Enter a medical question to retrieve relevant MedQA-USMLE questions, evidence and transparent reasoning."
            />
          </motion.div>
        )}

        {/* Success */}
        {state === 'success' && response && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >

            {/* New Question */}
            <div className="flex justify-end">
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                New Question
              </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Answer + Reasoning */}
              <div className="lg:col-span-2 space-y-6">

                <AnswerCard response={response} />

                <ReasoningTimeline
                  steps={response.reasoning}
                />

              </div>

              {/* Confidence */}
              <div className="space-y-6">

                <ConfidenceScore
                  response={response}
                />

                {/* Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-5"
                >

                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">
                    Retrieval Summary
                  </h3>

                  <div className="space-y-2.5">

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Retrieval Score
                      </span>

                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {Math.round(response.retrievalScore * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        MedQA Sources
                      </span>

                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {response.sources.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Reasoning Steps
                      </span>

                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {response.reasoning.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Concepts Identified
                      </span>

                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {response.concepts?.length || 0}
                      </span>
                    </div>

                  </div>
                </motion.div>
              </div>
            </div>

            {/* Dynamic Evidence Map */}
            {evidenceGraph && (
              <EvidenceMap graph={evidenceGraph} />
            )}

            {/* Retrieved Evidence */}
            <div>

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    Retrieved MedQA Evidence
                  </h3>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {response.sources.length} relevant MedQA-USMLE questions
                    retrieved for this query
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {response.sources.map((source, index) => (
                  <EvidenceCard
                    key={source.id}
                    report={source}
                    index={index}
                  />
                ))}

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}