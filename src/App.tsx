import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from './context/DataContext';
import { Car, FileText, LayoutDashboard, Calendar, Settings, LogOutIcon } from './components/Icons';

import Dashboard from './components/Dashboard';
import Fleet from './components/Fleet';
import Rentals from './components/Rentals';
import CalendarView from './components/CalendarView';
import SettingsComponent from './components/Settings';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerFormPublic from './components/CustomerFormPublic';

const NavLink: React.FC<{ to: string; children: React.ReactNode; icon: React.ReactNode }> = ({ to, children, icon }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'
            }`}
        >
            <span className="mr-3">{icon}</span>
            {children}
        </Link>
    );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return (
        <div className="flex h-screen bg-background text-text-primary">
            <aside className="w-64 bg-surface p-4 flex flex-col justify-between border-r border-gray-700">
                <div>
                    <div className="px-4 mb-8">
                         <h1 className="text-2xl font-bold">Rental<span className="text-accent">Manager</span></h1>
                    </div>
                    <nav className="space-y-2">
                        <NavLink to="/" icon={<LayoutDashboard className="w-5 h-5" />}>Přehled</NavLink>
                        <NavLink to="/fleet" icon={<Car className="w-5 h-5" />}>Vozový park</NavLink>
                        <NavLink to="/rentals" icon={<FileText className="w-5 h-5" />}>Půjčovné</NavLink>
                        <NavLink to="/calendar" icon={<Calendar className="w-5 h-5" />}>Kalendář</NavLink>
                        <NavLink to="/settings" icon={<Settings className="w-5 h-5" />}>Nastavení</NavLink>
                    </nav>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary rounded-lg transition-colors"
                >
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    Odhlásit se
                </button>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/public-request" element={<CustomerFormPublic />} />
            <Route path="/*" element={
                <ProtectedRoute>
                    <AppLayout>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/fleet" element={<Fleet />} />
                            <Route path="/rentals" element={<Rentals />} />
                            <Route path="/calendar" element={<CalendarView />} />
                            <Route path="/settings" element={<SettingsComponent />} />
                        </Routes>
                    </AppLayout>
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default App;
