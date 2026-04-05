import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, CheckCircle2 } from 'lucide-react';

const DashboardProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save — swap with real API call
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Profile" />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Avatar & Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="liquid-glass rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-inter font-bold text-primary">
                      {(user?.name || user?.email || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-inter font-bold text-foreground text-lg">{user?.name || 'User'}</h2>
                    <p className="font-inter text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground text-xs font-inter uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Display Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary/50 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground text-xs font-inter uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Email
                    </Label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="bg-secondary/30 border-border opacity-60"
                    />
                    <p className="text-[11px] text-muted-foreground font-inter">Email cannot be changed here</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="font-inter font-bold">
                      {saved ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Saved
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>

              {/* Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="liquid-glass rounded-xl p-6"
              >
                <h3 className="font-inter font-bold text-foreground text-[15px] mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary/60" /> Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-inter text-sm text-foreground">Password</p>
                      <p className="font-inter text-xs text-muted-foreground">Last changed: Never</p>
                    </div>
                    <Button variant="outline" size="sm" className="font-inter text-xs">
                      Change Password
                    </Button>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-inter text-sm text-foreground">Two-Factor Authentication</p>
                      <p className="font-inter text-xs text-muted-foreground">Not enabled</p>
                    </div>
                    <Button variant="outline" size="sm" className="font-inter text-xs">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Account ID */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="liquid-glass rounded-xl p-6"
              >
                <h3 className="font-inter font-bold text-foreground text-[15px] mb-2">Account</h3>
                <p className="font-inter text-xs text-muted-foreground">
                  User ID: <span className="text-foreground/60 font-mono">{user?.id || '—'}</span>
                </p>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardProfile;
