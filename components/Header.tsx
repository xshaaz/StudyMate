import React from 'react';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { UserStats } from '../types';

interface HeaderProps {
  user: UserStats;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar }) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 border border-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors">
            <Sun className="w-5 h-5" />
        </button>
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-lg shadow-indigo-500/20">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;