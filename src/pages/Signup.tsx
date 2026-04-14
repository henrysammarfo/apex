import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Eye, EyeOff, Wallet, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const [authMethod, setAuthMethod] = useState<'email' | 'wallet'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await signUp(email, password, name);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleWalletConnect = async () => {
    setError('Wallet sign-up is not enabled yet. Use email sign-up for now.');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-inter font-extrabold text-foreground text-lg tracking-tight uppercase">APEX</span>
        </div>

        <div className="liquid-glass rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="font-inter font-bold text-foreground text-xl mb-1">Create your account</h1>
            <p className="font-inter text-sm text-muted-foreground">Start managing your portfolio with AI agents</p>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex bg-secondary/50 rounded-lg p-1 mb-6">
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-inter font-medium transition-colors ${
                authMethod === 'email' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => setAuthMethod('wallet')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-inter font-medium transition-colors ${
                authMethod === 'wallet' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Wallet className="w-4 h-4" /> Wallet
            </button>
          </div>

          {authMethod === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground text-xs font-inter uppercase tracking-wider">Name</Label>
                <Input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50 border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-xs font-inter uppercase tracking-wider">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-secondary/50 border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-xs font-inter uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-secondary/50 border-border pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-foreground text-xs font-inter uppercase tracking-wider">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-secondary/50 border-border" />
              </div>

              {error && <p className="text-destructive text-sm font-inter text-center">{error}</p>}

              <Button type="submit" className="w-full font-inter font-bold" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="font-inter text-[13px] text-muted-foreground text-center">
                Connect your wallet to create an account. You can set up your email and password in your profile later.
              </p>
              {error && <p className="text-destructive text-sm font-inter text-center">{error}</p>}
              <Button onClick={handleWalletConnect} className="w-full font-inter font-bold gap-2" disabled={loading}>
                <Wallet className="w-4 h-4" />
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
              <p className="font-inter text-[11px] text-muted-foreground text-center">
                Supports MetaMask, WalletConnect, and Coinbase Wallet.
              </p>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-3 text-[11px] text-muted-foreground font-inter">or</span></div>
          </div>

          <p className="text-center text-sm text-muted-foreground font-inter">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
