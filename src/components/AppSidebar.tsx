import { LayoutDashboard, History, GitCompareArrows, Settings, LogOut, Zap, Brain, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { handleLogout } from '@/lib/logout';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Advanced Analytics', url: '/analytics', icon: Zap },
  { title: 'Founder Quiz', url: '/quiz', icon: Brain },
  { title: 'History', url: '/history', icon: History },
  { title: 'Compare', url: '/compare', icon: GitCompareArrows },
  { title: 'Knowledge Base', url: '/knowledge', icon: BookOpen },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user, signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <a href="/" className="px-4 py-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold gradient-text">VentureIQ</h1>
            <p className="text-[10px] text-muted-foreground">AI Risk Engine</p>
          </div>
        )}
      </a>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/dashboard'}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
                      activeClassName="text-foreground bg-muted/40 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:rounded-r-full before:bg-primary before:shadow-[0_0_8px_hsl(152_76%_36%/0.6)]"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4 border-t border-border/30 bg-sidebar/50 backdrop-blur-sm">
  {user && (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. User Identity Branding */}
      <div className="flex items-center gap-3 px-2">
        <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shadow-sm">
          {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {user.user_metadata?.full_name || 'Project Lead'}
            </p>
            <p className="text-[10px] text-muted-foreground truncate opacity-70">{user.email}</p>
          </div>
        )}
      </div>

      {/* 2. Tactical Reset Button (Logout) */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-between px-4 py-2.5 w-full text-xs font-medium 
                   bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 hover:text-rose-500 
                   border border-rose-500/10 hover:border-rose-500/30 transition-all rounded-xl group"
      >
        <div className="flex items-center gap-2">
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Log Out</span>
        </div>
        <span className="text-[9px] uppercase tracking-tighter opacity-50"></span>
      </button>
    </div>
  )}
</SidebarFooter>
    </Sidebar>
  );
}
