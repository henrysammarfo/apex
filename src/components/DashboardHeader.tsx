import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, Clock, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { NotificationIcon } from '@/components/icons/DashboardIcons';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { WalletConnectButton } from '@/components/WalletConnectButton';

interface DashboardHeaderProps {
  title: string;
}

const notifications = [
  { id: 1, agent: 'Monitor', event: 'Price drift detected on cBOND (+1.2%)', time: '2 min ago', type: 'warning', read: false },
  { id: 2, agent: 'Decision', event: 'Rebalance approved: sell 0.8% cBOND → buy tUSTB', time: '5 min ago', type: 'success', read: false },
  { id: 3, agent: 'Execution', event: 'TX confirmed: 0x7a3f...c291', time: '5 min ago', type: 'success', read: false },
  { id: 4, agent: 'Settlement', event: 'Yield disbursement: $1,847 via HSP', time: '12 min ago', type: 'success', read: true },
  { id: 5, agent: 'Monitor', event: 'All assets within thresholds', time: '1 hr ago', type: 'info', read: true },
];

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(notifications);

  const unreadCount = notifs.filter(n => !n.read).length;

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  const typeIcon = (type: string) => {
    if (type === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-accent" />;
    if (type === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-primary" />;
    return <Info className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4 shrink-0 sticky top-0 z-30 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="h-5 w-px bg-border" />
        <h1 className="font-inter font-bold text-foreground text-sm">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <WalletConnectButton />
        <span className="flex items-center gap-1.5 text-[11px] font-inter text-primary bg-primary/10 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Agents Active
        </span>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <NotificationIcon className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0 font-inter text-sm">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-primary hover:text-primary/80 font-inter transition-colors">
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifs.map(n => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => navigate('/dashboard/agents')}
                className={`cursor-pointer px-3 py-2.5 flex items-start gap-2.5 ${!n.read ? 'bg-primary/[0.03]' : ''}`}
              >
                <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-inter text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{n.agent}</span>
                    <span className="flex items-center gap-1 font-inter text-[10px] text-muted-foreground shrink-0">
                      <Clock className="w-2.5 h-2.5" /> {n.time}
                    </span>
                  </div>
                  <p className="font-inter text-[12px] text-foreground leading-snug">{n.event}</p>
                </div>
                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/agents')} className="cursor-pointer justify-center">
              <span className="font-inter text-[12px] text-primary font-medium">View all activity</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[11px] font-inter font-bold text-primary">{initials}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-foreground font-inter">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground font-inter truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/profile')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
