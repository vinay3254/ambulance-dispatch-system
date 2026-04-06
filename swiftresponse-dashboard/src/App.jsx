import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import MapView from './pages/MapView';
import MobileTracking from './pages/MobileTracking';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';

function ToastContainer() {
  const { toasts, removeToast } = useAppContext();
  
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          severity={toast.severity}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navbar />
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <main className="flex-1 overflow-auto" style={{ marginLeft: '320px' }}>
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/tracking" element={<MobileTracking />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-insights" element={<AIInsights />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
