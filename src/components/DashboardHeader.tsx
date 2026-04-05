import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4 shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="h-5 w-px bg-border" />
        <h1 className="font-inter font-bold text-foreground text-sm">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[11px] font-inter text-primary bg-primary/10 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Agents Active
        </span>

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
