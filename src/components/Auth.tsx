import React from 'react';
import { signInWithGoogle } from '../firebase';
import { motion } from 'motion/react';
import { Sprout } from 'lucide-react';

export default function Auth() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-surface-container-lowest p-10 rounded-3xl shadow-[0_20px_40px_rgba(45,52,48,0.06)] flex flex-col items-center text-center space-y-8"
      >
        <div className="w-20 h-20 bg-primary-container rounded-3xl flex items-center justify-center text-primary">
          <Sprout size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold text-on-surface">Digital Greenhouse</h1>
          <p className="text-on-surface-variant">Tu compañero editorial para el cuidado de plantas.</p>
        </div>
        <button
          onClick={signInWithGoogle}
          className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold hover:scale-95 transition-transform duration-200"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Continuar con Google
        </button>
        <p className="text-xs text-on-surface-variant/60">
          Al continuar, aceptas nuestra visión de un mundo más verde y conectado.
        </p>
      </motion.div>
    </div>
  );
}
