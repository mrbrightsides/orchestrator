'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GestureIntent } from '@/app/page';

interface IntentDisplayProps {
  intent: GestureIntent;
}

type AIModel = 'openai' | 'claude';

export function IntentDisplay({ intent }: IntentDisplayProps): JSX.Element {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai');
  const [usedModel, setUsedModel] = useState<string>('');
  const [activeIntent, setActiveIntent] = useState<GestureIntent>(intent);


  useEffect(() => {
    if (intent.gesture !== 'idle') {
      setActiveIntent(intent);
      fetchAIResponse(intent);
    } else if (!isProcessing) {
      // Only reset if not processing
      setAiResponse('');
      setUsedModel('');
    }
  }, [intent, selectedModel]);

  const fetchAIResponse = async (intentToUse: GestureIntent): Promise<void> => {
    setIsProcessing(true);
    setAiResponse('');

    try {
      // Build the prompt based on intent
      const prompt = buildPrompt(intentToUse);

      const response = await fetch(`/api/ai/${selectedModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          context: intentToUse.context,
          gesture: intentToUse.gesture
        })
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      setAiResponse(data.response);
      setUsedModel(data.model);
    } catch (error) {
      console.error('Failed to fetch AI response:', error);
      setAiResponse('Failed to get AI response. Please try again.');
      setUsedModel('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const buildPrompt = (intent: GestureIntent): string => {
    const contextExamples: Record<string, string> = {
      vscode: 'You are looking at a React component with TypeScript. The code contains state management, API calls, and form validation.',
      cursor: 'You are reviewing a pull request with changes to the authentication system. The code includes new middleware and route handlers.',
      figma: 'You are examining a mobile app design with a card-based layout, custom navigation, and dark mode support.',
      docs: 'You are editing a technical documentation page about API integration. The document contains code examples and usage instructions.',
      browser: 'You are reading an article about modern web development practices, focusing on performance optimization and accessibility.'
    };

    const gestureActions: Record<string, string> = {
      rotate: `${intent.aiAction} for this content: ${contextExamples[intent.context] || 'the current content'}`,
      'press-drag': `${intent.aiAction}. Content: ${contextExamples[intent.context] || 'the current content'}`,
      'long-press': `${intent.aiAction} based on this context: ${contextExamples[intent.context] || 'the current content'}`,
      'double-tap': `${intent.aiAction} for: ${contextExamples[intent.context] || 'the current content'}`
    };

    return gestureActions[intent.gesture] || intent.aiAction;
  };



  const getGestureIcon = (): string => {
    const gestureToShow = isProcessing || aiResponse ? activeIntent.gesture : intent.gesture;
    const icons: Record<string, string> = {
      'rotate': '🔄',
      'press-drag': '👆',
      'long-press': '⏱️',
      'double-tap': '⚡',
      'idle': '💤'
    };
    return icons[gestureToShow] || '❓';
  };

  const getContextColor = (): string => {
    const contextToShow = isProcessing || aiResponse ? activeIntent.context : intent.context;
    const colors: Record<string, string> = {
      vscode: 'blue',
      cursor: 'cyan',
      figma: 'purple',
      docs: 'green',
      browser: 'orange'
    };
    return colors[contextToShow] || 'blue';
  };

  const getBgGradient = (): string => {
    const color = getContextColor();
    const gradients: Record<string, string> = {
      blue: 'from-blue-500/10 to-blue-600/10',
      cyan: 'from-cyan-500/10 to-cyan-600/10',
      purple: 'from-purple-500/10 to-purple-600/10',
      green: 'from-green-500/10 to-green-600/10',
      orange: 'from-orange-500/10 to-orange-600/10'
    };
    return gradients[color] || gradients['blue'];
  };

  const getBorderColor = (): string => {
    const color = getContextColor();
    const borders: Record<string, string> = {
      blue: 'border-blue-500/30',
      cyan: 'border-cyan-500/30',
      purple: 'border-purple-500/30',
      green: 'border-green-500/30',
      orange: 'border-orange-500/30'
    };
    return borders[color] || borders['blue'];
  };

  const getTextColor = (): string => {
    const color = getContextColor();
    const textColors: Record<string, string> = {
      blue: 'text-blue-400',
      cyan: 'text-cyan-400',
      purple: 'text-purple-400',
      green: 'text-green-400',
      orange: 'text-orange-400'
    };
    return textColors[color] || textColors['blue'];
  };

  return (
    <div className={`bg-gradient-to-br ${getBgGradient()} backdrop-blur-sm border ${getBorderColor()} rounded-2xl p-8`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-200">AI Intent Recognition</h2>
        
        {/* AI Model Selector */}
        <div className="flex gap-2">
          {(['openai', 'claude'] as const).map((model) => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedModel === model
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {model === 'openai' && '🟢 GPT-4'}
              {model === 'claude' && '🟣 Claude'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIntent.gesture + activeIntent.context}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Current Gesture */}
          <div className="flex items-center mb-6">
            <motion.div
              className="text-5xl mr-4"
              animate={{ rotate: activeIntent.gesture === 'rotate' ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {getGestureIcon()}
            </motion.div>
            <div>
              <div className="text-sm text-slate-400 mb-1">{isProcessing ? 'Processing Gesture' : 'Current Gesture'}</div>
              <div className={`text-2xl font-bold ${getTextColor()}`}>
                {isProcessing || aiResponse ? activeIntent.intent : intent.intent}
              </div>
            </div>
          </div>

          {/* AI Action */}
          {(activeIntent.gesture !== 'idle' || isProcessing || aiResponse) && (
            <div className="mb-6">
              <div className="text-sm text-slate-400 mb-2">AI Action</div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-slate-200 font-medium mb-2">{activeIntent.aiAction}</p>
                <p className="text-sm text-slate-400">{activeIntent.description}</p>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-400 mr-3"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }}
              />
              <span className="text-sm text-slate-300">
                Processing with {selectedModel === 'openai' ? 'GPT-4' : 'Claude'}...
              </span>
            </motion.div>
          )}

          {/* Real AI Response */}
          {aiResponse && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-slate-800/70 rounded-lg border border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="text-xl mr-2">🤖</div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">Live AI Response</div>
                    <div className="text-xs text-slate-500 mt-1">Powered by {usedModel}</div>
                  </div>
                </div>

              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {aiResponse}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
