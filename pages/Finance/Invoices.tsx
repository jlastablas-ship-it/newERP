
import React, { useState, useEffect } from 'react';
import { db, Invoice, Supplier } from '../../db';
import { Plus, Trash2, Search, FileText, Calendar, DollarSign, User } from 'lucide-react';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<(Invoice & { supplierName?: string })[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    supplierId: 0, 
    numeroFactura: '', 
    fechaFactura: new Date().toISOString().split('T')[0], 
    description: '', 
    amount: 0 
  });
  const [error, setError] = useState('');

  const loadData = async () => {
    const [invs, sups] = await Promise.all([
      db.invoices.reverse().toArray(),
      db.suppliers.toArray()
    ]);
    
    const enrichedInvoices = invs.map(inv => ({
      ...inv,
      supplierName: sups.find(s => s.id === inv.supplierId)?.nombreProveedor || 'Desconocido'
    }));

    setInvoices(enrichedInvoices);
    setSuppliers(sups);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.supplierId === 0) {
      setError('Debe seleccionar un proveedor.');
      return;
    }

    await db.invoices.add({
      ...formData,
      timestamp: Date.now()
    });

    setIsModalOpen(false);
    setFormData({ 
      supplierId: 0, 
      numeroFactura: '', 
      fechaFactura: new Date().toISOString().split('T')[0], 
      description: '', 
      amount: 0 
    });
    loadData();
  };

  const deleteInvoice = async (id: number) => {
    if (confirm('¿Eliminar esta factura del registro?')) {
      await db.invoices.delete(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Registro de Facturas</h2>
          <p className="text-slate-500">Listado histórico de facturas de proveedores recibidas</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md shadow-emerald-200"
        >
          <Plus size={20} /> Registrar Factura
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por factura o proveedor..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Proveedor</th>
                <th className="px-6 py-4">Nº Factura</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Importe</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">{inv.supplierName}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{inv.numeroFactura}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(inv.fechaFactura).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${inv.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => inv.id && deleteInvoice(inv.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No hay facturas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
              <h3 className="text-xl font-bold text-emerald-900">Registrar Factura de Compra</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-400 hover:text-emerald-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Proveedor</label>
                  <select 
                    required
                    value={formData.supplierId}
                    onChange={(e) => setFormData({...formData, supplierId: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option value={0}>Seleccione proveedor...</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.numeroProveedor} - {s.nombreProveedor}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Número de Factura</label>
                  <input 
                    type="text" 
                    required
                    value={formData.numeroFactura}
                    onChange={(e) => setFormData({...formData, numeroFactura: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    placeholder="Ej: FAC-2024-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de Factura</label>
                  <input 
                    type="date" 
                    required
                    value={formData.fechaFactura}
                    onChange={(e) => setFormData({...formData, fechaFactura: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Importe Total</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción / Concepto</label>
                  <textarea 
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    placeholder="Detalles adicionales..."
                  ></textarea>
                </div>
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
                  className="flex-1 py-2.5 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                >
                  Grabar Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
