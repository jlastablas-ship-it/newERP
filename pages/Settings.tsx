
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Database, Trash2, Info, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const [dbName, setDbName] = useState('ERPappDB');
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const tables = ['accounts', 'journalEntries', 'suppliers', 'invoices', 'centers', 'users', 'roles'];
      const results = await Promise.all(
        tables.map(async (table) => ({
          name: table,
          count: await (db as any)[table].count(),
        }))
      );
      setStats(results);
    };
    fetchStats();
  }, []);

  const resetDB = async () => {
    if (confirm('¿ESTÁ SEGURO? Se borrarán TODOS los datos localmente de forma permanente.')) {
      // Fix: Using any cast to access Dexie delete method which might be missing from type definitions in some environments
      await (db as any).delete();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h2>
        <p className="text-slate-500">Gestione los parámetros de la base de datos y preferencias</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900">
            <Database size={20} className="text-blue-600" />
            <h3 className="text-lg font-bold">Gestión de IndexedDB</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de Base de Datos</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  disabled
                />
                <button className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed">
                  <RefreshCw size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Info size={12} /> El nombre de la DB es estático en esta versión.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 pt-8">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Estadísticas de Tablas</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map(s => (
              <div key={s.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 capitalize">{s.name}</span>
                <span className="text-lg font-bold text-slate-900">{s.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-100 pt-8">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h4 className="font-bold text-red-900 mb-2">Zona de Peligro</h4>
            <p className="text-red-700 text-sm mb-6">
              El siguiente botón eliminará la base de datos IndexedDB local por completo. Esta acción es irreversible y perderá todos sus registros locales.
            </p>
            <button 
              onClick={resetDB}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              <Trash2 size={20} /> Purgar y Resetear Datos
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
