import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button, Card, Input } from './ui';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const { login } = useData();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-2xl font-bold">Rental<span className="text-accent">Manager</span></h1>
                        <p className="text-text-secondary">Zadejte heslo pro přístup</p>
                    </div>
                    <div className="space-y-4">
                        <Input 
                            label="Heslo" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            required 
                        />
                    </div>
                    <Button type="submit" className="w-full mt-6">
                        Vstoupit
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
