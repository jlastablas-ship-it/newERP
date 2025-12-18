
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  GitBranch, 
  BookOpen, 
  History, 
  Calculator, 
  Truck, 
  FileText, 
  Database, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const NavItem = ({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`
    }
  >
    <Icon size={20} className="shrink-0" />
    {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-slate-900 transition-all duration-300 z-50 flex flex-col shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        {!collapsed && <h1 className="text-xl font-bold text-white tracking-tight">ERP<span className="text-blue-500">app</span></h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
        <div>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        </div>

        <div>
          {!collapsed && <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Administración</p>}
          <div className="space-y-1">
            <NavItem to="/admin/centers" icon={GitBranch} label="Centros" collapsed={collapsed} />
            <NavItem to="/admin/users" icon={Users} label="Usuarios" collapsed={collapsed} />
            <NavItem to="/admin/security" icon={ShieldCheck} label="Seguridad" collapsed={collapsed} />
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contabilidad</p>}
          <div className="space-y-1">
            <NavItem to="/accounting/accounts" icon={BookOpen} label="Plan de Cuentas" collapsed={collapsed} />
            <NavItem to="/accounting/journal" icon={Calculator} label="Asiento Diario" collapsed={collapsed} />
            <NavItem to="/accounting/transactions" icon={History} label="Historial" collapsed={collapsed} />
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Finanzas</p>}
          <div className="space-y-1">
            <NavItem to="/finance/suppliers" icon={Truck} label="Proveedores" collapsed={collapsed} />
            <NavItem to="/finance/invoices" icon={FileText} label="Facturas" collapsed={collapsed} />
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sistema</p>}
          <div className="space-y-1">
            <NavItem to="/integration" icon={Database} label="Integración" collapsed={collapsed} />
            <NavItem to="/settings" icon={Settings} label="Configuración" collapsed={collapsed} />
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-800 text-center">
         {!collapsed ? (
           <p className="text-[10px] text-slate-500 font-medium">v1.0.0 Stable</p>
         ) : (
           <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto"></div>
         )}
      </div>
    </aside>
  );
};

export default Sidebar;
