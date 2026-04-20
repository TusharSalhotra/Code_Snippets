'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useLogin } from '../hooks/use-login';
import { AUTH_ROUTES } from '../constants';
import { loginSchema, type LoginSchema } from '../schemas/auth.schema';

export const LoginForm = () => {
  const { login, isLoading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data);
    } catch (err) {
      // Error is handled by useLogin hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-white mb-2 block">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B6C1]" />
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full h-9 pl-11 pr-3 py-1 bg-white/5 border border-white/10 text-white placeholder:text-[#B0B6C1] rounded-md focus:ring-[3px] focus:ring-[#00F5C6]/50 focus:border-[#00F5C6] outline-none transition-all text-sm"
            placeholder="you@company.com"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="text-sm font-medium text-white mb-2 block">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B6C1]" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...register('password')}
            className="w-full h-9 pl-11 pr-11 py-1 bg-white/5 border border-white/10 text-white placeholder:text-[#B0B6C1] rounded-md focus:ring-[3px] focus:ring-[#00F5C6]/50 focus:border-[#00F5C6] outline-none transition-all text-sm"
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B6C1] hover:text-white transition"
          >
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            {...register('rememberMe')}
            className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#00F5C6] focus:ring-[3px] focus:ring-[#00F5C6]/50 focus:ring-offset-0"
          />
          <label htmlFor="rememberMe" className="text-sm text-[#B0B6C1] cursor-pointer">
            Remember me
          </label>
        </div>
        <a href={AUTH_ROUTES.FORGOT_PASSWORD} className="text-sm text-[#00F5C6] hover:text-[#00F5C6]/80 transition">
          Forgot password?
        </a>
      </div>

      {/* Sign In Button - Updated to Red */}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-red-500/50 w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white h-9 px-4 py-2"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[rgba(10,15,28,0.8)] text-[#B0B6C1]">or continue with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 h-9 border border-white/10 hover:bg-white/5 rounded-md transition-all text-sm font-medium text-white outline-none focus-visible:ring-[3px] focus-visible:ring-[#00F5C6]/50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 h-9 border border-white/10 hover:bg-white/5 rounded-md transition-all text-sm font-medium text-white outline-none focus-visible:ring-[3px] focus-visible:ring-[#00F5C6]/50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          GitHub
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-[#B0B6C1] text-sm">
          Don't have an account?{' '}
          <a href={AUTH_ROUTES.REGISTER} className="text-[#00F5C6] hover:text-[#00F5C6]/80 transition">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};
