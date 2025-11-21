import React, { useState } from 'react';
import { Zap, ArrowRight, Lock, Mail, Loader2, Link as LinkIcon, Linkedin } from 'lucide-react';

interface Props {
  onLogin: (email: string) => void;
}

export const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (!isLogin) {
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
    }
    
    setIsLoading(true);
    // Simulating Cloudflare Auth / Backend delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          // Simulate successful social login by generating a consistent demo email
          onLogin(`demo@${provider}.com`);
      }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4 relative overflow-hidden font-sans">
      {/* Abstract Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-200/40 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-200/40 rounded-full blur-[120px] animate-float delay-1000"></div>

      <div className="bg-white w-full max-w-[480px] rounded-[2.5rem] shadow-soft p-8 md:p-10 relative z-10 animate-scale-in border border-slate-100 my-10">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-200">
              <Zap className="w-6 h-6 text-white fill-white" />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to Linkichat</h1>
           <p className="text-slate-400 text-sm mt-2">Your AI Personal Brand Architect.</p>
        </div>

        {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center animate-fade-in">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium text-sm">Authenticating securely...</p>
            </div>
        ) : (
            <>
                <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Signup: LinkedIn URL */}
                {!isLogin && (
                    <div className="space-y-1 animate-slide-up">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">LinkedIn Profile</label>
                        <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="url" 
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 transition-all text-sm"
                            placeholder="https://linkedin.com/in/you"
                        />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 transition-all text-sm"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 transition-all text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {/* Signup: Confirm Password */}
                {!isLogin && (
                    <div className="space-y-1 animate-slide-up">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                        <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 transition-all text-sm ${confirmPassword && password !== confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-slate-100'}`}
                            placeholder="••••••••"
                            required
                        />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-6"
                >
                    {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </button>
                </form>

                {/* Social Login */}
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-slate-400 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button 
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center w-full px-4 py-3 border border-slate-100 rounded-2xl shadow-sm bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleSocialLogin('linkedin')}
                            className="flex items-center justify-center w-full px-4 py-3 border border-blue-100 rounded-2xl shadow-sm bg-blue-50 text-sm font-bold text-blue-700 hover:bg-blue-100 hover:border-blue-200 transition-all gap-2"
                        >
                            <Linkedin className="w-5 h-5 fill-current" />
                            LinkedIn
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <p className="text-sm text-slate-500 font-medium">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setPassword(''); setConfirmPassword(''); }}
                        className="ml-2 text-purple-600 font-bold hover:underline focus:outline-none"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
                </div>

                <div className="mt-6 text-center text-[10px] text-slate-300 font-medium">
                    Secured by Cloudflare
                </div>
            </>
        )}
      </div>
      
      <div className="absolute bottom-4 text-center w-full text-[10px] text-slate-400">
          Product of <a href="https://brantatech.com" target="_blank" rel="noreferrer" className="font-bold text-slate-500 hover:text-slate-700">Branta Tech</a>
      </div>
    </div>
  );
};