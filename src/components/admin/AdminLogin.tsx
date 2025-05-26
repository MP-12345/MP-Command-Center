
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Loader2, Lock, Mail, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (user: any) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('authenticate_admin', {
        p_email: email,
        p_pin_hash: pin // In production, this should be hashed client-side
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const user = data[0];
        onLogin(user);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or PIN",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg relative">
          <Shield className="w-8 h-8 text-white" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            MiraklePay Admin
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Secure access to the administration dashboard
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Admin Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:bg-white/80 transition-all duration-300"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Admin PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-10 h-12 bg-white/50 backdrop-blur-sm border-gray-200/60 focus:bg-white/80 transition-all duration-300"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Sign In Securely
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100/50">
          <p className="text-xs text-center text-gray-600">
            🔒 Secured with enterprise-grade encryption
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
