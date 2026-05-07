import { LogOut } from 'lucide-react';
import { handleLogout } from '@/lib/logout';

export const LogoutButton = () => {
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-white/70 
                 hover:text-rose-500 hover:bg-rose-500/10 transition-all rounded-lg group"
    >
      <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
      <span>Terminate Session</span>
    </button>
  );
};