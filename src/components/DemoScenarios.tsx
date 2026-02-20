'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Scenario {
  id: string;
  title: string;
  context: string;
  problem: string;
  gesture: string;
  solution: string;
  icon: string;
}

const scenarios: Scenario[] = [
  {
    id: 'vscode-debug',
    title: 'Debugging Complex Code',
    context: 'VS Code',
    problem: 'You\'re staring at a 200-line function with nested callbacks',
    gesture: 'Rotate the ring',
    solution: 'AI instantly summarizes the logic flow: "This function handles user authentication with three retry attempts, validates tokens, and manages session storage."',
    icon: '🐛'
  },
  {
    id: 'cursor-junior',
    title: 'Teaching Junior Developer',
    context: 'Cursor IDE',
    problem: 'Junior dev asks about your Redux implementation',
    gesture: 'Press + Drag on the code',
    solution: 'AI explains: "Redux is like a giant filing cabinet for your app. Actions are requests, reducers are the filing clerks, and the store is the cabinet itself."',
    icon: '🎓'
  },
  {
    id: 'figma-review',
    title: 'Late Night Design Review',
    context: 'Figma',
    problem: 'It\'s 11pm, you need fresh eyes on your design',
    gesture: 'Rotate the ring',
    solution: 'AI spots: "Button contrast is 3.2:1, below WCAG standards. Suggest #2563EB for better accessibility. Also, increase spacing between CTA buttons by 8px."',
    icon: '🎨'
  },
  {
    id: 'docs-meeting',
    title: 'Pre-Meeting Prep',
    context: 'Google Docs',
    problem: 'You have 5 minutes before a meeting about a 15-page proposal',
    gesture: 'Rotate the ring',
    solution: 'AI delivers: "Executive summary: Proposal requests $500K for AI integration project. Key benefits: 40% efficiency gain, 18-month ROI. Main concerns: Timeline and team capacity."',
    icon: '📊'
  },
  {
    id: 'browser-research',
    title: 'Deep Research Mode',
    context: 'Browser',
    problem: 'Reading a technical article, need to understand the broader context',
    gesture: 'Press + Drag',
    solution: 'AI finds 5 related papers, identifies the original source, and highlights: "This builds on transformer architecture from 2017. Here are 3 implementations and 2 critiques."',
    icon: '🔬'
  },
  {
    id: 'vscode-nextaction',
    title: 'Flow State Interrupted',
    context: 'VS Code',
    problem: 'Phone call interrupts your coding. What were you doing?',
    gesture: 'Long press',
    solution: 'AI reminds: "You were implementing user authentication. Next: Add password validation, then create the forgot-password flow. Tests are already written."',
    icon: '⚡'
  }
];

export function DemoScenarios(): JSX.Element {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 text-slate-200">Real-World Scenarios</h2>
        <p className="text-slate-400">See how ActionRing solves actual developer problems</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario: Scenario, index: number) => {
          const isSelected = selectedScenario === scenario.id;
          
          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative cursor-pointer transition-all duration-300 ${
                isSelected ? 'md:col-span-2 lg:col-span-3' : ''
              }`}
              onClick={() => setSelectedScenario(isSelected ? null : scenario.id)}
            >
              <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                isSelected 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500' 
                  : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
              }`}>
                {/* Compact View */}
                {!isSelected && (
                  <div>
                    <div className="text-4xl mb-3">{scenario.icon}</div>
                    <h3 className="font-bold text-lg mb-2 text-slate-200">{scenario.title}</h3>
                    <div className="flex items-center text-sm text-slate-400 mb-2">
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-xs mr-2">
                        {scenario.context}
                      </span>
                      <span className="text-xs">{scenario.gesture}</span>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">{scenario.problem}</p>
                  </div>
                )}

                {/* Expanded View */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="text-5xl mr-4">{scenario.icon}</div>
                        <div>
                          <h3 className="font-bold text-2xl text-slate-200">{scenario.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-400">
                              {scenario.context}
                            </span>
                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-400">
                              {scenario.gesture}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-semibold text-red-400 mb-2">❌ The Problem</div>
                          <p className="text-slate-300">{scenario.problem}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                      <div className="text-sm font-semibold text-green-400 mb-3">✅ ActionRing Solution</div>
                      <p className="text-slate-300 mb-4">{scenario.solution}</p>
                      
                      <div className="flex items-center text-sm text-slate-400 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <span className="text-xl mr-2">⚡</span>
                        <span>Zero typing. Zero context switching. Pure intention.</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30">
        <div className="flex items-start">
          <div className="text-3xl mr-4">💡</div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-slate-200">The Pattern</h3>
            <p className="text-slate-300 mb-3">
              Every scenario follows the same principle: <span className="text-blue-400 font-semibold">gesture + context = intelligent action</span>
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="font-semibold text-blue-400 mb-1">No Shortcuts</div>
                <div className="text-slate-400">Forget Ctrl+Shift+Alt+Whatever</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="font-semibold text-purple-400 mb-1">Context Aware</div>
                <div className="text-slate-400">AI knows what you're doing</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="font-semibold text-pink-400 mb-1">Intent Driven</div>
                <div className="text-slate-400">Gestures mean something</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
