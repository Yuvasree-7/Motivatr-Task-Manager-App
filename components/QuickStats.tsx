import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';

const QuickStats: React.FC = () => {
  const { tasks } = useStore();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'inprogress').length,
    pending: tasks.filter(t => t.status === 'todo').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: Target,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}
            >
              <stat.icon className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          
          {/* Progress bar for completion rate */}
          {stat.label === 'Completion Rate' && (
            <div className="mt-4">
              <div className="bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;