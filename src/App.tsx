import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useData } from './context/DataContext';
import { LayoutDashboard, Car, FileText, Calendar, Settings as SettingsIcon, LogOutIcon } from './components/Icons';
import Dashboard from './components/Dashboard';
import Fleet from './components/Fleet';
import Rentals from './components/Rentals';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerFormPublic from './components/CustomerFormPublic';

const App = () => {
    const { isAuthenticated, logout } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/request" element={<CustomerFormPublic />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <div className="flex h-screen bg-background text-text-primary">
                                <Sidebar onLogout={handleLogout} />
                                <MainContent />
                            </div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
            {/* FIX: Removed ToastContainer as it's already rendered in DataProvider to fix missing props error. */}
        </>
    );
};

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
    const navItems = [
        { href: '/', icon: LayoutDashboard, label: 'Nástěnka' },
        { href: '/fleet', icon: Car, label: 'Vozový park' },
        { href: '/rentals', icon: FileText, label: 'Pronájmy' },
        { href: '/calendar', icon: Calendar, label: 'Kalendář' },
        { href: '/settings', icon: SettingsIcon, label: 'Nastavení' },
    ];

    return (
        <aside className="w-64 bg-surface flex-shrink-0 flex flex-col">
            <div className="h-16 flex items-center justify-center text-2xl font-bold">
                Rental<span className="text-accent">Manager</span>
            </div>
            <nav className="flex-grow px-4">
                {navItems.map(item => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                                isActive
                                    ? 'bg-primary text-white'
                                    : 'text-text-secondary hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4">
                <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-3 my-1 rounded-lg text-text-secondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    Odhlásit se
                </button>
            </div>
        </aside>
    );
};

const MainContent = () => {
    const location = useLocation();
    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Nástěnka';
            case '/fleet': return 'Vozový park';
            case '/rentals': return 'Přehled pronájmů';
            case '/calendar': return 'Kalendář obsazenosti';
            case '/settings': return 'Nastavení';
            default: return 'Správce Půjčovny';
        }
    };

    return (
        <main className="flex-1 overflow-y-auto">
            <header className="sticky top-0 bg-surface/80 backdrop-blur-sm h-16 flex items-center px-8 border-b border-gray-700">
                <h1 className="text-xl font-semibold">{getTitle()}</h1>
            </header>
            <div className="p-8">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/fleet" element={<Fleet />} />
                    <Route path="/rentals" element={<Rentals />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </main>
    );
};

export default App;