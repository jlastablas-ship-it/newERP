
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, Bell, Search, ChevronRight } from 'lucide-react';

const Topbar: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">ERPapp</Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const label = value.charAt(0).toUpperCase() + value.slice(1);
            
            return (
              <React.Fragment key={to}>
                <ChevronRight size={14} className="mx-2 text-slate-300" />
                {isLast ? (
                  <span className="font-semibold text-slate-900">{label}</span>
                ) : (
                  <Link to={to} className="hover:text-blue-600 transition-colors">{label}</Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-lg text-slate-400 group focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-transparent border-none outline-none text-sm ml-2 text-slate-900 placeholder-slate-400 w-48"
          />
        </div>
        
        <button className="text-slate-400 hover:text-slate-600 relative">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">Admin User</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            AU
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
