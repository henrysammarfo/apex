import { ArrowLeft, LogOut } from 'lucide-react';
import { OverviewIcon, PortfolioIcon, AgentIcon, TransactionIcon, SettingsIcon, ApexLogo } from '@/components/icons/DashboardIcons';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const mainItems = [
  { title: 'Overview', url: '/dashboard', icon: OverviewIcon },
  { title: 'Portfolio', url: '/dashboard/portfolio', icon: PortfolioIcon },
  { title: 'Agent Activity', url: '/dashboard/agents', icon: AgentIcon },
  { title: 'Transactions', url: '/dashboard/transactions', icon: TransactionIcon },
];

const settingsItems = [
  { title: 'Settings', url: '/dashboard/settings', icon: SettingsIcon },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <ApexLogo className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <span className="font-inter font-extrabold text-foreground text-sm tracking-tight uppercase">
              APEX
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && !collapsed && (
          <div className="px-4 py-2 mb-1">
            <p className="font-inter text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Log Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/" className="hover:bg-sidebar-accent/50 text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {!collapsed && <span>Back to Site</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
