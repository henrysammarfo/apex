import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Eye, EyeOff, Wallet, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount, useConnect } from 'wagmi';
import { hashKeyTestnet } from '@/lib/hashkeyChain';

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const { isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  const [authMethod, setAuthMethod] = useState<'email' | 'wallet'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authMethod === 'wallet' && isConnected) {
      navigate(from, { replace: true });
    }
  }, [authMethod, from, isConnected, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleWalletConnect = async () => {
    setError('');
    if (isConnected) {
      navigate(from, { replace: true });
      return;
    }
    const preferred = connectors.find((c) => c.id === 'injected' || c.type === 'injected') ?? connectors[0];
    if (!preferred) {
      setError('No wallet connector is available. Install MetaMask or enable WalletConnect.');
      return;
    }
    try {
      connect({ connector: preferred, chainId: hashKeyTestnet.id });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Wallet connection failed.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-inter font-extrabold text-foreground text-lg tracking-tight uppercase">APEX</span>
        </div>

        {/* Card */}
        <div className="liquid-glass rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="font-inter font-bold text-foreground text-xl mb-1">Welcome back</h1>
            <p className="font-inter text-sm text-muted-foreground">Sign in to your account to continue</p>
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
                <Label htmlFor="email" className="text-foreground text-xs font-inter uppercase tracking-wider">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-secondary/50 border-border" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground text-xs font-inter uppercase tracking-wider">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 font-inter transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-secondary/50 border-border pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-destructive text-sm font-inter text-center">{error}</p>}

              <Button type="submit" className="w-full font-inter font-bold" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="font-inter text-[13px] text-muted-foreground text-center">
                Connect your wallet to sign in. Supported wallets: MetaMask, WalletConnect, Coinbase Wallet.
              </p>
              {error && <p className="text-destructive text-sm font-inter text-center">{error}</p>}
              <Button onClick={handleWalletConnect} className="w-full font-inter font-bold gap-2" disabled={loading || isPending}>
                <Wallet className="w-4 h-4" />
                {isPending ? 'Connecting...' : isConnected ? 'Continue to Dashboard' : 'Connect Wallet'}
              </Button>
              <p className="font-inter text-[11px] text-muted-foreground text-center">
                You can link your email in your profile after connecting.
              </p>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-3 text-[11px] text-muted-foreground font-inter">or</span></div>
          </div>

          <p className="text-center text-sm text-muted-foreground font-inter">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
