import React from 'react';
import { motion } from 'framer-motion';
import KanbanBoard from './KanbanBoard';
import StreakTracker from './StreakTracker';
import QuickStats from './QuickStats';

const Dashboard: React.FC<{ onShowKanban?: () => void }> = ({ onShowKanban }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Welcome Section with Cute Cartoon */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center relative"
      >
        {/* Floating cartoon elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 left-1/4 text-6xl opacity-80"
          >
            🌟
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-8 right-1/4 text-5xl opacity-70"
          >
            🎯
          </motion.div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-12 left-1/6 text-4xl opacity-60"
          >
            ✨
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-6 right-1/6 text-4xl opacity-60"
          >
            🚀
          </motion.div>
        </div>

        {/* Main cartoon mascot */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl md:text-9xl filter drop-shadow-lg"
            >
              🎯
            </motion.div>
            
            {/* Cute sparkles around mascot */}
            <motion.div
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 text-2xl"
            >
              ✨
            </motion.div>
            
            <motion.div
              animate={{ 
                scale: [1.2, 0.8, 1.2],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-1 -left-3 text-xl"
            >
              💫
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome text with enhanced styling */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-poppins drop-shadow-lg">
            Welcome to{' '}
            <motion.span
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.5)',
                  '0 0 30px rgba(255,255,255,0.8)',
                  '0 0 20px rgba(255,255,255,0.5)'
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
            >
              Motivatr!
            </motion.span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/90 text-lg md:text-xl font-medium drop-shadow-md"
          >
            Stay motivated, track your progress, and achieve your goals! 🌈
          </motion.p>
          
          {/* Cute motivational badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center space-x-4 mt-4"
          >
            {['🏆 Achiever', '🔥 Motivated', '⭐ Superstar'].map((badge, index) => (
              <motion.span
                key={badge}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium border border-white/30 cursor-pointer transition-all duration-300 hover:bg-white/30"
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Streak Tracker */}
      <StreakTracker />

      {/* Quick Stats */}
      <QuickStats />
    </motion.div>
  );
};

export default Dashboard;