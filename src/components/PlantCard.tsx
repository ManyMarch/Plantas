import React from 'react';
import { motion } from 'motion/react';
import { Droplets, MoreVertical } from 'lucide-react';
import { Plant } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PlantCardProps {
  plant: Plant;
  onAction?: () => void;
}

export default function PlantCard({ plant, onAction }: PlantCardProps) {
  const statusColors = {
    'Saludable': 'bg-primary-container text-on-primary-container',
    'Estable': 'bg-tertiary-container text-on-tertiary-container',
    'Necesita Atención': 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_12px_32px_rgba(45,52,48,0.06)] flex flex-col h-full"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container relative">
        <img
          src={plant.imageUrl || `https://picsum.photos/seed/${plant.species}/800/600`}
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", statusColors[plant.healthStatus])}>
            {plant.healthStatus}
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-headline text-xl font-bold text-on-surface">{plant.name}</h4>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-medium">
              {plant.species} • {plant.location}
            </p>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container">
            <MoreVertical size={18} />
          </button>
        </div>
        
        <div className="mt-auto pt-4 border-t border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary bg-surface-container-low px-4 py-2 rounded-2xl w-full">
            <Droplets size={16} />
            <span className="font-bold text-xs">Regar en {plant.wateringFrequencyDays} días</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
