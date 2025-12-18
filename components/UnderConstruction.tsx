
import React from 'react';
import { Hammer } from 'lucide-react';

const UnderConstruction: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6 animate-pulse">
        <Hammer size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md">
        Esta sección se encuentra actualmente en desarrollo. Pronto estará disponible con todas las funcionalidades solicitadas.
      </p>
    </div>
  );
};

export default UnderConstruction;
