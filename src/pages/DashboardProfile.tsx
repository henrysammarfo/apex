import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, CheckCircle2, Wallet, Link2, X, Eye, EyeOff, Key, Lock, Plus } from 'lucide-react';

const DashboardProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);

  // Email linking (for wallet-only users)
  const [showEmailLink, setShowEmailLink] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkEmailPassword, setLinkEmailPassword] = useState('');
  const [emailLinked, setEmailLinked] = useState(false);

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  // 2FA modal
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConnectWallet = () => {
    const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68';
    setWalletAddress(mockAddress);
    setWalletConnected(true);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress('');
    setWalletConnected(false);
  };

  const handleLinkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkEmail && linkEmailPassword.length >= 8) {
      setEmailLinked(true);
      setTimeout(() => {
        setShowEmailLink(false);
        setEmailLinked(false);
      }, 1500);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordSaved(true);
    setTimeout(() => {
      setPasswordSaved(false);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }, 1500);
  };

  const handle2FAEnable = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFACode.length === 6) {
      setTwoFAEnabled(true);
      setTimeout(() => {
        setShow2FAModal(false);
        setTwoFACode('');
      }, 1500);
    }
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="liquid-glass rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-inter font-bold text-primary">
                      {(user?.name || user?.email || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-inter font-bold text-foreground text-lg">{user?.name || 'User'}</h2>
                    <p className="font-inter text-sm text-muted-foreground">{user?.email}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-inter text-primary bg-primary/10 rounded-full px-2 py-0.5 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground text-xs font-inter uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Display Name
                    </Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50 border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground text-xs font-inter uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Email
                    </Label>
                    <Input value={user?.email || ''} disabled className="bg-secondary/30 border-border opacity-60" />
                    <p className="text-[11px] text-muted-foreground font-inter">Email cannot be changed here — contact support</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="font-inter font-bold">
                      {saved ? (
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Saved</span>
                      ) : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </motion.div>

              {/* Wallet */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="liquid-glass rounded-xl p-6">
                <h3 className="font-inter font-bold text-foreground text-[15px] mb-4 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary/60" /> Wallet
                </h3>
                {walletConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-inter text-sm text-foreground flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-primary" /> Connected
                        </p>
                        <p className="font-inter text-xs text-muted-foreground font-mono mt-1">{walletAddress}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleDisconnectWallet} className="font-inter text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60">
                        Disconnect
                      </Button>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-inter text-sm text-foreground">Network</p>
                          <p className="font-inter text-xs text-muted-foreground">HashKey Chain (HSK L2)</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-inter text-primary bg-primary/10 rounded-full px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      </div>
                    </div>

                    {/* Link Email — for wallet-only users */}
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-inter text-sm text-foreground flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Link Email
                          </p>
                          <p className="font-inter text-xs text-muted-foreground">Set up email login for this account</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowEmailLink(true)} className="font-inter text-xs gap-1">
                          <Plus className="w-3 h-3" /> Link
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="font-inter text-[13px] text-muted-foreground mb-4">Link your wallet for on-chain access and transaction signing.</p>
                    <Button onClick={handleConnectWallet} className="font-inter font-bold gap-2">
                      <Wallet className="w-4 h-4" /> Connect Wallet
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Security */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="liquid-glass rounded-xl p-6">
                <h3 className="font-inter font-bold text-foreground text-[15px] mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary/60" /> Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-inter text-sm text-foreground flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-muted-foreground" /> Password</p>
                      <p className="font-inter text-xs text-muted-foreground">Last changed: Never</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)} className="font-inter text-xs">
                      Change Password
                    </Button>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-inter text-sm text-foreground flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-muted-foreground" /> Two-Factor Authentication</p>
                      <p className="font-inter text-xs text-muted-foreground">
                        {twoFAEnabled ? 'Enabled — authenticator app' : 'Not enabled'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShow2FAModal(true)} className="font-inter text-xs">
                      {twoFAEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Account Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="liquid-glass rounded-xl p-6">
                <h3 className="font-inter font-bold text-foreground text-[15px] mb-3">Account</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="font-inter text-[12px] text-muted-foreground">User ID</span>
                    <span className="font-inter text-[12px] text-foreground/60 font-mono">{user?.id || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-t border-border/30">
                    <span className="font-inter text-[12px] text-muted-foreground">Account Type</span>
                    <span className="font-inter text-[12px] text-foreground">Institutional</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-t border-border/30">
                    <span className="font-inter text-[12px] text-muted-foreground">KYC Status</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-inter text-primary bg-primary/10 rounded-full px-2 py-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-t border-border/30">
                    <span className="font-inter text-[12px] text-muted-foreground">Member Since</span>
                    <span className="font-inter text-[12px] text-foreground">January 2025</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Link Email Modal */}
      <AnimatePresence>
        {showEmailLink && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setShowEmailLink(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="liquid-glass rounded-2xl w-full max-w-sm border border-border">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h2 className="font-inter font-bold text-foreground text-[15px]">Link Email Address</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowEmailLink(false)}><X className="w-5 h-5 text-muted-foreground" /></Button>
              </div>
              <form onSubmit={handleLinkEmail} className="p-6 space-y-4">
                <p className="font-inter text-[12px] text-muted-foreground">Set up an email and password so you can also sign in without your wallet.</p>
                <div className="space-y-2">
                  <Label className="text-foreground text-xs font-inter uppercase tracking-wider">Email Address</Label>
                  <Input type="email" value={linkEmail} onChange={(e) => setLinkEmail(e.target.value)} placeholder="you@example.com" required className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-xs font-inter uppercase tracking-wider">Set Password</Label>
                  <Input type="password" value={linkEmailPassword} onChange={(e) => setLinkEmailPassword(e.target.value)} placeholder="Min 8 characters" required className="bg-secondary/50 border-border" />
                </div>
                <Button type="submit" className="w-full font-inter font-bold">
                  {emailLinked ? <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Email Linked</span> : 'Link Email'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setShowPasswordModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="liquid-glass rounded-2xl w-full max-w-sm border border-border">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h2 className="font-inter font-bold text-foreground text-[15px]">Change Password</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowPasswordModal(false)}><X className="w-5 h-5 text-muted-foreground" /></Button>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground text-xs font-inter uppercase tracking-wider">Current Password</Label>
                  <div className="relative">
                    <Input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="bg-secondary/50 border-border pr-10" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-xs font-inter uppercase tracking-wider">New Password</Label>
                  <div className="relative">
                    <Input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="bg-secondary/50 border-border pr-10" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-xs font-inter uppercase tracking-wider">Confirm New Password</Label>
                  <Input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="bg-secondary/50 border-border" />
                </div>
                {passwordError && <p className="text-destructive text-[12px] font-inter">{passwordError}</p>}
                <Button type="submit" className="w-full font-inter font-bold">
                  {passwordSaved ? <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Updated</span> : 'Update Password'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2FA Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setShow2FAModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="liquid-glass rounded-2xl w-full max-w-sm border border-border">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h2 className="font-inter font-bold text-foreground text-[15px]">{twoFAEnabled ? 'Manage 2FA' : 'Enable 2FA'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShow2FAModal(false)}><X className="w-5 h-5 text-muted-foreground" /></Button>
              </div>
              <form onSubmit={handle2FAEnable} className="p-6 space-y-4">
                {twoFAEnabled ? (
                  <div className="text-center py-2">
                    <div className="inline-flex items-center gap-1.5 text-primary bg-primary/10 rounded-full px-3 py-1.5 font-inter text-[12px] mb-3">
                      <CheckCircle2 className="w-4 h-4" /> 2FA is active
                    </div>
                    <p className="font-inter text-[12px] text-muted-foreground">Two-factor authentication is enabled via authenticator app.</p>
                    <Button variant="outline" type="button" onClick={() => { setTwoFAEnabled(false); setShow2FAModal(false); }} className="mt-4 text-destructive border-destructive/30 hover:border-destructive/60 hover:text-destructive font-inter text-[12px]">
                      Disable 2FA
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="bg-secondary/30 rounded-lg p-4 flex items-center justify-center">
                      <div className="w-32 h-32 bg-foreground/10 rounded-lg flex items-center justify-center border border-border/30">
                        <div className="text-center">
                          <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                          <p className="font-inter text-[10px] text-muted-foreground px-2">QR Code<br />— connect backend —</p>
                        </div>
                      </div>
                    </div>
                    <p className="font-inter text-[12px] text-muted-foreground text-center">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="bg-secondary/20 rounded-lg p-3">
                      <p className="font-inter text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Backup Code</p>
                      <p className="font-inter text-[13px] text-foreground font-mono tracking-wider text-center">APEX-2FA-XXXX-XXXX</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-xs font-inter uppercase tracking-wider">Verification Code</Label>
                      <Input value={twoFACode} onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className="bg-secondary/50 border-border text-center tracking-[0.5em] font-mono" />
                    </div>
                    <Button type="submit" className="w-full font-inter font-bold" disabled={twoFACode.length !== 6}>Verify & Enable</Button>
                  </>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
};

export default DashboardProfile;
