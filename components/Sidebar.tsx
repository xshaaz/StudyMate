import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar, BrainCircuit, Timer, User } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'aitools', label: 'AI Tools', icon: BrainCircuit },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
    `}>
      <div className="flex items-center h-16 px-6 border-b border-slate-800">
        <BrainCircuit className="w-8 h-8 text-indigo-500 mr-2" />
        <span className="text-xl font-bold text-white tracking-tight">StudyMate</span>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`
                flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
         <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Pro Tip</p>
            <p className="text-sm text-slate-300">Use AI Tools to generate quizzes for your next exam!</p>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;