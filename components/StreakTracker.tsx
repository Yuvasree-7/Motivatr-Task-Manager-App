import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, Zap } from 'lucide-react';
import useStore from '../store/useStore';

const StreakTracker: React.FC = () => {
  const { streakData } = useStore();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Streak */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-center text-white"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            <Flame className="h-12 w-12 mx-auto mb-2" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-1">{streakData.current}</h3>
          <p className="text-orange-100">Current Streak</p>
        </motion.div>

        {/* Longest Streak */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-center text-white"
        >
          <Trophy className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-2xl font-bold mb-1">{streakData.longest}</h3>
          <p className="text-yellow-100">Best Streak</p>
        </motion.div>

        {/* Weekly Progress */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">This Week</h3>
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-white/80 mb-1">{day}</div>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center ${
                    streakData.weeklyProgress[index]
                      ? 'bg-green-400 text-white'
                      : 'bg-white/20 text-white/50'
                  }`}
                >
                  {streakData.weeklyProgress[index] ? '✓' : '○'}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-white/80 text-lg font-medium">
          {streakData.current === 0 
            ? "Start your streak today! Complete a task to begin! 🚀"
            : streakData.current < 5
            ? "Great start! Keep the momentum going! 💪"
            : streakData.current < 10
            ? "You're on fire! Amazing progress! 🔥"
            : "Incredible dedication! You're a true achiever! 🏆"
          }
        </p>
      </motion.div>
    </motion.div>
  );
};

export default StreakTracker;