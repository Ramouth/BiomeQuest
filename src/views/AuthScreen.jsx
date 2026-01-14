/**
 * AuthScreen View
 * Handles user authentication UI
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, error: authError } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        // Validate registration
        if (!formData.username.trim()) {
          setLocalError('Username is required');
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          setLocalError('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setLocalError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        await register(formData.username, formData.email, formData.password);
      }
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setLocalError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-3xl font-bold text-white mb-2">BiomeQuest</h1>
          <p className="text-green-100">Plant diversity for gut health</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Choose a username"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={switchMode}
              className="text-green-600 font-semibold hover:text-green-700 mt-1"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-green-100 mt-6 text-sm">
          Track your plant diversity and boost your gut health
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
