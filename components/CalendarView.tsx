import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // New Event State
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'exam' | 'study' | 'assignment'>('study');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const openModal = (date?: Date) => {
    if (date) setSelectedDate(date);
    else setSelectedDate(new Date()); // Default to today if clicked via button
    setEventTitle('');
    setEventType('study');
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!eventTitle) return;
    
    const colorMap = {
        exam: 'bg-red-500',
        study: 'bg-blue-500',
        assignment: 'bg-green-500'
    };

    const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        date: selectedDate.toISOString().split('T')[0],
        type: eventType,
        color: colorMap[eventType]
    };

    onAddEvent(newEvent);
    setIsModalOpen(false);
  };

  const renderDays = () => {
    const days = [];
    // Padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-slate-800/50 border border-slate-700/50 rounded-lg m-0.5 opacity-50"></div>);
    }

    // Days
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      
      const isToday = d === today.getDate() && 
                      currentDate.getMonth() === today.getMonth() && 
                      currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div 
            key={d} 
            onClick={() => openModal(date)}
            className={`h-32 bg-slate-800 border border-slate-700 rounded-lg m-0.5 p-2 relative hover:bg-slate-750 transition-colors group cursor-pointer`}
        >
           <span className={`text-sm font-semibold inline-flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
             {d}
           </span>
           <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
             {dayEvents.map(ev => (
               <div key={ev.id} className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${ev.color}`}>
                 {ev.title}
               </div>
             ))}
           </div>
           <button className="absolute bottom-2 right-2 p-1 bg-slate-700 rounded-md text-slate-300 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity">
             <Plus className="w-3 h-3" />
           </button>
        </div>
      );
    }

    // Padding End (Render End)
    const totalDisplayed = firstDayOfMonth + daysInMonth;
    const remainingCells = 7 - (totalDisplayed % 7);
    if (remainingCells < 7 && remainingCells > 0) {
        for (let i = 0; i < remainingCells; i++) {
             days.push(<div key={`empty-end-${i}`} className="h-32 bg-slate-800/50 border border-slate-700/50 rounded-lg m-0.5 opacity-50"></div>);
        }
    }

    return days;
  };

  return (
    <div className="p-6 h-full flex flex-col relative">
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-bold text-white">
           {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
         </h1>
         <div className="flex items-center gap-4">
            <div className="flex gap-1">
                <button onClick={handlePrevMonth} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNextMonth} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <button 
                onClick={() => openModal()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
            >
                <Plus className="w-4 h-4" /> New Event
            </button>
         </div>
       </div>

       <div className="grid grid-cols-7 mb-2">
         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
           <div key={day} className="text-center text-slate-400 font-medium text-sm py-2">{day}</div>
         ))}
       </div>
       
       <div className="grid grid-cols-7 flex-1 overflow-y-auto custom-scrollbar">
         {renderDays()}
       </div>

       {/* Add Event Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-sm p-6 border border-slate-700 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Add Event</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Date</label>
                        <input 
                            type="date" 
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Event Title</label>
                        <input 
                            type="text" 
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="e.g. Physics Final"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['study', 'exam', 'assignment'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setEventType(t)}
                                    className={`py-2 rounded-lg text-sm font-medium capitalize border ${eventType === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">Add Event</button>
                </div>
            </div>
        </div>
       )}
    </div>
  );
};

export default CalendarView;