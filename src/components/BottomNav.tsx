import React from 'react';
import { Leaf, Calendar, Search, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const tabs = [
    { id: 'plants', label: 'Mis Plantas', icon: Leaf, active: true },
    { id: 'tasks', label: 'Tareas', icon: Calendar },
    { id: 'explore', label: 'Explorar', icon: Search },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_-12px_32px_rgba(45,52,48,0.06)] rounded-t-[2.5rem] border-t border-white/20 md:max-w-md md:left-1/2 md:-translate-x-1/2 md:mb-6 md:rounded-[2.5rem]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300",
            tab.active 
              ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105" 
              : "text-on-surface-variant hover:text-primary"
          )}
        >
          <tab.icon size={24} fill={tab.active ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1.5">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
