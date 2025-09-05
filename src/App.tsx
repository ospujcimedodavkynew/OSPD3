import React from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useData } from './context/DataContext';
import Dashboard from './components/Dashboard';
import Fleet from './components/Fleet';
import Rentals from './components/Rentals';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerFormPublic from './components/CustomerFormPublic';
import { Car, FileText, LayoutDashboard, Calendar, Settings as SettingsIcon, LogOutIcon, LinkIcon } from './components/Icons';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <NavLink
            to={to}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'
            }`}
        >
            <span className="mr-3">{icon}</span>
            {children}
        </NavLink>
    );
};

const Sidebar: React.FC = () => {
    const { logout, addToast } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const copyPublicFormLink = () => {
        const url = `${window.location.origin}${window.location.pathname}#/public-form`;
        navigator.clipboard.writeText(url);
        addToast("Odkaz na veřejný formulář byl zkopírován.", "info");
    };

    return (
        <aside className="w-64 bg-surface flex flex-col p-4 border-r border-gray-700">
            <div className="flex items-center mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Rental<span className="text-accent">Manager</span></h1>
            </div>
            <nav className="flex-1 space-y-2">
                <NavItem to="/" icon={<LayoutDashboard className="w-5 h-5" />}>Přehled</NavItem>
                <NavItem to="/fleet" icon={<Car className="w-5 h-5" />}>Vozový park</NavItem>
                <NavItem to="/rentals" icon={<FileText className="w-5 h-5" />}>Pronájmy</NavItem>
                <NavItem to="/calendar" icon={<Calendar className="w-5 h-5" />}>Kalendář</NavItem>
                <NavItem to="/settings" icon={<SettingsIcon className="w-5 h-5" />}>Nastavení</NavItem>
            </nav>
            <div className="mt-auto space-y-2">
                 <button onClick={copyPublicFormLink} className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary">
                    <LinkIcon className="w-5 h-5 mr-3" />
                    Veřejný formulář
                </button>
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary">
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    Odhlásit se
                </button>
            </div>
        </aside>
    );
};

const App: React.FC = () => {
    const { isAuthenticated } = useData();
    const location = useLocation();

    // Do not show sidebar on login or public form pages
    const showSidebar = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/public-form';
    
    return (
        <div className="flex h-screen bg-background text-text-primary">
            {showSidebar && <Sidebar />}
            <main className="flex-1 overflow-y-auto p-8">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/public-form" element={<CustomerFormPublic />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/fleet" element={<ProtectedRoute><Fleet /></ProtectedRoute>} />
                    <Route path="/rentals" element={<ProtectedRoute><Rentals /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
