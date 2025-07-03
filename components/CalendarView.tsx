import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Flag } from 'lucide-react';
import useStore from '../store/useStore';
import { Task } from '../types';
import 'react-calendar/dist/Calendar.css';

const CalendarView: React.FC = () => {
  const { tasks } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const getDateClassName = (date: Date): string => {
    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length === 0) return '';
    
    const hasHighPriority = tasksForDate.some(task => task.priority === 'high');
    const hasCompleted = tasksForDate.some(task => task.status === 'completed');
    
    if (hasHighPriority) return 'high-priority-date';
    if (hasCompleted) return 'completed-date';
    return 'has-tasks-date';
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

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
          className="text-4xl md:text-5xl font-bold text-white mb-2 font-poppins"
        >
          📅 Calendar View
        </motion.h1>
        <p className="text-white/80 text-lg">
          Visualize your tasks and deadlines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="bg-white rounded-xl p-4">
              <Calendar
                onChange={(value) => setSelectedDate(value as Date)}
                value={selectedDate}
                className="custom-calendar"
                tileClassName={({ date }) => getDateClassName(date)}
              />
            </div>
          </div>
        </motion.div>

        {/* Tasks for Selected Date */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-4"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-white" />
              <h2 className="text-xl font-semibold text-white">
                {format(selectedDate, 'MMMM dd, yyyy')}
              </h2>
            </div>

            {selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 flex-1">
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Flag 
                          className={`h-4 w-4 ${
                            task.priority === 'high' ? 'text-red-500' :
                            task.priority === 'medium' ? 'text-yellow-500' :
                            'text-green-500'
                          }`} 
                        />
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-white ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'inprogress' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                      
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(task.dueDate), 'HH:mm')}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-2">📅</div>
                <p className="text-white/60">No tasks for this date</p>
              </div>
            )}
          </div>

          {/* Calendar Legend */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <span className="text-white/80">High Priority Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                <span className="text-white/80">Completed Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span className="text-white/80">Regular Tasks</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-calendar {
          width: 100%;
          background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
          border: none;
          font-family: 'Poppins', 'Inter', sans-serif;
          font-size: 1.1rem;
          box-shadow: 0 4px 24px 0 rgba(80, 120, 255, 0.08);
        }
        .custom-calendar .react-calendar__tile {
          background: rgba(255,255,255,0.7);
          border: none;
          color: #374151;
          border-radius: 12px;
          margin: 3px;
          transition: all 0.25s cubic-bezier(.4,2,.6,1);
          box-shadow: 0 1px 4px 0 rgba(80, 120, 255, 0.06);
        }
        .custom-calendar .react-calendar__tile:hover {
          background-color: #dbeafe;
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 4px 16px 0 rgba(80, 120, 255, 0.18);
        }
        .custom-calendar .react-calendar__tile--active {
          background-color: #6366f1 !important;
          color: white;
          font-weight: bold;
          box-shadow: 0 6px 24px 0 rgba(99,102,241,0.18);
        }
        .custom-calendar .high-priority-date {
          background-color: #fca5a5 !important;
          color: #991b1b;
          font-weight: bold;
        }
        .custom-calendar .completed-date {
          background-color: #86efac !important;
          color: #166534;
          font-weight: bold;
        }
        .custom-calendar .has-tasks-date {
          background-color: #93c5fd !important;
          color: #1e40af;
          font-weight: bold;
        }
      `}</style>
    </motion.div>
  );
};

export default CalendarView;