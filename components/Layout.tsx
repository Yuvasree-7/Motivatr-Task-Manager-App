import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, User, Search, Filter, Flame } from 'lucide-react';
import useStore from '../store/useStore';

interface LayoutProps {
  children: React.ReactNode;
  onShowKanban: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onShowKanban }) => {
  const { activeView, setActiveView, searchQuery, setSearchQuery, selectedFilter, setSelectedFilter, streakData, isAuthenticated, user, setUser } = useStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLoginClick = () => {
    const event = new CustomEvent('open-auth-modal');
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%227%22/%3E%3Ccircle cx=%2253%22 cy=%227%22 r=%227%22/%3E%3Ccircle cx=%227%22 cy=%2253%22 r=%227%22/%3E%3Ccircle cx=%2253%22 cy=%2253%22 r=%227%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg border-b border-white/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white font-poppins">
                  🎯 Motivatr
                </h1>
              </motion.div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>

              {/* Filter & Streak */}
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-white font-semibold">{streakData.current}</span>
                </motion.div>

                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="all">All Tasks</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>

                {/* Auth Button/Avatar */}
                {!isAuthenticated ? (
                  <button
                    onClick={handleLoginClick}
                    className="ml-4 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Login / Sign Up
                  </button>
                ) : (
                  <div className="relative ml-4">
                    <button
                      onClick={() => setShowDropdown((v) => !v)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
                    >
                      <img src={user?.avatar || '/cartoon-boy.png'} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-pink-200" />
                      <span>{user?.name?.split(' ')[0] || 'User'}</span>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 z-50">
                        <button
                          onClick={() => { setActiveView('profile'); setShowDropdown(false); }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-t-xl"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => { setUser(null); setShowDropdown(false); }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 rounded-b-xl"
                        >
                          Log out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Navigation */}
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <motion.button
                key="dashboard"
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all ${
                  activeView === 'dashboard'
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Target className="h-4 w-4" />
                <span className="font-medium">Dashboard</span>
              </motion.button>
              <motion.button
                key="calendar"
                onClick={() => setActiveView('calendar')}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all ${
                  activeView === 'calendar'
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Calendar</span>
              </motion.button>
              <motion.button
                key="todo"
                onClick={onShowKanban}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all text-gray-300 hover:text-white hover:border-gray-300`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Target className="h-4 w-4" />
                <span className="font-medium">To Do List</span>
              </motion.button>
              <motion.button
                key="profile"
                onClick={() => setActiveView('profile')}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all ${
                  activeView === 'profile'
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <User className="h-4 w-4" />
                <span className="font-medium">Profile</span>
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;