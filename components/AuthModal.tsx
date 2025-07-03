import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, MapPin } from 'lucide-react';
import useStore from '../store/useStore';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setUser } = useStore();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    country: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      const user = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        country: formData.country || undefined,
        currentStreak: 0,
        longestStreak: 0,
        totalTasks: 0,
        completedTasks: 0,
      };
      setUser(user);
      // Send to backend
      fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || crypto.randomUUID(), // Use entered password or random
          avatar: '', // You can add avatar upload later
        }),
      });
    } else {
      // Login mode: just set user with email (and name if provided)
      const user = {
        id: crypto.randomUUID(),
        name: formData.name || 'User',
        email: formData.email,
        currentStreak: 0,
        longestStreak: 0,
        totalTasks: 0,
        completedTasks: 0,
      };
      setUser(user);
      // Send to backend
      fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password || '',
        }),
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {mode === 'signup' ? 'Sign Up for Motivatr! 🎯' : 'Login to Motivatr'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex justify-center mb-4 gap-2">
              <button
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${mode === 'signup' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setMode('signup')}
                type="button"
              >
                Sign Up
              </button>
              <button
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${mode === 'login' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setMode('login')}
                type="button"
              >
                Login
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <GoogleLogin
                width="100%"
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    const decoded = jwtDecode(credentialResponse.credential) as any;
                    setUser({
                      id: crypto.randomUUID(),
                      name: decoded.name,
                      email: decoded.email,
                      avatar: decoded.picture,
                      currentStreak: 0,
                      longestStreak: 0,
                      totalTasks: 0,
                      completedTasks: 0,
                    });
                    // Send to backend
                    fetch('http://localhost:5000/signup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: decoded.name,
                        email: decoded.email,
                        password: decoded.sub, // Use Google sub as a dummy password
                        avatar: decoded.picture,
                      }),
                    });
                    onClose();
                  }
                }}
                onError={() => {
                  alert('Google Login Failed');
                }}
                useOneTap
              />

              <button
                disabled
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-3 rounded-xl opacity-60 cursor-not-allowed"
              >
                <User className="h-5 w-5" />
                <span>Continue with Microsoft (Coming Soon)</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {mode === 'signup' ? 'Or create your profile' : 'Or login with email'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {(mode === 'signup') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </div>

              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                {mode === 'signup' ? 'Start Your Journey! 🚀' : 'Login'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
