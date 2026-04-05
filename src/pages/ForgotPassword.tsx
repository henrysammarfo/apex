import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-inter font-extrabold text-foreground text-lg tracking-tight uppercase">
            APEX
          </span>
        </div>

        <div className="liquid-glass rounded-2xl p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="font-inter font-bold text-foreground text-xl">Check your email</h1>
              <p className="font-inter text-sm text-muted-foreground">
                We've sent a password reset link to <span className="text-foreground font-medium">{email}</span>
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full mt-4 font-inter">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="font-inter font-bold text-foreground text-xl mb-1">Reset your password</h1>
                <p className="font-inter text-sm text-muted-foreground">Enter your email and we'll send you a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground text-xs font-inter uppercase tracking-wider">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>

                {error && (
                  <p className="text-destructive text-sm font-inter text-center">{error}</p>
                )}

                <Button type="submit" className="w-full font-inter font-bold" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <p className="text-center mt-6 text-sm text-muted-foreground font-inter">
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
