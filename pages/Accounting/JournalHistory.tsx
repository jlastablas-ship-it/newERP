
import React, { useState, useEffect } from 'react';
import { db, JournalEntry } from '../../db';
import { Search, Eye, Calendar, FileText, ChevronRight, Calculator } from 'lucide-react';

const JournalHistory: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadEntries = async () => {
    const data = await db.journalEntries.reverse().toArray();
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const openDetails = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Historial de Asientos</h2>
          <p className="text-slate-500">Consulta y revisión de movimientos grabados en el diario</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filtrar por descripción..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4 text-right">Total Asiento</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => {
                const total = entry.lines.reduce((sum, l) => sum + l.debit, 0);
                return (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-md">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-600">
                      ${total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openDetails(entry)}
                        className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No hay asientos grabados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedEntry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50">
              <div className="flex items-center gap-3">
                <Calculator className="text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">Detalle del Asiento #{selectedEntry.id}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-400 hover:text-blue-600 text-2xl">×</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha de Registro</p>
                  <p className="text-sm font-semibold text-slate-900">{new Date(selectedEntry.timestamp).toLocaleString()}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estado</p>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Cuadrado</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción</p>
                <p className="text-slate-700 leading-relaxed bg-white border border-slate-100 p-3 rounded-lg italic">
                  "{selectedEntry.description}"
                </p>
              </div>

              <div className="overflow-hidden border border-slate-100 rounded-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <th className="px-4 py-2">Cuenta</th>
                      <th className="px-4 py-2 text-right">Debe</th>
                      <th className="px-4 py-2 text-right">Haber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedEntry.lines.map((line, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{line.accountLabel}</td>
                        <td className="px-4 py-3 text-right font-mono text-sm">{line.debit > 0 ? line.debit.toFixed(2) : '-'}</td>
                        <td className="px-4 py-3 text-right font-mono text-sm">{line.credit > 0 ? line.credit.toFixed(2) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/50">
                    <tr className="font-bold">
                      <td className="px-4 py-3 text-xs text-slate-500">TOTALES</td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-blue-600">
                        ${selectedEntry.lines.reduce((sum, l) => sum + l.debit, 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-blue-600">
                        ${selectedEntry.lines.reduce((sum, l) => sum + l.credit, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalHistory;
