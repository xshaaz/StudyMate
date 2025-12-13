import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import FocusView from './components/FocusView';
import ProfileView from './components/ProfileView';
import AIToolsView from './components/AIToolsView';
import { ViewState, UserStats, Task, CalendarEvent } from './types';
import { INITIAL_USER, INITIAL_TASKS, INITIAL_EVENTS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserStats>(INITIAL_USER);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddEvent = (newEvent: CalendarEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateUser = (updatedUser: Partial<UserStats>) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={user} tasks={tasks} onChangeView={setActiveView} />;
      case 'tasks':
        return <TasksView tasks={tasks} setTasks={setTasks} />;
      case 'calendar':
        return <CalendarView events={events} onAddEvent={handleAddEvent} />;
      case 'focus':
        return <FocusView tasks={tasks} />;
      case 'profile':
        return <ProfileView user={user} onUpdateUser={handleUpdateUser} />;
      case 'aitools':
        return <AIToolsView />;
      default:
        return <Dashboard user={user} tasks={tasks} onChangeView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        currentView={activeView} 
        onChangeView={(view) => {
            setActiveView(view);
            setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen} 
      />
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <main className="flex-1 overflow-hidden relative">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;