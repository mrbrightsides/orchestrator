'use client'
import React, { useState, useEffect } from 'react';
import { ActionRingSimulator } from '@/components/ActionRingSimulator';
import { ContextSwitcher } from '@/components/ContextSwitcher';
import { IntentDisplay } from '@/components/IntentDisplay';
import { DemoScenarios } from '@/components/DemoScenarios';
import { motion } from 'framer-motion';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export type AppContext = 'figma' | 'vscode' | 'docs' | 'browser' | 'cursor';
export type GestureType = 'rotate' | 'press-drag' | 'long-press' | 'double-tap' | 'idle';

export interface GestureIntent {
  gesture: GestureType;
  context: AppContext;
  intent: string;
  aiAction: string;
  description: string;
}

export default function HomePage(): JSX.Element {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  const [currentContext, setCurrentContext] = useState<AppContext>('vscode');
  const [currentGesture, setCurrentGesture] = useState<GestureType>('idle');
  const [showDemo, setShowDemo] = useState<boolean>(false);

  const getIntent = (gesture: GestureType, context: AppContext): GestureIntent => {
    const intentMap: Record<AppContext, Record<GestureType, Omit<GestureIntent, 'gesture' | 'context'>>> = {
      vscode: {
        'rotate': {
          intent: 'Summarize code',
          aiAction: 'Analyze current file and provide a concise summary',
          description: 'AI reads your code and explains what it does in plain English'
        },
        'press-drag': {
          intent: 'Explain like I\'m junior',
          aiAction: 'Break down selected code with beginner-friendly explanations',
          description: 'Complex code explained in simple terms with examples'
        },
        'long-press': {
          intent: 'Suggest next action',
          aiAction: 'Predict what you\'re trying to build and suggest next steps',
          description: 'AI anticipates your coding flow and recommends actions'
        },
        'double-tap': {
          intent: 'Fix errors',
          aiAction: 'Detect and fix compilation errors in current file',
          description: 'AI scans for bugs and suggests fixes'
        },
        'idle': {
          intent: 'Waiting...',
          aiAction: 'No action',
          description: 'Perform a gesture to trigger AI assistance'
        }
      },
      cursor: {
        'rotate': {
          intent: 'Code review',
          aiAction: 'Review current changes and suggest improvements',
          description: 'AI examines your code for best practices and optimizations'
        },
        'press-drag': {
          intent: 'Generate tests',
          aiAction: 'Create unit tests for selected function',
          description: 'AI writes comprehensive test coverage'
        },
        'long-press': {
          intent: 'Refactor code',
          aiAction: 'Suggest refactoring patterns for cleaner code',
          description: 'AI identifies code smells and modernization opportunities'
        },
        'double-tap': {
          intent: 'Document code',
          aiAction: 'Generate JSDoc/comments for selected code',
          description: 'AI writes clear documentation'
        },
        'idle': {
          intent: 'Waiting...',
          aiAction: 'No action',
          description: 'Perform a gesture to trigger AI assistance'
        }
      },
      figma: {
        'rotate': {
          intent: 'Design feedback',
          aiAction: 'Analyze current design and suggest improvements',
          description: 'AI reviews your design for UX best practices'
        },
        'press-drag': {
          intent: 'Generate variants',
          aiAction: 'Create design variations based on current selection',
          description: 'AI produces alternative designs and color schemes'
        },
        'long-press': {
          intent: 'Accessibility check',
          aiAction: 'Audit design for accessibility issues',
          description: 'AI scans for contrast, spacing, and a11y problems'
        },
        'double-tap': {
          intent: 'Export assets',
          aiAction: 'Prepare and optimize assets for development',
          description: 'AI generates production-ready assets'
        },
        'idle': {
          intent: 'Waiting...',
          aiAction: 'No action',
          description: 'Perform a gesture to trigger AI assistance'
        }
      },
      docs: {
        'rotate': {
          intent: 'Summarize document',
          aiAction: 'Generate executive summary of current document',
          description: 'AI creates a concise overview of key points'
        },
        'press-drag': {
          intent: 'Improve writing',
          aiAction: 'Enhance selected text for clarity and tone',
          description: 'AI refines your writing style and grammar'
        },
        'long-press': {
          intent: 'Translate',
          aiAction: 'Translate selected text to target language',
          description: 'AI provides accurate translations'
        },
        'double-tap': {
          intent: 'Format document',
          aiAction: 'Apply consistent styling and formatting',
          description: 'AI standardizes your document structure'
        },
        'idle': {
          intent: 'Waiting...',
          aiAction: 'No action',
          description: 'Perform a gesture to trigger AI assistance'
        }
      },
      browser: {
        'rotate': {
          intent: 'Summarize page',
          aiAction: 'Extract and summarize key information from webpage',
          description: 'AI digests long articles into quick insights'
        },
        'press-drag': {
          intent: 'Research assist',
          aiAction: 'Find related articles and sources',
          description: 'AI discovers relevant content for deeper research'
        },
        'long-press': {
          intent: 'Fact check',
          aiAction: 'Verify claims and check sources',
          description: 'AI validates information accuracy'
        },
        'double-tap': {
          intent: 'Save & organize',
          aiAction: 'Bookmark with AI-generated tags and summary',
          description: 'AI categorizes and archives important content'
        },
        'idle': {
          intent: 'Waiting...',
          aiAction: 'No action',
          description: 'Perform a gesture to trigger AI assistance'
        }
      }
    };

    const contextIntents = intentMap[context];
    const intentData = contextIntents[gesture];

    return {
      gesture,
      context,
      ...intentData
    };
  };

  const currentIntent = getIntent(currentGesture, currentContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Header */}
      <div className="pt-16 pb-8 px-4 text-center border-b border-slate-800">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-sm font-medium">Logitech Actions SDK · Hackathon 2025</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ActionRing AI Orchestrator
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-2">One Gesture, One Intent</p>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            The most human way to control AI is not typing. It's intention.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Ring Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ActionRingSimulator
              onGestureChange={setCurrentGesture}
              currentContext={currentContext}
            />
          </motion.div>

          {/* Right Column: Context & Intent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <ContextSwitcher
              currentContext={currentContext}
              onContextChange={setCurrentContext}
            />
            <IntentDisplay intent={currentIntent} />
          </motion.div>
        </div>

        {/* Demo Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {showDemo ? 'Hide' : 'Show'} Real-World Scenarios
          </button>
        </div>

        {/* Demo Scenarios */}
        {showDemo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DemoScenarios />
          </motion.div>
        )}
      </div>

      {/* Footer Value Prop */}
      <div className="border-t border-slate-800 py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-200">Why This Matters</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold mb-2 text-blue-400">Context-Aware</h3>
              <p className="text-sm text-slate-400">AI knows what you're doing and adapts accordingly</p>
            </div>
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2 text-purple-400">Zero Friction</h3>
              <p className="text-sm text-slate-400">No keyboard shortcuts to memorize, just natural gestures</p>
            </div>
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2 text-pink-400">Intent-Driven</h3>
              <p className="text-sm text-slate-400">Gestures represent meaning, not arbitrary commands</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
