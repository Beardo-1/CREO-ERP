import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Volume2, VolumeX, Music } from 'lucide-react';
import { CreoLogo } from '../Logo/CreoLogo';
import { useTranslation } from '../../contexts/TranslationContext';
import { loginContent } from './Login.content';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const { t, currentLanguage, toggleLanguage } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<any>(null);
  

  // Initialize ambient music
  useEffect(() => {
    // Audio functionality disabled to fix deployment issues
    // const audio = new Audio('/morning-in-the-forest-347089.mp3');
    // audio.loop = true;
    // audio.volume = 0.3;
    // audio.preload = 'auto';
    // audioRef.current = audio;

    // Handle audio loading
    const handleCanPlay = () => {
          };

    const handleError = (e: any) => {
      console.error('Audio functionality disabled for deployment');
    };

    // audio.addEventListener('canplay', handleCanPlay);
    // audio.addEventListener('error', handleError);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        // audioRef.current.removeEventListener('canplay', handleCanPlay);
        // audioRef.current.removeEventListener('error', handleError);
        audioRef.current = null;
      }
    };
      }, []);

  const toggleMusic = async () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsMusicPlaying(true);
        } catch (error) {
                    setIsMusicPlaying(false);
        }
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0.3 : 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Use simple authentication service for reliable login
      const { simpleAuthService } = await import('../../services/SimpleAuthService');
      const result = await simpleAuthService.login({
        email: formData.email,
        password: formData.password
      });
      if (result.success && result.user) {
        localStorage.setItem('creo_user', JSON.stringify(result.user));
        localStorage.setItem('creo_authenticated', 'true');
        if (onLoginSuccess) onLoginSuccess();
      } else {
        alert(result.message || 'Invalid email or password. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden login-container cursor-auto">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 animate-gradient-slow"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/50 via-amber-100/30 to-orange-100/50 animate-gradient-reverse"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-orange-50/70 via-yellow-50/40 to-amber-50/60 animate-gradient-diagonal"></div>

      {/* Language Switcher Orb - Top Right */}
      <div className="absolute top-8 right-8 z-30">
        <div className="relative group">
          <button 
            onClick={toggleLanguage}
            className="relative w-14 h-14 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 shadow-2xl shadow-amber-500/50 backdrop-blur-sm border-2 border-white/40 animate-glow cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300/50"
            aria-label={`Switch to ${currentLanguage === 'en' ? 'Arabic' : 'English'}`}
            title={`Switch to ${currentLanguage === 'en' ? 'العربية' : 'English'}`}
          >
            {/* Inner glow ring */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
            
            {/* Center content */}
            <div className="relative flex items-center justify-center h-full z-10">
              <span className="text-xl font-bold text-white filter drop-shadow-lg transform transition-all duration-300 group-hover:scale-125">
                {currentLanguage === 'en' ? 'EN' : 'ع'}
              </span>
            </div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 rounded-full">
              <div className="absolute w-2 h-2 bg-white/90 rounded-full animate-bounce" 
                   style={{ 
                     top: '15%', 
                     left: '50%', 
                     transform: 'translateX(-50%)',
                     animationDelay: '0s',
                     animationDuration: '2s'
                   }}></div>
              <div className="absolute w-1.5 h-1.5 bg-yellow-200/80 rounded-full animate-ping" 
                   style={{ 
                     bottom: '20%', 
                     right: '25%',
                     animationDelay: '0.5s',
                     animationDuration: '1.5s'
                   }}></div>
              <div className="absolute w-1 h-1 bg-amber-200/70 rounded-full animate-pulse" 
                   style={{ 
                     left: '20%', 
                     top: '65%',
                     animationDelay: '1s',
                     animationDuration: '2.5s'
                   }}></div>
            </div>
          </button>
          
          {/* Enhanced tooltip */}
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm px-4 py-2 rounded-xl backdrop-blur-sm shadow-lg border border-amber-400/30 whitespace-nowrap">
              <div className="flex items-center space-x-2">
                <span>Switch to</span>
                <span className="font-semibold">
                  {currentLanguage === 'en' ? 'العربية' : 'English'}
                </span>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-amber-600 to-orange-600 rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Music Control Orb - Top Right (next to language switcher) */}
      <div className="absolute top-8 right-24 z-30">
        <div className="relative group">
          <button 
            onClick={toggleMusic}
            className="relative w-14 h-14 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 shadow-2xl shadow-amber-500/50 backdrop-blur-sm border-2 border-white/40 animate-glow cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300/50"
            aria-label={isMusicPlaying && !isMuted ? 'Pause Forest Music' : 'Play Forest Music'}
            title={isMusicPlaying && !isMuted ? 'Pause Forest Ambience' : 'Play Forest Ambience'}
          >
            {/* Inner glow ring */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
            
            {/* Center content */}
            <div className="relative flex items-center justify-center h-full z-10">
              {isMusicPlaying && !isMuted ? (
                <Music className="w-6 h-6 text-white filter drop-shadow-lg transform transition-all duration-300 group-hover:scale-125 animate-pulse" />
              ) : (
                <Music className="w-6 h-6 text-white filter drop-shadow-lg transform transition-all duration-300 group-hover:scale-125" />
              )}
            </div>
            
            {/* Floating particles (always visible like language switcher) */}
            <div className="absolute inset-0 rounded-full">
              <div className="absolute w-2 h-2 bg-white/90 rounded-full animate-bounce" 
                   style={{ 
                     top: '15%', 
                     left: '50%', 
                     transform: 'translateX(-50%)',
                     animationDelay: '0s',
                     animationDuration: '2s'
                   }}></div>
              <div className="absolute w-1.5 h-1.5 bg-yellow-200/80 rounded-full animate-ping" 
                   style={{ 
                     bottom: '20%', 
                     right: '25%',
                     animationDelay: '0.5s',
                     animationDuration: '1.5s'
                   }}></div>
              <div className="absolute w-1 h-1 bg-amber-200/70 rounded-full animate-pulse" 
                   style={{ 
                     left: '20%', 
                     top: '65%',
                     animationDelay: '1s',
                     animationDuration: '2.5s'
                   }}></div>
            </div>
          </button>
          
          {/* Enhanced tooltip */}
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm px-4 py-2 rounded-xl backdrop-blur-sm shadow-lg border border-amber-400/30 whitespace-nowrap">
              <div className="flex items-center space-x-2">
                <span>{isMusicPlaying && !isMuted ? 'Pause' : 'Play'}</span>
                <span className="font-semibold">Forest Sounds</span>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-amber-600 to-orange-600 rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50 z-10"></div>
        <div className="w-full h-full bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 animate-gradient-xy"></div>
        
        {/* Floating Interactive Particles */}
        <div className="absolute inset-0 z-5">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full animate-float cursor-pointer hover:scale-150 hover:bg-gradient-to-r hover:from-amber-400/60 hover:to-orange-400/60 transition-all duration-300"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Floating Interactive Orbs */}
        <div className="absolute inset-0 z-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute w-12 h-12 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full animate-float-slow cursor-pointer hover:scale-125 hover:bg-gradient-to-r hover:from-amber-200/40 hover:to-orange-200/40 transition-all duration-500"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
              onClick={(e) => {
                // Create ripple effect
                const target = e.target as HTMLDivElement;
                const ripple = document.createElement('div');
                ripple.className = 'absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full animate-ping';
                target.appendChild(ripple);
                setTimeout(() => ripple.remove(), 1000);
              }}
            />
          ))}
        </div>
        
        {/* Interactive Geometric Shapes */}
        <div className="absolute top-20 left-20 w-24 h-24 border-2 border-amber-200/40 rounded-full animate-spin-slow cursor-pointer hover:border-amber-400/80 hover:scale-110 transition-all duration-300"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-orange-200/40 rotate-45 animate-pulse cursor-pointer hover:border-orange-400/80 hover:rotate-90 hover:scale-125 transition-all duration-500"></div>
        <div className="absolute top-1/2 left-10 w-14 h-14 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-lg animate-bounce-slow cursor-pointer hover:from-amber-400/60 hover:to-orange-400/60 hover:rotate-12 transition-all duration-300"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 border-2 border-yellow-200/40 rounded-full animate-ping cursor-pointer hover:border-yellow-400/80 hover:animate-spin transition-all duration-300"></div>
        
        {/* Ambient Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-10">
            <defs>
              <linearGradient id="ambientGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/>
                <stop offset="50%" stopColor="#ea580c" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#eab308" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            {[...Array(4)].map((_, i) => (
              <line
                key={`line-${i}`}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#ambientGradient)"
                strokeWidth="1"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </svg>
        </div>
      </div>
      
      {/* Login Container */}
      <div className="relative w-full max-w-md z-20 animate-fade-in-up">
        {/* Floating Elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-amber-200/30 to-orange-300/30 rounded-full animate-float-slow cursor-pointer hover:scale-110 transition-all duration-500"></div>
        <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-orange-200/30 to-yellow-300/30 rounded-full animate-float-reverse cursor-pointer hover:scale-110 transition-all duration-300"></div>
        <div className="absolute top-1/2 -right-16 w-8 h-8 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full animate-pulse cursor-pointer hover:scale-125 transition-all duration-400"></div>
        
        {/* Energy Rings */}
        <div className="absolute -inset-4 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-amber-200/15 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-orange-200/15 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-4 rounded-full border border-yellow-200/15 animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

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
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {t(loginContent.title)}
            </h1>
            <p className="text-gray-600 text-lg animate-fade-in-delay">{t(loginContent.subtitle)}</p>
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
                {t(loginContent.labels.email)}
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 backdrop-blur-sm text-gray-800 placeholder-gray-400 hover:bg-gray-50 hover:shadow-lg hover:shadow-amber-500/20 focus:shadow-xl focus:shadow-amber-500/30 hover:scale-105 focus:scale-105"
                  placeholder={t(loginContent.placeholders.email)}
                  onFocus={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t(loginContent.labels.password)}
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
                  className="w-full pl-12 pr-14 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 backdrop-blur-sm text-gray-800 placeholder-gray-400 hover:bg-gray-50 hover:shadow-lg hover:shadow-orange-500/20 focus:shadow-xl focus:shadow-orange-500/30 hover:scale-105 focus:scale-105"
                  placeholder={t(loginContent.placeholders.password)}
                  onFocus={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 10px 25px rgba(234, 88, 12, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
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
                  {t(loginContent.labels.rememberMe)}
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-amber-600 hover:text-amber-500 font-medium transition-colors duration-200"
              >
                {t(loginContent.actions.forgotPassword)}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300/50 disabled:opacity-50 disabled:cursor-not-allowed animate-glow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t(loginContent.actions.signingIn)}</span>
                  </>
                ) : (
                  <>
                    <span>{t(loginContent.actions.signIn)}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </div>
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
              <Shield className="w-4 h-4" />
              <span>{t(loginContent.security.secureLogin)}</span>
            </div>
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
              className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 bg-gray-50/50 hover:bg-gray-100 transition-all duration-300 hover:scale-105 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 bg-gray-50/50 hover:bg-gray-100 transition-all duration-300 hover:scale-105 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Demo Credentials</h4>
            <div className="space-y-1 text-xs text-amber-700">
              <p><strong>Admin:</strong> admin@creoerp.com / admin123</p>
              <p><strong>Manager:</strong> manager@creoerp.com / manager123</p>
              <p><strong>Agent:</strong> agent@creoerp.com / agent123</p>
              <p><strong>Demo:</strong> demo@creoerp.com / demo123</p>
            </div>
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