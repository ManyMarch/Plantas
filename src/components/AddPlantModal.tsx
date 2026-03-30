import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sprout, MapPin, Droplets, Camera } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzePlantHealth } from '../services/geminiService';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPlantModal({ isOpen, onClose }: AddPlantModalProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      // AI Analysis for initial setup
      const analysis = await analyzePlantHealth(name, species, new Date().toISOString());
      
      const plantData = {
        uid: crypto.randomUUID(),
        ownerId: auth.currentUser.uid,
        name,
        species,
        location,
        healthStatus: analysis.status,
        lastWatered: new Date().toISOString(),
        wateringFrequencyDays: analysis.nextWateringDays,
        imageUrl: `https://picsum.photos/seed/${species}/800/600`,
        createdAt: new Date().toISOString()
      };

      const plantRef = await addDoc(collection(db, 'plants'), plantData);
      
      // Create initial watering task
      const initialTask = {
        uid: crypto.randomUUID(),
        plantId: plantData.uid,
        ownerId: auth.currentUser.uid,
        type: 'Riego',
        dueDate: new Date(Date.now() + plantData.wateringFrequencyDays * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'tasks'), initialTask);

      onClose();
      setName('');
      setSpecies('');
      setLocation('');
    } catch (error) {
      console.error("Error adding plant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline text-2xl font-bold">Nueva Planta</h3>
              <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    type="text"
                    placeholder="Nombre de la planta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    type="text"
                    placeholder="Especie (ej. Monstera Deliciosa)"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    type="text"
                    placeholder="Ubicación (ej. Salón)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex gap-3 items-start">
                <Droplets className="text-primary mt-1" size={20} />
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Nuestra IA analizará la especie para programar automáticamente los riegos ideales.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-95 transition-transform duration-200 disabled:opacity-50"
              >
                {loading ? "Analizando..." : "Agregar al Invernadero"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
