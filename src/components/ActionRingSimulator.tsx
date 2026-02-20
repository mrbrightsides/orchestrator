'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GestureType, AppContext } from '@/app/page';

interface ActionRingSimulatorProps {
  onGestureChange: (gesture: GestureType) => void;
  currentContext: AppContext;
}

export function ActionRingSimulator({ onGestureChange, currentContext }: ActionRingSimulatorProps): JSX.Element {
  const [rotation, setRotation] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [pressStartPos, setPressStartPos] = useState<{ x: number; y: number } | null>(null);
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [currentGesture, setCurrentGesture] = useState<GestureType>('idle');
  const ringRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Long press detection
  useEffect(() => {
    if (isPressed && pressStartTime && !hasMoved) {
      longPressTimerRef.current = setTimeout(() => {
        setCurrentGesture('long-press');
        onGestureChange('long-press');
      }, 800);
    }

    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };
  }, [isPressed, pressStartTime, hasMoved, onGestureChange]);

  const resetToIdle = (): void => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setCurrentGesture('idle');
      onGestureChange('idle');
    }, 1500);
  };

  const handleMouseDown = (e: React.MouseEvent): void => {
    setIsPressed(true);
    setPressStartTime(Date.now());
    setPressStartPos({ x: e.clientX, y: e.clientY });
    setHasMoved(false);
  };

  const handleMouseUp = (): void => {
    const pressDuration = pressStartTime ? Date.now() - pressStartTime : 0;
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    setIsPressed(false);
    setPressStartTime(null);
    setPressStartPos(null);

    // Only handle taps if user didn't move and didn't long press
    if (!hasMoved && pressDuration < 800) {
      const now = Date.now();
      if (now - lastTapTime < 300) {
        // Double tap detected
        setCurrentGesture('double-tap');
        onGestureChange('double-tap');
        setLastTapTime(0);
        resetToIdle();
      } else {
        // First tap
        setLastTapTime(now);
      }
    } else if (currentGesture === 'long-press' || currentGesture === 'press-drag') {
      // Reset after long press or drag
      resetToIdle();
    }

    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (isPressed && pressStartPos) {
      const deltaX = Math.abs(e.clientX - pressStartPos.x);
      const deltaY = Math.abs(e.clientY - pressStartPos.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Trigger press-drag if moved more than 10 pixels
      if (distance > 10 && !hasMoved) {
        setHasMoved(true);
        setCurrentGesture('press-drag');
        onGestureChange('press-drag');
        
        // Clear long press timer since user is dragging
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent): void => {
    e.preventDefault();
    const delta = e.deltaY;
    setRotation((prev: number) => prev + delta * 0.5);
    setCurrentGesture('rotate');
    onGestureChange('rotate');
    resetToIdle();
  };

  const getContextColor = (): string => {
    const colors: Record<AppContext, string> = {
      vscode: 'from-blue-500 to-blue-600',
      cursor: 'from-cyan-500 to-cyan-600',
      figma: 'from-purple-500 to-purple-600',
      docs: 'from-green-500 to-green-600',
      browser: 'from-orange-500 to-orange-600'
    };
    return colors[currentContext];
  };

  const getGestureIndicator = (): string => {
    switch (currentGesture) {
      case 'rotate': return '🔄';
      case 'press-drag': return '👆';
      case 'long-press': return '⏱️';
      case 'double-tap': return '⚡';
      default: return '🎯';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-2 text-center text-slate-200">Actions Ring Simulator</h2>
      <p className="text-sm text-slate-400 text-center mb-8">Try the gestures below</p>

      {/* Ring Visual */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <motion.div
            ref={ringRef}
            className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${getContextColor()} shadow-2xl cursor-pointer select-none`}
            style={{ rotate: rotation }}
            animate={{
              scale: isPressed ? 0.95 : 1,
              boxShadow: isPressed 
                ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
                : '0 20px 60px rgba(0, 0, 0, 0.4)'
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            transition={{ duration: 0.2 }}
          >
            {/* Inner Circle */}
            <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className="text-6xl mb-2"
                  animate={{ 
                    scale: currentGesture !== 'idle' ? [1, 1.2, 1] : 1,
                    rotate: currentGesture === 'rotate' ? [0, 360] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {getGestureIndicator()}
                </motion.div>
                <div className="text-xs text-slate-400 font-medium">ACTIONS RING</div>
              </div>
            </div>

            {/* Rotation Indicator */}
            <motion.div
              className="absolute top-2 left-1/2 w-1 h-8 bg-white rounded-full"
              style={{ originX: 0.5, originY: 8 }}
            />
          </motion.div>

          {/* Gesture Trails */}
          {currentGesture !== 'idle' && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{
                background: `radial-gradient(circle, transparent 40%, ${
                  currentContext === 'vscode' ? 'rgba(59, 130, 246, 0.4)' :
                  currentContext === 'cursor' ? 'rgba(6, 182, 212, 0.4)' :
                  currentContext === 'figma' ? 'rgba(168, 85, 247, 0.4)' :
                  currentContext === 'docs' ? 'rgba(34, 197, 94, 0.4)' :
                  'rgba(249, 115, 22, 0.4)'
                } 60%)`
              }}
            />
          )}
        </div>
      </div>

      {/* Gesture Instructions */}
      <div className="space-y-3">
        <div className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${
          currentGesture === 'rotate' 
            ? 'bg-blue-500/30 border-blue-500' 
            : 'bg-slate-700/30 border-slate-600'
        }`}>
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
            <span className="text-xl">🔄</span>
          </div>
          <div>
            <div className="font-medium text-sm text-slate-200">Rotate</div>
            <div className="text-xs text-slate-400">Scroll on the ring</div>
          </div>
        </div>

        <div className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${
          currentGesture === 'press-drag' 
            ? 'bg-purple-500/30 border-purple-500' 
            : 'bg-slate-700/30 border-slate-600'
        }`}>
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
            <span className="text-xl">👆</span>
          </div>
          <div>
            <div className="font-medium text-sm text-slate-200">Press + Drag</div>
            <div className="text-xs text-slate-400">Click and move</div>
          </div>
        </div>

        <div className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${
          currentGesture === 'long-press' 
            ? 'bg-pink-500/30 border-pink-500' 
            : 'bg-slate-700/30 border-slate-600'
        }`}>
          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
            <span className="text-xl">⏱️</span>
          </div>
          <div>
            <div className="font-medium text-sm text-slate-200">Long Press</div>
            <div className="text-xs text-slate-400">Hold for 0.8 seconds</div>
          </div>
        </div>

        <div className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${
          currentGesture === 'double-tap' 
            ? 'bg-green-500/30 border-green-500' 
            : 'bg-slate-700/30 border-slate-600'
        }`}>
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <div className="font-medium text-sm text-slate-200">Double Tap</div>
            <div className="text-xs text-slate-400">Quick double click</div>
          </div>
        </div>
      </div>
    </div>
  );
}
