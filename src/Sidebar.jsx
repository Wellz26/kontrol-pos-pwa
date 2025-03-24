import { FaCashRegister, FaBoxOpen, FaChartBar } from 'react-icons/fa';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { name: 'POS', icon: <FaCashRegister /> },
    { name: 'Inventory', icon: <FaBoxOpen /> },
    { name: 'Reports', icon: <FaChartBar /> },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-2xl flex flex-col justify-between h-screen">
      <div>
        <div className="text-3xl font-bold text-primary p-6 tracking-tight">
          Kontrol POS
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.name
                  ? 'bg-primary text-white shadow-lg'
                  : 'hover:bg-primary/10 text-secondary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
