import React from 'react';
import { CheckCircle, Droplets, RotateCw, Leaf } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

interface TaskItemProps {
  task: Task;
  onToggle?: () => void;
}

export default function TaskItem({ task }: TaskItemProps) {
  const handleToggle = async () => {
    try {
      // Find the document by its uid field
      const q = query(collection(db, 'tasks'), where('uid', '==', task.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const taskDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'tasks', taskDoc.id), {
          completed: !task.completed
        });
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const icons = {
    'Riego': <Droplets size={20} className="text-primary" />,
    'Rotación': <RotateCw size={20} className="text-secondary" />,
    'Fertilización': <Leaf size={20} className="text-tertiary" />
  };

  const bgColors = {
    'Riego': 'bg-primary-container/30',
    'Rotación': 'bg-secondary-container/30',
    'Fertilización': 'bg-tertiary-container/30'
  };

  return (
    <div className="bg-surface-container-lowest p-5 rounded-3xl flex items-center gap-4 group cursor-pointer hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md">
      <div className={cn("p-3 rounded-2xl", bgColors[task.type])}>
        {icons[task.type]}
      </div>
      <div className="flex-1">
        <p className="font-bold text-on-surface">{task.type} Programado</p>
        <p className="text-sm text-on-surface-variant">
          {format(new Date(task.dueDate), "eeee • HH:mm", { locale: es })}
        </p>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={cn(
          "transition-colors duration-300",
          task.completed ? "text-primary" : "text-outline-variant hover:text-primary"
        )}
      >
        <CheckCircle size={24} fill={task.completed ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
