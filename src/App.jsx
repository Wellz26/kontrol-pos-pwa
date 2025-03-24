import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import POSScreen from './pages/POSScreen';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import { syncSales } from './db'; // Make sure the path is correct

export default function App() {
  const [activePage, setActivePage] = useState('POS');

  // Page renderer
  const renderPage = () => {
    switch (activePage) {
      case 'POS':
        return <POSScreen />;
      case 'Inventory':
        return <Inventory />;
      case 'Reports':
        return <Reports />;
      default:
        return <POSScreen />;
    }
  };

  // ✅ Auto-Sync Sales When Back Online
  useEffect(() => {
    const handleOnline = () => {
      console.log('✅ Back online! Syncing sales to server...');
      syncSales(); // Function from db.js to push sales to backend
    };

    window.addEventListener('online', handleOnline);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <div className="flex min-h-screen font-sans bg-background">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
