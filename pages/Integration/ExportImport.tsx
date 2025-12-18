
import React, { useState } from 'react';
import { db } from '../../db';
import { Download, Upload, Database, CheckCircle, AlertTriangle } from 'lucide-react';

const ExportImport: React.FC = () => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const exportData = async () => {
    try {
      const exportObj: any = {};
      const tables = ['accounts', 'journalEntries', 'suppliers', 'invoices', 'centers', 'users', 'roles'];
      
      for (const table of tables) {
        exportObj[table] = await (db as any)[table].toArray();
      }

      const json = JSON.stringify(exportObj, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `erpapp_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus({ type: 'success', message: 'Respaldo exportado correctamente' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Error al exportar los datos' });
    }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const tables = ['accounts', 'journalEntries', 'suppliers', 'invoices', 'centers', 'users', 'roles'];

        for (const table of tables) {
          if (data[table]) {
            await (db as any)[table].clear();
            await (db as any)[table].bulkAdd(data[table]);
          }
        }
        setStatus({ type: 'success', message: 'Datos importados y actualizados correctamente. La aplicación se recargará.' });
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        setStatus({ type: 'error', message: 'El archivo JSON no es válido o tiene un formato incorrecto' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Integración de Datos</h2>
        <p className="text-slate-500">Gestione copias de seguridad e intercambio de información mediante archivos JSON</p>
      </div>

      {status.type && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {status.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Download size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Exportar Base de Datos</h3>
          <p className="text-slate-500 text-sm mb-8 flex-grow">
            Descargue un archivo JSON con toda la información de la aplicación. Esto incluye cuentas, asientos, proveedores, facturas y usuarios.
          </p>
          <button 
            onClick={exportData}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Generar Respaldo JSON
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <Upload size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Importar Datos (Upsert)</h3>
          <p className="text-slate-500 text-sm mb-8 flex-grow">
            Seleccione un archivo JSON para restaurar información. Se recomienda realizar una exportación previa antes de proceder.
          </p>
          <label className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg text-center cursor-pointer">
            Seleccionar Archivo
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
        <div className="text-amber-500 shrink-0"><AlertTriangle size={24} /></div>
        <div>
          <h4 className="font-bold text-amber-900 text-sm mb-1">Aviso Importante</h4>
          <p className="text-amber-700 text-xs leading-relaxed">
            La importación de datos sobreescribe los registros actuales que coincidan en identificador (ID). 
            Asegúrese de que el archivo procede de una fuente confiable de ERPapp para evitar corrupción de la estructura.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportImport;
