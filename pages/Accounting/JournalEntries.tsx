
import React, { useState, useEffect } from 'react';
import { db, Account, JournalEntryLine } from '../../db';
import { Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const JournalEntries: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<JournalEntryLine[]>([
    { accountId: 0, accountLabel: '', debit: 0, credit: 0 },
    { accountId: 0, accountLabel: '', debit: 0, credit: 0 },
  ]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    db.accounts.toArray().then(setAccounts);
  }, []);

  const addLine = () => {
    setLines([...lines, { accountId: 0, accountLabel: '', debit: 0, credit: 0 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof JournalEntryLine, value: any) => {
    const newLines = [...lines];
    if (field === 'accountId') {
      const acc = accounts.find(a => a.id === Number(value));
      newLines[index].accountId = Number(value);
      newLines[index].accountLabel = acc ? `${acc.cuenta}-${acc.subcuenta}` : '';
    // Fix: Narrow field to ensure we only assign numbers to numeric properties (debit/credit)
    } else if (field === 'debit' || field === 'credit') {
      newLines[index][field] = Number(value);
    }
    setLines(newLines);
  };

  const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isBalanced) {
      setError('El asiento no está cuadrado. La suma de Débitos debe ser igual a la suma de Créditos.');
      return;
    }

    if (!description.trim()) {
      setError('Debe ingresar una descripción para el asiento.');
      return;
    }

    await db.journalEntries.add({
      description,
      lines,
      timestamp: Date.now()
    });

    setSuccess(true);
    setDescription('');
    setLines([
      { accountId: 0, accountLabel: '', debit: 0, credit: 0 },
      { accountId: 0, accountLabel: '', debit: 0, credit: 0 },
    ]);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Registro de Asiento Diario</h2>
          <p className="text-slate-500">Cree un nuevo movimiento contable</p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} /> Asiento registrado exitosamente.
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Descripción del Movimiento</label>
            <textarea 
              rows={2}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              placeholder="Ej: Pago de alquiler oficina central mes de Mayo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 w-1/2">Cuenta Contable</th>
                  <th className="pb-3 px-2">Débito</th>
                  <th className="pb-3 px-2">Crédito</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lines.map((line, idx) => (
                  <tr key={idx} className="group">
                    <td className="py-3 pr-4">
                      <select 
                        required
                        className="w-full px-3 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        value={line.accountId}
                        onChange={(e) => updateLine(idx, 'accountId', e.target.value)}
                      >
                        <option value={0}>Seleccione cuenta...</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.cuenta}-{acc.subcuenta} | {acc.clasificacion}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-32 px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500/20 outline-none"
                        value={line.debit || ''}
                        onChange={(e) => updateLine(idx, 'debit', e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-32 px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500/20 outline-none"
                        value={line.credit || ''}
                        onChange={(e) => updateLine(idx, 'credit', e.target.value)}
                      />
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-100">
                  <td className="py-4 font-bold text-slate-900 text-right">TOTALES</td>
                  <td className={`py-4 px-2 text-right font-bold ${isBalanced ? 'text-emerald-600' : 'text-slate-400'}`}>
                    ${totalDebit.toFixed(2)}
                  </td>
                  <td className={`py-4 px-2 text-right font-bold ${isBalanced ? 'text-emerald-600' : 'text-slate-400'}`}>
                    ${totalCredit.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={addLine}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={18} /> Agregar Línea
            </button>
            <div className="flex gap-3 w-full sm:w-auto">
               <button 
                type="submit"
                disabled={!isBalanced}
                className={`flex-1 sm:px-10 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  isBalanced 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                Grabar Asiento
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalEntries;
