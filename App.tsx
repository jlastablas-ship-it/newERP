
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounting/Accounts';
import JournalEntries from './pages/Accounting/JournalEntries';
import JournalHistory from './pages/Accounting/JournalHistory';
import Suppliers from './pages/Finance/Suppliers';
import Invoices from './pages/Finance/Invoices';
import ExportImport from './pages/Integration/ExportImport';
import Settings from './pages/Settings';
import UnderConstruction from './components/UnderConstruction';
import { seedDatabase } from './db';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen flex bg-slate-50 text-slate-900">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-64'}`}>
          <Topbar />
          
          <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Admin */}
              <Route path="/admin/centers" element={<UnderConstruction title="Maestro de Centros" />} />
              <Route path="/admin/users" element={<UnderConstruction title="Gestión de Usuarios" />} />
              <Route path="/admin/security" element={<UnderConstruction title="Seguridad y Roles" />} />
              
              {/* Accounting */}
              <Route path="/accounting/accounts" element={<Accounts />} />
              <Route path="/accounting/journal" element={<JournalEntries />} />
              <Route path="/accounting/transactions" element={<JournalHistory />} />
              
              {/* Finance */}
              <Route path="/finance/suppliers" element={<Suppliers />} />
              <Route path="/finance/invoices" element={<Invoices />} />
              
              {/* System */}
              <Route path="/integration" element={<ExportImport />} />
              <Route path="/settings" element={<Settings />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="p-6 text-center text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} ERPapp MicroPWA. Enterprise Resource Planning locally stored.
          </footer>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
