import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

interface FocusViewProps {
  tasks: Task[];
}

const FocusView: React.FC<FocusViewProps> = ({ tasks }) => {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  
  const nextTask = tasks.find(t => !t.completed);

  const modes = {
    focus: { label: 'Focus', minutes: 25, color: 'text-indigo-500' },
    short: { label: 'Short Break', minutes: 5, color: 'text-green-500' },
    long: { label: 'Long Break', minutes: 15, color: 'text-blue-500' },
  };

  // Use a ref to prevent interval closure staleness if needed, 
  // though simple useEffect dependency is often enough for this scale.
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleTimerComplete();
    }
    return () => {
        if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    if (mode === 'focus') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      if (newSessions % 4 === 0) {
        changeMode('long');
      } else {
        changeMode('short');
      }
    } else {
      changeMode('focus');
    }
  };

  const changeMode = (m: 'focus' | 'short' | 'long') => {
    setMode(m);
    setTimeLeft(modes[m].minutes * 60);
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
      setIsActive(false);
      setTimeLeft(modes[mode].minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG Config
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const totalTime = modes[mode].minutes * 60;
  const progress = timeLeft / totalTime;
  const dashOffset = circumference - (progress * circumference);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
       
       <div className="bg-slate-800 p-1 rounded-full flex mb-12 border border-slate-700">
         {(Object.keys(modes) as Array<keyof typeof modes>).map((m) => (
            <button
                key={m}
                onClick={() => changeMode(m)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                {modes[m].label}
            </button>
         ))}
       </div>

       <div className="relative mb-12">
          {/* Background Circle */}
          <svg className="w-80 h-80 transform -rotate-90">
             <circle
               cx="160"
               cy="160"
               r={radius}
               stroke="currentColor"
               strokeWidth="12"
               fill="transparent"
               className="text-slate-800"
             />
             {/* Progress Circle */}
             <circle
               cx="160"
               cy="160"
               r={radius}
               stroke="currentColor"
               strokeWidth="12"
               fill="transparent"
               strokeDasharray={circumference}
               strokeDashoffset={dashOffset}
               strokeLinecap="round"
               className={`${modes[mode].color} transition-all duration-1000 ease-linear`}
             />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-7xl font-bold text-white tracking-tighter">{formatTime(timeLeft)}</span>
             <span className={`font-medium mt-2 ${modes[mode].color}`}>
                {isActive ? (mode === 'focus' ? 'Stay Focused' : 'Relax') : 'Ready?'}
             </span>
          </div>
       </div>

       <div className="flex items-center gap-8">
          <button onClick={resetTimer} className="p-4 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
             <RotateCcw className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 transition-all transform hover:scale-105"
          >
             {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          
          <div className="flex flex-col items-center justify-center w-14">
             <span className="text-white text-xl font-bold">{sessions % 4}/4</span>
             <span className="text-slate-500 text-xs uppercase">Sessions</span>
          </div>
       </div>

       {nextTask && mode === 'focus' && (
           <div className="mt-12 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full max-w-md flex items-center gap-4 animate-fade-in">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-slate-400 text-xs mb-0.5">Focusing on:</p>
                    <p className="text-white font-semibold text-sm">{nextTask.title}</p>
                </div>
           </div>
       )}
    </div>
  );
};

export default FocusView;