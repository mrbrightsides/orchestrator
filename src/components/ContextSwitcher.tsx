'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { AppContext } from '@/app/page';

interface ContextSwitcherProps {
  currentContext: AppContext;
  onContextChange: (context: AppContext) => void;
}

interface ContextOption {
  id: AppContext;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const contexts: ContextOption[] = [
  {
    id: 'vscode',
    name: 'VS Code',
    icon: '💻',
    color: 'blue',
    description: 'Code editor'
  },
  {
    id: 'cursor',
    name: 'Cursor IDE',
    icon: '🎯',
    color: 'cyan',
    description: 'AI-powered IDE'
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: '🎨',
    color: 'purple',
    description: 'Design tool'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    icon: '📝',
    color: 'green',
    description: 'Document editor'
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: '🌐',
    color: 'orange',
    description: 'Web browsing'
  }
];

export function ContextSwitcher({ currentContext, onContextChange }: ContextSwitcherProps): JSX.Element {
  const getColorClasses = (color: string, isActive: boolean): string => {
    if (!isActive) return 'bg-slate-700/30 border-slate-600 text-slate-400';
    
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 border-blue-500 text-blue-400',
      cyan: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
      purple: 'bg-purple-500/20 border-purple-500 text-purple-400',
      green: 'bg-green-500/20 border-green-500 text-green-400',
      orange: 'bg-orange-500/20 border-orange-500 text-orange-400'
    };
    
    return colorMap[color] || colorMap['blue'];
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-2 text-slate-200">App Context</h2>
      <p className="text-sm text-slate-400 mb-6">Select where you're working</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {contexts.map((context: ContextOption) => {
          const isActive = currentContext === context.id;
          
          return (
            <motion.button
              key={context.id}
              onClick={() => onContextChange(context.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${getColorClasses(context.color, isActive)}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                borderWidth: isActive ? 2 : 1
              }}
            >
              <div className="text-3xl mb-2">{context.icon}</div>
              <div className="font-semibold text-sm mb-1">{context.name}</div>
              <div className="text-xs opacity-70">{context.description}</div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <div className="flex items-start">
          <div className="text-2xl mr-3">💡</div>
          <div>
            <div className="font-medium text-sm text-slate-200 mb-1">Context-Aware AI</div>
            <div className="text-xs text-slate-400">
              Each gesture triggers different AI actions depending on which app you're using. No more generic responses!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
