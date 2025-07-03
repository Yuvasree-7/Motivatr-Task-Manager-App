import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ProfileView from './components/ProfileView';
import AuthModal from './components/AuthModal';
import useStore from './store/useStore';
import KanbanBoard from './components/KanbanBoard';
import { fetchTasks } from './api/tasks';

function App() {
  const { isAuthenticated, activeView, setActiveView } = useStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const setStoreTasks = useStore(state => state.setTasks);
  const user = useStore(state => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
    const handleOpenAuthModal = () => setShowAuthModal(true);
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user || !user.email) return;
    fetchTasks(user.email).then(setStoreTasks);
  }, [setStoreTasks, user]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'calendar':
        return <CalendarView />;
      case 'profile':
        return <ProfileView />;
      case 'kanban':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-pink-700 font-poppins drop-shadow-lg">Task Board</h1>
              <button
                onClick={() => setActiveView('dashboard')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all"
              >
                ← Back to Dashboard
              </button>
            </div>
            <KanbanBoard />
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout onShowKanban={() => setActiveView('kanban')}>
        {renderActiveView()}
      </Layout>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#374151',
          },
        }}
      />
    </>
  );
}

export default App;