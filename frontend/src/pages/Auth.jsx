import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useGoogleLogin } from '@react-oauth/google';
import logo from '../assets/logo.png';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await authService.login({ email: formData.email, password: formData.password });
        setAuth(data.user, data.access);
        navigate('/profile');
      } else {
        const data = await authService.register(formData);
        setAuth(data.user, data.access);
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLoginAction = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await authService.googleLogin(tokenResponse.access_token);
        setAuth(data.user, data.access);
        navigate('/profile');
      } catch (err) {
        setError(err.message || 'Google Login Failed');
      }
    },
    onError: () => setError('Google Login Failed'),
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-32 pb-24 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_12px_40px_rgba(59,20,78,0.08)] border border-[#E5DACB] w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Sri Laxmi Venkateshwara Selections"
            className="h-16 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-serif text-[#3B144E] mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[#685A6E] text-sm">
            {isLogin
              ? 'Sign in to access your orders and saved addresses'
              : 'Join Sri Laxmi Venkateshwara Selections for exclusive collections and updates'}
          </p>
          {error && <p className="text-red-500 text-sm mt-4 bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</p>}
        </div>

        <form className="space-y-4" onSubmit={handleAuth}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#3B144E] mb-1">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E5DACB] focus:outline-none focus:border-[#55236F] focus:ring-2 focus:ring-[#55236F]/10 transition-colors" 
                placeholder="Priya Sharma" 
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-[#3B144E] mb-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-[#E5DACB] focus:outline-none focus:border-[#55236F] focus:ring-2 focus:ring-[#55236F]/10 transition-colors" 
              placeholder="you@example.com" 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#3B144E] mb-1">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-[#E5DACB] focus:outline-none focus:border-[#55236F] focus:ring-2 focus:ring-[#55236F]/10 transition-colors" 
              placeholder="••••••••" 
              required
            />
          </div>

          <Button variant="primary" className="w-full mt-6 py-3" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-[#E5DACB]/60 pt-6">
          <p className="text-xs uppercase tracking-wider text-[#685A6E]">Or continue with</p>
          <Button 
            variant="secondary" 
            className="w-full py-2.5 flex justify-center items-center gap-2"
            onClick={() => googleLoginAction()}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            <span className="text-sm">Sign in with Google</span>
          </Button>
        </div>

        <div className="mt-6 text-center border-t border-[#E5DACB]/60 pt-6">
          <p className="text-sm text-[#685A6E]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#55236F] font-semibold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
