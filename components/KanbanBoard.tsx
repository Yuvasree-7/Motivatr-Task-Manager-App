import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Lightbulb, CheckSquare, Clock, CheckCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { Task } from '../types';
import useStore from '../store/useStore';

const columns = [
  { 
    id: 'ideas', 
    title: '💡 Ideas', 
    icon: Lightbulb, 
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    borderColor: 'border-purple-200'
  },
  { 
    id: 'todo', 
    title: '📝 To-Do', 
    icon: CheckSquare, 
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    borderColor: 'border-blue-200'
  },
  { 
    id: 'inprogress', 
    title: '⏳ In Progress', 
    icon: Clock, 
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-200'
  },
  { 
    id: 'completed', 
    title: '✅ Completed', 
    icon: CheckCircle, 
    color: 'from-green-400 to-green-500',
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    borderColor: 'border-green-200'
  },
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingColumn, setAddingColumn] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'low' });

  const setStoreTasks = useStore(state => state.setTasks);
  const user = useStore(state => state.user);

  useEffect(() => {
    setLoading(true);
    if (!user || !user.email) return;
    fetchTasks(user.email)
      .then((latestTasks: Task[]) => {
        setTasks(latestTasks);
        setStoreTasks(latestTasks);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setStoreTasks, user]);

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleAddTask = async (columnId: string) => {
    if (!newTask.title.trim() || !user || !user.email) return;
    try {
      await createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: columnId as Task['status'],
        tags: [],
        sharedWith: [],
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        createdAt: new Date(),
        userEmail: user.email,
      });
      const latestTasks = await fetchTasks(user.email);
      setTasks(latestTasks);
      setStoreTasks(latestTasks);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'low' });
      setAddingColumn(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await updateTask(id, updates);
      if (!user || !user.email) return;
      const latestTasks = await fetchTasks(user.email);
      setTasks(latestTasks);
      setStoreTasks(latestTasks);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      if (!user || !user.email) return;
      const latestTasks = await fetchTasks(user.email);
      setTasks(latestTasks);
      setStoreTasks(latestTasks);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMarkCompleted = async (id: string) => {
    await handleUpdateTask(id, { status: 'completed' });
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Task['status'];
    await handleUpdateTask(draggableId, { status: newStatus });
  };

  if (loading) return <div className="text-center py-10">Loading tasks...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-green-200/20 rounded-full blur-xl"
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {columns.map((column, columnIndex) => {
            const columnTasks = getTasksByStatus(column.id as Task['status']);
            
            return (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: columnIndex * 0.1 }}
                whileHover={{ y: -2 }}
                className={`${column.bgColor} backdrop-blur-sm rounded-2xl p-5 min-h-96 border-2 ${column.borderColor} shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                {/* Column Header */}
                <motion.div
                  className={`bg-gradient-to-r ${column.color} rounded-xl p-4 mb-5 shadow-md`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <column.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <h2 className="text-white font-bold text-lg">{column.title}</h2>
                    </div>
                    <motion.span
                      key={columnTasks.length}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white/30 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-semibold shadow-sm"
                    >
                      {columnTasks.length}
                    </motion.span>
                  </div>
                </motion.div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 min-h-64 p-3 rounded-xl transition-all duration-300 ${
                        snapshot.isDraggingOver 
                          ? 'bg-white/40 backdrop-blur-sm scale-102 shadow-inner border-2 border-dashed border-white/60' 
                          : 'bg-transparent'
                      }`}
                    >
                      <AnimatePresence>
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  onUpdate={(updates) => handleUpdateTask(task.id, updates)}
                                  onDelete={() => handleDeleteTask(task.id)}
                                  isDragging={snapshot.isDragging}
                                  onMarkCompleted={() => handleMarkCompleted(task.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}

                      {/* Add Task Button or Form */}
                      {addingColumn === column.id ? (
                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            handleAddTask(column.id);
                          }}
                          className="w-full p-4 border-2 border-dashed border-pink-300 rounded-xl bg-white/80 flex flex-col gap-2 mb-2"
                        >
                          <input
                            type="text"
                            placeholder="Task title"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 font-semibold"
                            required
                          />
                          <textarea
                            placeholder="Description (optional)"
                            value={newTask.description}
                            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-700"
                            rows={2}
                          />
                          <input
                            type="datetime-local"
                            value={newTask.dueDate}
                            onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-700"
                          />
                          <select
                            value={newTask.priority}
                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-700"
                            required
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="submit"
                              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => { setAddingColumn(null); setNewTask({ title: '', description: '', dueDate: '', priority: 'low' }); }}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <motion.button
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            borderColor: 'rgba(255, 255, 255, 0.6)'
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-5 border-2 border-dashed border-white/40 rounded-xl text-gray-600 hover:text-gray-800 transition-all duration-300 flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-sm font-medium"
                          onClick={() => setAddingColumn(column.id)}
                        >
                          <motion.div
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Plus className="h-5 w-5" />
                          </motion.div>
                          <span>Add Task</span>
                        </motion.button>
                      )}
                    </div>
                  )}
                </Droppable>
              </motion.div>
            );
          })}
        </div>
      </DragDropContext>
    </motion.div>
  );
};

export default KanbanBoard;