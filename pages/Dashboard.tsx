
import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, Wallet, Landmark } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    accounts: 0,
    suppliers: 0,
    invoices: 0,
    entries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const accounts = await db.accounts.count();
      const suppliers = await db.suppliers.count();
      const invoices = await db.invoices.count();
      const entries = await db.journalEntries.count();
      setStats({ accounts, suppliers, invoices, entries });
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Cuentas', value: stats.accounts, color: '#3b82f6' },
    { name: 'Proveedores', value: stats.suppliers, color: '#10b981' },
    { name: 'Facturas', value: stats.invoices, color: '#f59e0b' },
    { name: 'Asientos', value: stats.entries, color: '#6366f1' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resumen de Actividad</h2>
          <p className="text-slate-500">Bienvenido al panel central de ERPapp</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
          Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Landmark} label="Plan Contable" value={stats.accounts} color="blue" />
        <StatCard icon={Users} label="Proveedores" value={stats.suppliers} color="emerald" />
        <StatCard icon={Wallet} label="Facturas" value={stats.invoices} color="amber" />
        <StatCard icon={TrendingUp} label="Asientos" value={stats.entries} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Volumen de Datos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Módulos Activos</h3>
            <div className="space-y-4">
              <ModuleStatus label="Administración" status="Online" color="emerald" />
              <ModuleStatus label="Contabilidad" status="Online" color="blue" />
              <ModuleStatus label="Finanzas" status="Online" color="emerald" />
              <ModuleStatus label="Integración" status="Standby" color="amber" />
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
            Descargar Reporte PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const ModuleStatus = ({ label, status, color }: any) => {
  const dotColor: any = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor[color]}`}></span>
        <span className="text-xs font-semibold text-slate-500">{status}</span>
      </div>
    </div>
  );
};

export default Dashboard;
