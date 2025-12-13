import React from 'react';
import { CheckCircle2, Flame, Timer, BarChart2, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { UserStats, Task, ViewState } from '../types';

interface DashboardProps {
  user: UserStats;
  tasks: Task[];
  onChangeView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, tasks, onChangeView }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const activeTasks = tasks.filter(t => !t.completed).slice(0, 3);
  const nextTask = tasks.find(t => !t.completed);

  const stats = [
    { label: 'Completed Tasks', value: `${user.tasksCompleted}/50`, sub: '+2 today', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Study Hours', value: user.focusHours.toFixed(1), sub: '-5%', subColor: 'text-red-400', icon: Timer, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Streak', value: `${user.streak} Days`, sub: '+1 day', icon: Flame, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Productivity', value: `${user.productivity}%`, sub: '+3%', icon: BarChart2, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Good morning, {user.name}!</h1>
          <p className="text-slate-400">{today}</p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-xl font-semibold text-white">24°C, Clear Sky</p>
            <p className="text-slate-400 text-sm">Jaipur, IN</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
                <div key={index} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                        <div className={`p-2 rounded-lg ${stat.bg}`}>
                            <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                    </div>
                    <div className="flex items-center text-xs">
                        <span className={`font-medium ${stat.subColor || 'text-green-400'}`}>{stat.sub}</span>
                    </div>
                </div>
            );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Focus For Today */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">Focus For Today</h2>
            {nextTask ? (
                <div className="bg-slate-750 p-6 rounded-xl border border-slate-700 mb-6">
                    <p className="text-slate-400 text-sm mb-1">Next up:</p>
                    <h3 className="text-xl font-bold text-white mb-1">{nextTask.title}</h3>
                    <span className="text-sm text-slate-400 bg-slate-800 px-2 py-1 rounded inline-block">{nextTask.subject}</span>
                </div>
            ) : (
                <div className="bg-slate-750 p-6 rounded-xl border border-slate-700 mb-6 text-center">
                    <p className="text-slate-400">No tasks pending! Great job.</p>
                </div>
            )}
            
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Daily Goal Progress</span>
                    <span className="text-white font-bold">65%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%] rounded-full"></div>
                </div>
            </div>

            <button 
                onClick={() => onChangeView('focus')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
                <Timer className="w-5 h-5" /> Start Focus Session
            </button>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">Upcoming Tasks</h2>
            <div className="space-y-4">
                {activeTasks.map(task => (
                    <div key={task.id} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-750 transition-colors cursor-pointer">
                         <div className={`w-4 h-4 rounded-full border-2 mt-1 ${task.priority === 'High' ? 'border-red-500' : 'border-slate-500'}`}></div>
                         <div>
                            <h4 className="text-white font-medium text-sm group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                            <p className="text-xs text-slate-500">{task.subject}</p>
                         </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => onChangeView('tasks')}
                className="w-full mt-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
                View All Tasks
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;