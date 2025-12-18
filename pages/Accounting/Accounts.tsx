
import React, { useState, useEffect, useMemo } from 'react';
import { db, Account } from '../../db';
import { Plus, Trash2, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortConfig = {
  key: keyof Account;
  direction: 'asc' | 'desc';
} | null;

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ cuenta: '', subcuenta: '', clasificacion: 'Activo' });
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('Todas');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'cuenta', direction: 'asc' });

  const loadAccounts = async () => {
    const data = await db.accounts.toArray();
    setAccounts(data);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\d{4}$/.test(formData.cuenta) || !/^\d{4}$/.test(formData.subcuenta)) {
      setError('Cuenta y Subcuenta deben ser numéricos de exactamente 4 dígitos.');
      return;
    }

    await db.accounts.add({
      ...formData,
      timestamp: Date.now()
    });

    setFormData({ cuenta: '', subcuenta: '', clasificacion: 'Activo' });
    setIsModalOpen(false);
    loadAccounts();
  };

  const deleteAccount = async (id: number) => {
    if (confirm('¿Eliminar esta cuenta?')) {
      await db.accounts.delete(id);
      loadAccounts();
    }
  };

  const handleSort = (key: keyof Account) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedAccounts = useMemo(() => {
    let result = [...accounts];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(acc => 
        acc.cuenta.includes(query) || 
        acc.subcuenta.includes(query) || 
        acc.clasificacion.toLowerCase().includes(query)
      );
    }

    // Filter
    if (filterClass !== 'Todas') {
      result = result.filter(acc => acc.clasificacion === filterClass);
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = (a[sortConfig.key] || '').toString();
        const valB = (b[sortConfig.key] || '').toString();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [accounts, searchQuery, filterClass, sortConfig]);

  const renderSortIcon = (key: keyof Account) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown size={14} className="ml-1 text-slate-300" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1 text-blue-500" /> : <ArrowDown size={14} className="ml-1 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Plan de Cuentas</h2>
          <p className="text-slate-500">Maestro de cuentas contables de la organización</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-200"
        >
          <Plus size={20} /> Nueva Cuenta
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por código o clasificación..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            >
              <option value="Todas">Todas las Clasificaciones</option>
              <option value="Activo">Activo</option>
              <option value="Pasivo">Pasivo</option>
              <option value="Patrimonio">Patrimonio</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Gasto">Gasto</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('cuenta')}>
                  <div className="flex items-center">Cuenta {renderSortIcon('cuenta')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('subcuenta')}>
                  <div className="flex items-center">Subcuenta {renderSortIcon('subcuenta')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('clasificacion')}>
                  <div className="flex items-center">Clasificación {renderSortIcon('clasificacion')}</div>
                </th>
                <th className="px-6 py-4">Fecha Alta</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{acc.cuenta}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{acc.subcuenta}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      acc.clasificacion === 'Activo' ? 'bg-blue-100 text-blue-700' : 
                      acc.clasificacion === 'Pasivo' ? 'bg-amber-100 text-amber-700' : 
                      acc.clasificacion === 'Gasto' ? 'bg-red-100 text-red-700' :
                      acc.clasificacion === 'Ingreso' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {acc.clasificacion}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(acc.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => acc.id && deleteAccount(acc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAndSortedAccounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No se encontraron cuentas con los criterios aplicados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Agregar Nueva Cuenta</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cuenta (4 dígitos)</label>
                <input 
                  type="text" 
                  maxLength={4}
                  required
                  value={formData.cuenta}
                  onChange={(e) => setFormData({...formData, cuenta: e.target.value.replace(/\D/g, '')})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                  placeholder="Ej: 1000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Subcuenta (4 dígitos)</label>
                <input 
                  type="text" 
                  maxLength={4}
                  required
                  value={formData.subcuenta}
                  onChange={(e) => setFormData({...formData, subcuenta: e.target.value.replace(/\D/g, '')})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                  placeholder="Ej: 0001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Clasificación</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                  value={formData.clasificacion}
                  onChange={(e) => setFormData({...formData, clasificacion: e.target.value})}
                >
                  <option>Activo</option>
                  <option>Pasivo</option>
                  <option>Patrimonio</option>
                  <option>Ingreso</option>
                  <option>Gasto</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
