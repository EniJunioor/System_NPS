import { Bell, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-end items-center p-4 sm:p-6 bg-gray-50/50 border-b border-gray-200/80">
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 rounded-full hover:bg-gray-200/70 transition-colors">
          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
        </button>
        <button className="relative p-2 rounded-full hover:bg-gray-200/70 transition-colors">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
          MS
        </div>
      </div>
    </header>
  );
} 