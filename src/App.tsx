import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db, logout } from './firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Menu, ArrowRight, TrendingUp } from 'lucide-react';
import Auth from './components/Auth';
import PlantCard from './components/PlantCard';
import TaskItem from './components/TaskItem';
import BottomNav from './components/BottomNav';
import AddPlantModal from './components/AddPlantModal';
import { Plant, Task } from './types';

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Queries
  const plantsQuery = user ? query(
    collection(db, 'plants'),
    where('ownerId', '==', user.uid),
    orderBy('createdAt', 'desc')
  ) : null;

  const tasksQuery = user ? query(
    collection(db, 'tasks'),
    where('ownerId', '==', user.uid),
    where('completed', '==', false),
    orderBy('dueDate', 'asc'),
    limit(3)
  ) : null;

  const [plants] = useCollectionData(plantsQuery as any);
  const [tasks] = useCollectionData(tasksQuery as any);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );

  if (!user) return <Auth />;

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button className="text-primary p-2 rounded-full hover:bg-surface-container transition-colors">
            <Menu size={24} />
          </button>
          <h1 className="font-headline font-bold text-xl tracking-tight">Digital Greenhouse</h1>
        </div>
        <button 
          onClick={logout}
          className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary-container hover:ring-primary transition-all"
        >
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
            alt="Avatar" 
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-12">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-medium">Panel de Control</p>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface">Cuidado de Plantas</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-95 transition-transform duration-200"
          >
            <Plus size={24} />
            <span className="font-bold tracking-wide">Agregar Nueva Planta</span>
          </button>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Plants Grid */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-2xl font-semibold">Mis Plantas</h3>
              <button className="text-primary font-bold hover:underline">Ver todas</button>
            </div>
            
            {plants && plants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plants.map((plant: any) => (
                  <PlantCard key={plant.uid} plant={plant as Plant} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-3xl p-12 text-center space-y-4 border-2 border-dashed border-surface-container">
                <p className="text-on-surface-variant">Tu invernadero está vacío. Comienza agregando tu primera planta.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all"
                >
                  Agregar planta <ArrowRight size={18} />
                </button>
              </div>
            )}
          </section>

          {/* Sidebar / Tasks */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container-low rounded-[2.5rem] p-8 space-y-8">
              <h3 className="font-headline text-2xl font-semibold">Tareas Próximas</h3>
              <div className="space-y-4">
                {tasks && tasks.length > 0 ? (
                  tasks.map((task: any) => (
                    <TaskItem key={task.uid} task={task as Task} />
                  ))
                ) : (
                  <p className="text-on-surface-variant text-sm text-center py-4 italic">No hay tareas pendientes.</p>
                )}
              </div>

              {/* Growth Stats */}
              <div className="bg-primary/5 rounded-3xl p-6 space-y-4 border border-primary/10">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp size={16} />
                  <span className="font-label text-xs uppercase font-bold tracking-widest">Estado de Crecimiento</span>
                </div>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Tu invernadero digital ha crecido un <strong>12%</strong> esta semana. ¡Buen trabajo!
                </p>
                <div className="flex gap-1 justify-between">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={`h-1.5 w-full rounded-full ${i <= 3 ? 'bg-primary' : 'bg-primary-container'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Editorial Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-stone-900 aspect-square group">
              <img 
                src="https://picsum.photos/seed/botanical/800/800" 
                alt="Editorial" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 space-y-2">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Guía Pro</span>
                <h4 className="text-white font-headline text-xl font-bold">Cómo limpiar las hojas de tu Monstera</h4>
                <button className="text-white text-sm font-medium mt-2 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  Leer artículo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BottomNav />
      <AddPlantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
