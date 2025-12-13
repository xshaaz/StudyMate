import React, { useState } from 'react';
import { UserStats } from '../types';
import { Edit3, CheckCircle, Timer, Award, BookOpen, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileViewProps {
  user: UserStats;
  onUpdateUser: (user: Partial<UserStats>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState('Lifelong learner & productivity enthusiast.'); // Default bio not in user type currently, keeping local or assuming hardcoded for now

  const chartData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 4.0 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 5.0 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 6.0 },
    { day: 'Sun', hours: 2.0 },
  ];

  const handleSaveProfile = () => {
    onUpdateUser({ name: editName });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 overflow-y-auto h-full space-y-6 custom-scrollbar">
       
       {/* Header Card */}
       <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-indigo-500/30">
              {user.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-slate-400">{editBio}</p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="bg-slate-900 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">Level 12 Scholar</span>
                  <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">{user.xp} XP</span>
              </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
              <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Timer className="w-6 h-6" /></div>
              <div>
                  <h3 className="text-2xl font-bold text-white">{Math.floor(user.focusHours * 10) + 2}</h3>
                  <p className="text-xs text-slate-400">Focus Hours</p>
              </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><CheckCircle className="w-6 h-6" /></div>
              <div>
                  <h3 className="text-2xl font-bold text-white">{user.tasksCompleted}</h3>
                  <p className="text-xs text-slate-400">Tasks Completed</p>
              </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500"><Award className="w-6 h-6" /></div>
              <div>
                  <h3 className="text-2xl font-bold text-white">{user.streak} days</h3>
                  <p className="text-xs text-slate-400">Active Streak</p>
              </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><BookOpen className="w-6 h-6" /></div>
              <div>
                  <h3 className="text-2xl font-bold text-white">{user.subjectsMastered}</h3>
                  <p className="text-xs text-slate-400">Subjects</p>
              </div>
          </div>
       </div>

       {/* Achievements */}
       <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
           <h2 className="text-xl font-bold text-white mb-6">Achievements</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className={`p-4 rounded-xl text-center border transition-all ${user.tasksCompleted > 0 ? 'bg-slate-750 border-slate-600/50' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
                   <Award className={`w-8 h-8 mx-auto mb-3 ${user.tasksCompleted > 0 ? 'text-yellow-500' : 'text-slate-500'}`} />
                   <h4 className="text-white font-bold text-sm">Task Novice</h4>
                   <p className="text-xs text-slate-400 mt-1">Complete your first task</p>
               </div>
               <div className={`p-4 rounded-xl text-center border transition-all ${user.tasksCompleted >= 10 ? 'bg-slate-750 border-slate-600/50' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
                   <Award className={`w-8 h-8 mx-auto mb-3 ${user.tasksCompleted >= 10 ? 'text-yellow-500' : 'text-slate-500'}`} />
                   <h4 className="text-white font-bold text-sm">Task Master</h4>
                   <p className="text-xs text-slate-400 mt-1">Complete 10 tasks</p>
               </div>
               <div className={`p-4 rounded-xl text-center border transition-all ${user.focusHours >= 50 ? 'bg-slate-750 border-slate-600/50' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
                   <Timer className={`w-8 h-8 mx-auto mb-3 ${user.focusHours >= 50 ? 'text-yellow-500' : 'text-slate-500'}`} />
                   <h4 className="text-white font-bold text-sm">Deep Work</h4>
                   <p className="text-xs text-slate-400 mt-1">50 hours of focus</p>
               </div>
           </div>
       </div>

       {/* Activity Chart */}
       <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-80">
            <h2 className="text-xl font-bold text-white mb-4">Study Activity</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#818cf8' }}
                        cursor={{fill: '#334155', opacity: 0.4}}
                    />
                    <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
       </div>

       {/* Edit Profile Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-sm p-6 border border-slate-700 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Name</label>
                        <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Bio</label>
                        <textarea 
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button onClick={handleSaveProfile} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">Save Changes</button>
                </div>
            </div>
        </div>
       )}
    </div>
  );
};

export default ProfileView;