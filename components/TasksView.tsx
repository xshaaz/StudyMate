import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit2, Sparkles, Filter, Flag } from 'lucide-react';
import { Task, Priority } from '../types';
import { geminiService } from '../services/geminiService';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Task Form State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.Medium);
  const [generatedSubtasks, setGeneratedSubtasks] = useState<string[]>([]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleGenerateBreakdown = async () => {
    if (!newTaskTitle) return;
    setIsGenerating(true);
    const subtasks = await geminiService.breakdownTask(newTaskTitle);
    setGeneratedSubtasks(subtasks);
    setIsGenerating(false);
  };

  const openAddModal = () => {
    setEditingTaskId(null);
    setNewTaskTitle('');
    setNewTaskSubject('');
    setNewTaskDate('');
    setNewTaskPriority(Priority.Medium);
    setGeneratedSubtasks([]);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskSubject(task.subject);
    setNewTaskDate(task.dueDate);
    setNewTaskPriority(task.priority);
    setGeneratedSubtasks(task.subTasks?.map(st => st.title) || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTaskId(null);
    setNewTaskTitle('');
    setNewTaskSubject('');
    setNewTaskDate('');
    setGeneratedSubtasks([]);
  };

  const handleSaveTask = () => {
    if (!newTaskTitle) return;

    if (editingTaskId) {
      // Update existing task
      setTasks(prev => prev.map(t => {
        if (t.id === editingTaskId) {
            // Preserve subtask completion status if title matches
            const updatedSubtasks = generatedSubtasks.map((stTitle, index) => {
                const existing = t.subTasks?.find(sub => sub.title === stTitle);
                return {
                    id: existing ? existing.id : `st-${Date.now()}-${index}`,
                    title: stTitle,
                    completed: existing ? existing.completed : false
                };
            });

            return {
                ...t,
                title: newTaskTitle,
                subject: newTaskSubject || 'General',
                dueDate: newTaskDate || t.dueDate,
                priority: newTaskPriority,
                subTasks: updatedSubtasks
            };
        }
        return t;
      }));
    } else {
      // Create new task
      const newTask: Task = {
          id: Date.now().toString(),
          title: newTaskTitle,
          subject: newTaskSubject || 'General',
          dueDate: newTaskDate || new Date().toISOString().split('T')[0],
          priority: newTaskPriority,
          completed: false,
          subTasks: generatedSubtasks.map((st, i) => ({ id: `st-${i}`, title: st, completed: false }))
      };
      setTasks(prev => [newTask, ...prev]);
    }

    closeModal();
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Tasks</h1>
        <div className="flex gap-3">
             <div className="bg-slate-800 rounded-lg p-1 flex">
                {(['all', 'active', 'completed'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {f}
                    </button>
                ))}
             </div>
             <button 
                onClick={openAddModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
                <Plus className="w-4 h-4" /> New Task
             </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {filteredTasks.map(task => (
            <div key={task.id} className={`group bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between transition-all ${task.completed ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-500 hover:border-indigo-500'}`}
                    >
                        {task.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div>
                        <h3 className={`font-semibold text-white ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <span>Due: {task.dueDate}</span>
                            <span>•</span>
                            <span>{task.subject}</span>
                            {task.subTasks && task.subTasks.length > 0 && (
                                <span className="text-indigo-400 ml-2">• {task.subTasks.length} sub-tasks</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={`
                        px-2 py-1 rounded text-xs font-bold flex items-center gap-1
                        ${task.priority === Priority.High ? 'bg-red-500/20 text-red-400' : 
                          task.priority === Priority.Medium ? 'bg-yellow-500/20 text-yellow-400' : 
                          'bg-green-500/20 text-green-400'}
                    `}>
                        <Flag className="w-3 h-3" /> {task.priority}
                    </span>
                    <button onClick={() => openEditModal(task)} className="text-slate-400 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl w-full max-w-lg p-6 border border-slate-700 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">{editingTaskId ? 'Edit Task' : 'Create New Task'}</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Task Name</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Write History Essay"
                            />
                            <button 
                                onClick={handleGenerateBreakdown}
                                disabled={isGenerating || !newTaskTitle}
                                className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 p-2 rounded-lg transition-colors disabled:opacity-50"
                                title="AI Breakdown"
                            >
                                <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {generatedSubtasks.length > 0 && (
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            <p className="text-xs text-indigo-400 font-bold mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Suggestions</p>
                            <ul className="space-y-1">
                                {generatedSubtasks.map((st, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        {st}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Subject</label>
                            <input 
                                type="text" 
                                value={newTaskSubject}
                                onChange={(e) => setNewTaskSubject(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. History"
                            />
                        </div>
                         <div>
                            <label className="block text-sm text-slate-400 mb-1">Priority</label>
                            <select 
                                value={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value={Priority.High}>High</option>
                                <option value={Priority.Medium}>Medium</option>
                                <option value={Priority.Low}>Low</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm text-slate-400 mb-1">Due Date</label>
                        <input 
                            type="date" 
                            value={newTaskDate}
                            onChange={(e) => setNewTaskDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={closeModal} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button onClick={handleSaveTask} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                        {editingTaskId ? 'Save Changes' : 'Create Task'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;