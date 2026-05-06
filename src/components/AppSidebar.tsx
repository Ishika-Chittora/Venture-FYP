import { LayoutDashboard, History, GitCompareArrows, Settings, LogOut, Zap, Brain, BookOpen } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
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

      <SidebarFooter className="px-3 py-4 border-t border-border/30">
        {user && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
              {(user.user_metadata?.full_name?.[0] || user.email?.[0] || '?').toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
            <button
              onClick={signOut}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
