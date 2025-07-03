import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Award, Target, TrendingUp, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const ProfileView: React.FC = () => {
  const { user, streakData, tasks, setUser, setActiveView } = useStore();

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'inprogress').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0,
  };

  const achievements = [
    { name: 'First Task', description: 'Completed your first task', earned: stats.completedTasks >= 1 },
    { name: 'Streak Master', description: 'Maintained a 7-day streak', earned: streakData.longest >= 7 },
    { name: 'Task Warrior', description: 'Completed 50 tasks', earned: stats.completedTasks >= 50 },
    { name: 'Consistency King', description: 'Maintained a 30-day streak', earned: streakData.longest >= 30 },
    { name: 'Productivity Pro', description: '90% completion rate', earned: stats.completionRate >= 90 },
  ];

  const handleLogout = () => {
    setUser(null);
    setActiveView('dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-white mb-2 font-poppins drop-shadow-lg"
        >
          👤 Profile
        </motion.h1>
        <p className="text-white/90 text-xl font-medium">
          Track your progress and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            {/* Avatar */}
            <div className="text-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-28 h-28 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg border-4 border-pink-100 overflow-hidden"
              >
                <img src="/cute-girl.jpg" alt="Profile avatar" className="w-full h-full object-cover" />
              </motion.div>
              <h2 className="text-3xl font-bold text-pink-700 drop-shadow-lg">
                {user?.name || 'Anonymous User'}
              </h2>
              <p className="text-pink-500 text-lg font-medium">Productivity Enthusiast</p>
            </div>

            {/* User Info */}
            <div className="space-y-4 mb-6">
              {user?.email && (
                <div className="flex items-center space-x-3 text-pink-700 text-base">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
              
              {user?.country && (
                <div className="flex items-center space-x-3 text-pink-700 text-base">
                  <MapPin className="h-4 w-4" />
                  <span>{user.country}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-3 text-pink-700 text-base">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
            </div>

            {/* Log out button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-xl font-semibold mt-2 hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>
        </motion.div>

        {/* Stats & Achievements */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Tasks', value: stats.totalTasks, icon: Target, color: 'from-blue-400 to-blue-500' },
              { label: 'Completed', value: stats.completedTasks, icon: Award, color: 'from-green-400 to-green-500' },
              { label: 'Current Streak', value: streakData.current, icon: TrendingUp, color: 'from-orange-400 to-red-500' },
              { label: 'Best Streak', value: streakData.longest, icon: Award, color: 'from-purple-400 to-pink-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.08 }}
                className="bg-gradient-to-br from-pink-50 to-purple-100 rounded-xl p-4 shadow hover:shadow-lg border-2 border-pink-100 transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-6 w-6 text-pink-700" />
                  <span className="text-2xl font-bold text-pink-700">{stat.value}</span>
                </div>
                <p className="text-pink-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-pink-700 mb-4 flex items-center space-x-2 drop-shadow-lg">
              <Award className="h-5 w-5" />
              <span>Achievements</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold text-base shadow-md
                    ${achievement.earned
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-300 text-white'
                      : 'bg-white/30 border-white/30 text-pink-700/80'}
                  `}
                >
                  <div className={`flex items-center space-x-2 mb-2 ${achievement.earned ? '' : 'opacity-70'}`}>
                    <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>🏆</div>
                    <h4 className="font-bold tracking-wide drop-shadow-sm">{achievement.name}</h4>
                  </div>
                  <p className="text-sm font-medium drop-shadow-sm" style={{ color: achievement.earned ? '#fffbe7' : '#a21caf' }}>{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-100 rounded-2xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-pink-700 mb-4 drop-shadow-lg">Progress Overview</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-pink-700">Completion Rate</span>
                  <span className="text-pink-700 font-semibold">{stats.completionRate}%</span>
                </div>
                <div className="bg-white/20 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-pink-700">Active Tasks</span>
                  <span className="text-pink-700 font-semibold">{stats.inProgressTasks}</span>
                </div>
                <div className="bg-white/20 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.totalTasks > 0 ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileView;