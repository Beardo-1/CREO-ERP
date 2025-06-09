import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { CreoLogo } from '../Logo/CreoLogo';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', formData);
      // Call the success callback to proceed to loading screen
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50 z-10"></div>
        <div className="w-full h-full bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 animate-gradient-xy"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 z-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-amber-300/30 to-orange-300/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-amber-200/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-orange-200/30 rotate-45 animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-lg animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 border-2 border-yellow-200/30 rounded-full animate-ping"></div>
      </div>
      
      {/* Login Container */}
      <div className="relative w-full max-w-md z-20 animate-fade-in-up">
        {/* Floating Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-amber-200/40 to-orange-300/40 rounded-full animate-float-slow"></div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-r from-orange-200/40 to-yellow-300/40 rounded-full animate-float-reverse"></div>
        <div className="absolute top-1/2 -right-20 w-12 h-12 bg-gradient-to-r from-amber-300/30 to-orange-300/30 rounded-full animate-pulse"></div>
        
        {/* Main Login Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 relative overflow-hidden hover:bg-white/95 transition-all duration-500">
          {/* Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 animate-gradient-x"></div>
          
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-amber-100/20 to-transparent animate-border-flow"></div>
          
          {/* Logo and Title */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 rounded-2xl mb-6 shadow-2xl animate-glow hover:scale-110 transition-transform duration-300">
              <CreoLogo size={56} color="white" className="animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 animate-text-shimmer">
              Welcome to Creo ERP
            </h1>
            <p className="text-gray-600 text-lg animate-fade-in-delay">Sign in to access your dashboard</p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping delay-100"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-200"></div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 backdrop-blur-sm text-gray-800 placeholder-gray-400 hover:bg-gray-50"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-14 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 backdrop-blur-sm text-gray-800 placeholder-gray-400 hover:bg-gray-50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded bg-gray-50"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-amber-600 hover:text-amber-500 font-medium transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white py-4 px-6 rounded-2xl font-semibold hover:from-amber-400 hover:via-orange-400 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span className="text-lg">Signing in...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">Sign In to Creo ERP</span>
                  <ArrowRight className="w-6 h-6 animate-pulse" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 rounded-full">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 bg-gray-50/50 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 bg-gray-50/50 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-amber-600 hover:text-amber-500 font-medium transition-colors duration-200 underline decoration-amber-600/50 hover:decoration-amber-500">
                Sign up here
              </button>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield className="w-4 h-4 animate-pulse" />
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 animate-fade-in-delay">
            © 2024 Creo ERP. All rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center space-x-1">
            <div className="w-1 h-1 bg-amber-400/70 rounded-full animate-ping"></div>
            <div className="w-1 h-1 bg-orange-400/70 rounded-full animate-ping delay-75"></div>
            <div className="w-1 h-1 bg-yellow-400/70 rounded-full animate-ping delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 