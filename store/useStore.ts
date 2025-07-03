import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, User, StreakData } from '../types';

interface AppStore {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Tasks state
  tasks: Task[];
  searchQuery: string;
  selectedFilter: 'all' | 'today' | 'week' | 'month';
  
  // Streak state
  streakData: StreakData;
  
  // UI state
  activeView: 'dashboard' | 'calendar' | 'profile';
  
  // Actions
  setUser: (user: User | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: 'all' | 'today' | 'week' | 'month') => void;
  setActiveView: (view: 'dashboard' | 'calendar' | 'profile') => void;
  updateStreak: () => void;
  getFilteredTasks: () => Task[];
  setTasks: (tasks: Task[]) => void;
}

const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      tasks: [],
      searchQuery: '',
      selectedFilter: 'all',
      streakData: {
        current: 0,
        longest: 0,
        lastActiveDate: new Date(),
        weeklyProgress: [false, false, false, false, false, false, false]
      },
      activeView: 'dashboard',
      
      // Actions
      setUser: async (user) => {
        set({ user, isAuthenticated: !!user });
        if (user && user.email) {
          // Fetch streak data from backend
          try {
            const res = await fetch(`http://localhost:5000/api/user/${user.email}/streak`);
            if (res.ok) {
              const data = await res.json();
              set({
                streakData: {
                  current: data.currentStreak,
                  longest: data.longestStreak,
                  lastActiveDate: new Date(data.lastActiveDate),
                  weeklyProgress: data.weeklyProgress || [false, false, false, false, false, false, false]
                }
              });
            }
          } catch (e) {
            // ignore
          }
        }
      },
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      moveTask: (id, newStatus) => {
        const state = get();
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let completedToday = state.tasks.some(
          (task) => task.status === 'completed' && task.completedAt && new Date(task.completedAt) >= todayStart
        );

        // If this is the first completed task today, update streak
        if (newStatus === 'completed' && !completedToday) {
          get().updateStreak();
        }

        const updates: Partial<Task> = { status: newStatus };
        if (newStatus === 'completed') {
          updates.completedAt = new Date();
        }
        get().updateTask(id, updates);
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedFilter: (filter) => set({ selectedFilter: filter }),
      setActiveView: (view) => set({ activeView: view }),
      
      updateStreak: async () => {
        const today = new Date();
        const state = get();
        const lastActive = new Date(state.streakData.lastActiveDate);
        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreak = state.streakData.current;
        
        console.log('[updateStreak] Called. Current:', state.streakData, 'Today:', today, 'Days diff:', daysDiff);

        if (daysDiff === 0) {
          // Same day, don't update
          console.log('[updateStreak] Same day, not updating streak.');
          return;
        } else if (daysDiff === 1) {
          // Next day, increment streak
          newStreak += 1;
        } else {
          // Missed days, reset streak
          newStreak = 1;
        }
        
        const newWeeklyProgress = [...state.streakData.weeklyProgress];
        const todayIndex = today.getDay();
        newWeeklyProgress[todayIndex] = true;
        
        const newStreakData = {
          current: newStreak,
          longest: Math.max(newStreak, state.streakData.longest),
          lastActiveDate: today,
          weeklyProgress: newWeeklyProgress
        };
        console.log('[updateStreak] New streak data:', newStreakData);
        set({
          streakData: newStreakData
        });

        // Sync to backend if user is logged in
        if (state.user && state.user.email) {
          try {
            const res = await fetch(`http://localhost:5000/api/user/${state.user.email}/streak`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                currentStreak: newStreakData.current,
                longestStreak: newStreakData.longest,
                lastActiveDate: newStreakData.lastActiveDate,
                weeklyProgress: newStreakData.weeklyProgress
              })
            });
            const backendRes = await res.json();
            console.log('[updateStreak] Backend response:', backendRes);
          } catch (e) {
            console.log('[updateStreak] Backend error:', e);
          }
        }
      },
      
      getFilteredTasks: () => {
        const { tasks, searchQuery, selectedFilter } = get();
        let filtered = tasks;
        
        // Apply search filter
        if (searchQuery) {
          filtered = filtered.filter((task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        // Apply date filter
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        switch (selectedFilter) {
          case 'today':
            filtered = filtered.filter((task) => {
              if (!task.dueDate) return false;
              const taskDate = new Date(task.dueDate);
              return taskDate >= today && taskDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
            });
            break;
          case 'week':
            filtered = filtered.filter((task) => {
              if (!task.dueDate) return false;
              const taskDate = new Date(task.dueDate);
              return taskDate >= weekStart;
            });
            break;
          case 'month':
            filtered = filtered.filter((task) => {
              if (!task.dueDate) return false;
              const taskDate = new Date(task.dueDate);
              return taskDate >= monthStart;
            });
            break;
        }
        
        return filtered;
      },
      
      setTasks: (tasks: Task[]) => set({ tasks }),
    }),
    {
      name: 'motivatr-storage',
    }
  )
);

export default useStore;