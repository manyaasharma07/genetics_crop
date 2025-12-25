import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dna, Leaf, Shield, Users, ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/types/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { login, signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Missing credentials',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      });
      return;
    }

    if (mode === 'signin') {
      const result = await login(email, password, selectedRole);

      if (result.success) {
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${selectedRole === 'admin' ? 'Administrator' : 'Researcher'}`,
        });
        navigate(selectedRole === 'admin' ? '/admin/dashboard' : '/dashboard');
      } else {
        toast({
          title: 'Login failed',
          description: result.message ?? 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
      }
      return;
    }

    const result = await signUp({ email, password, role: selectedRole, username });
      if (result.success) {
      toast({
        title: 'Account created',
        description: selectedRole === 'admin' ? 'Admin account ready.' : 'Welcome to the platform.',
      });
      navigate(selectedRole === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else {
      toast({
        title: 'Could not create account',
        description: result.message ?? 'Please check your details and try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <img src="/rv-logo.svg" alt="RV College of Engineering" className="w-14 h-14 object-contain" />
              <div>
                <h1 className="text-3xl font-bold">Genetic Traits & Crop Recommendation</h1>
                <p className="text-primary-foreground/80">RV College of Engineering</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Unlock the Power of<br />Agricultural Genetics
            </h2>
            
            <p className="text-lg text-primary-foreground/90 mb-10 max-w-md">
              Advanced machine learning meets crop science. Analyze genetic traits, 
              predict yields, and make data-driven agricultural decisions.
            </p>

            <div className="space-y-4">
              {[
                { icon: Leaf, text: 'Comprehensive crop and trait databases' },
                { icon: Shield, text: 'Secure data management and analysis' },
                { icon: Users, text: 'Collaborative research tools' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-primary-foreground/90">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src="/rv-logo.svg" alt="RV College of Engineering" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold">Genetic DBMS</span>
          </div>

          <Card variant="elevated" className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</CardTitle>
              <CardDescription>
                {mode === 'signin' ? 'Sign in to access your dashboard' : 'Get started to save your credentials'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'signin' | 'signup')} className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Get Started</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user" className="gap-2">
                    <Users className="w-4 h-4" />
                    Researcher
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                
                {mode === 'signup' && selectedRole === 'admin' && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Admin Username (must start with AD-)</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="AD-lead01"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero"
                  size="lg"
                  className="w-full mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {mode === 'signin' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border space-y-1">
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Shield className="w-4 h-4" />
                  Passwords for new accounts must be at least 8 characters.
                </p>
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  Admin usernames must start with "AD-" plus at least 5 characters.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
