import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

const LoginScreen = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        onLoginSuccess(response.user);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col fixed inset-0 overflow-hidden">
      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto overscroll-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="min-h-full flex flex-col items-center justify-center p-6 py-12">
          
          {/* Content wrapper */}
          <div className="flex flex-col items-center w-full max-w-md space-y-6">
            
            {/* Decorative header */}
            <div className="relative w-full max-w-[200px] mb-4">
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-green-200 rounded-3xl blur-3xl opacity-20 scale-110"></div>
              
              {/* BiomeDude circle */}
              <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shadow-lg border-4 border-green-200">
                <span className="text-5xl">🧬</span>
              </div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-2 px-4">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-base">
                Continue your plant quest
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="w-full bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Email input */}
              <div className="space-y-2">
                <label className="text-gray-700 font-semibold text-sm block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <label className="text-gray-700 font-semibold text-sm block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-4 pr-12 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-black text-lg py-5 px-10 rounded-full shadow-lg hover:shadow-green-600/60 transform hover:scale-[1.02] active:scale-95 disabled:scale-100 transition-all duration-200 uppercase tracking-widest border-3 border-green-700 ring-4 ring-green-200 ring-offset-2 mt-6"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="w-full flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Register link */}
            <div className="text-center space-y-3">
              <p className="text-gray-600 text-sm">
                Don't have an account?
              </p>
              <button
                onClick={onSwitchToRegister}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-green-600 font-black text-lg py-5 px-10 rounded-full shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 disabled:scale-100 transition-all duration-200 uppercase tracking-widest border-3 border-green-600 ring-2 ring-green-200 ring-offset-2"
              >
                Create Account
              </button>
            </div>

            {/* Bottom padding */}
            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
