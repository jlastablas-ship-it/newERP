
import React, { useState, useEffect } from 'react';
import { db, Supplier } from '../../db';
import { Plus, Trash2, Edit2, Search, Truck, Filter } from 'lucide-react';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({ numeroProveedor: '', nombreProveedor: '', clasificacion: 'General' });
  const [error, setError] = useState('');

  const loadSuppliers = async () => {
    const data = await db.suppliers.reverse().toArray();
    setSuppliers(data);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleOpenModal = (supplier: Supplier | null = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        numeroProveedor: supplier.numeroProveedor,
        nombreProveedor: supplier.nombreProveedor,
        clasificacion: supplier.clasificacion,
      });
    } else {
      setEditingSupplier(null);
      setFormData({ numeroProveedor: '', nombreProveedor: '', clasificacion: 'General' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\d{4}$/.test(formData.numeroProveedor)) {
      setError('El Número de Proveedor debe ser numérico de exactamente 4 dígitos.');
      return;
    }

    if (editingSupplier) {
      await db.suppliers.update(editingSupplier.id!, {
        ...formData,
        timestamp: Date.now(),
      });
    } else {
      await db.suppliers.add({
        ...formData,
        timestamp: Date.now(),
      });
    }

    setIsModalOpen(false);
    loadSuppliers();
  };

  const deleteSupplier = async (id: number) => {
    if (confirm('¿Eliminar este proveedor? Se perderá la vinculación histórica.')) {
      await db.suppliers.delete(id);
      loadSuppliers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Maestro de Proveedores</h2>
          <p className="text-slate-500">Gestión de proveedores y acreedores de la empresa</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md shadow-emerald-200"
        >
          <Plus size={20} /> Nuevo Proveedor
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o número..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Nº Proveedor</th>
                <th className="px-6 py-4">Nombre Comercial</th>
                <th className="px-6 py-4">Clasificación</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{sup.numeroProveedor}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{sup.nombreProveedor}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      {sup.clasificacion}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(sup)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => sup.id && deleteSupplier(sup.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No hay proveedores registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
              <h3 className="text-xl font-bold text-emerald-900">{editingSupplier ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-400 hover:text-emerald-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Número de Proveedor (4 dígitos)</label>
                <input 
                  type="text" 
                  maxLength={4}
                  required
                  value={formData.numeroProveedor}
                  onChange={(e) => setFormData({...formData, numeroProveedor: e.target.value.replace(/\D/g, '')})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  placeholder="Ej: 0001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Comercial</label>
                <input 
                  type="text" 
                  required
                  value={formData.nombreProveedor}
                  onChange={(e) => setFormData({...formData, nombreProveedor: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  placeholder="Ej: Suministros Industriales S.A."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Clasificación</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  value={formData.clasificacion}
                  onChange={(e) => setFormData({...formData, clasificacion: e.target.value})}
                >
                  <option>General</option>
                  <option>Materia Prima</option>
                  <option>Servicios</option>
                  <option>Mantenimiento</option>
                  <option>Inmovilizado</option>
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
                  className="flex-1 py-2.5 px-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                >
                  {editingSupplier ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
