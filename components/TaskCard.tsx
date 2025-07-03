import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, Share2, Trash2, Clock } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';


interface TaskCardProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  isDragging?: boolean;
  onMarkCompleted?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, isDragging, onMarkCompleted }) => {
  const priorityColors = {
    low: 'from-green-400 to-green-500',
    medium: 'from-yellow-400 to-yellow-500',
    high: 'from-red-400 to-red-500',
  };

  const priorityIcons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<{
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  }>({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
    priority: task.priority || 'low',
  });

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    if (!task.dueDate) return;

    const now = new Date();
    const due = new Date(task.dueDate);
    // Notify 1 hour before due date
    const notifyTime = new Date(due.getTime() - 60 * 60 * 1000);
    const delay = notifyTime.getTime() - now.getTime();

    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Task Reminder', {
            body: `Reminder: Your task '${task.title}' is due in 1 hour!`,
          });
        }
      }, delay);
      return () => clearTimeout(timeoutId);
    } else if (due.getTime() > now.getTime()) {
      // If less than 1 hour left, notify immediately
      if (Notification.permission === 'granted') {
        new Notification('Task Reminder', {
          body: `Reminder: Your task '${task.title}' is due in less than 1 hour!`,
        });
      }
    }
  }, [task.dueDate, task.title]);

  useEffect(() => {
    setEditValues({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
      priority: task.priority || 'low',
    });
  }, [task]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'shadow-2xl scale-105 rotate-3' : ''
      }`}
    >
      {/* Mark as Completed Button */}
      {task.status !== 'completed' && !isEditing && (
        <button
          onClick={onMarkCompleted}
          className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow transition-all z-10"
          title="Mark as Completed"
        >
          ✓ Done
        </button>
      )}

      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-16 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow transition-all z-10"
          title="Edit Task"
        >
          Edit
        </button>
      )}

      {/* Priority indicator */}
      <div className={`h-1 bg-gradient-to-r ${priorityColors[task.priority]} rounded-full mb-3`} />
      
      {/* Task header */}
      <div className="flex items-start justify-between mb-2">
        {isEditing ? (
          <form
            className="flex-1 flex flex-col gap-2"
            onSubmit={e => {
              e.preventDefault();
              onUpdate({
                title: editValues.title,
                description: editValues.description,
                dueDate: editValues.dueDate ? new Date(editValues.dueDate) : undefined,
                priority: editValues.priority,
              });
              setIsEditing(false);
            }}
          >
            <input
              className="font-semibold text-gray-800 border rounded px-2 py-1 mb-1"
              value={editValues.title}
              onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))}
              required
            />
            <textarea
              className="text-gray-600 text-sm border rounded px-2 py-1 mb-1"
              value={editValues.description}
              onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))}
              rows={2}
            />
            <input
              type="datetime-local"
              className="text-xs border rounded px-2 py-1 mb-1"
              value={editValues.dueDate}
              onChange={e => setEditValues(v => ({ ...v, dueDate: e.target.value }))}
            />
            <select
              className="text-xs border rounded px-2 py-1 mb-1"
              value={editValues.priority}
              onChange={e => setEditValues(v => ({ ...v, priority: e.target.value as 'low' | 'medium' | 'high' }))}
              required
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="flex gap-2 mt-1">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Save</button>
              <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded" onClick={() => { setIsEditing(false); setEditValues({ title: task.title, description: task.description || '', dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '', priority: task.priority || 'low' }); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <h3 className="font-semibold text-gray-800 flex-1 line-clamp-2">{task.title}</h3>
        )}
        <div className="flex items-center space-x-1 ml-2">
          <span className="text-sm">{priorityIcons[task.priority]}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <Trash2 className="h-3 w-3" />
          </motion.button>
        </div>
      </div>

      {/* Task description */}
      {!isEditing && task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Tags */}
      {!isEditing && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Task footer */}
      {!isEditing && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
              </div>
            )}
            
            {task.sharedWith.length > 0 && (
              <div className="flex items-center space-x-1">
                <Share2 className="h-3 w-3" />
                <span>{task.sharedWith.length}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(task.createdAt), 'MMM dd')}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;