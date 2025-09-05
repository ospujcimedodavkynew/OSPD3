import { useData } from '../context/DataContext';
import { Card } from './ui';
import { Car, FileText, DollarSign, Calendar, LinkIcon, ClipboardIcon, CheckIcon } from './Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import RequestApprovalModal from './RequestApprovalModal';
import type { RentalRequest } from '../types';

const Dashboard = () => {
    const { vehicles, rentals, rentalRequests, addToast } = useData();
    const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);
    const [copied, setCopied] = useState(false);

    const activeRentals = rentals.filter(r => new Date(r.endDate) > new Date()).length;
    
    const financialData = vehicles.map(vehicle => {
        const vehicleRentals = rentals.filter(r => r.vehicleId === vehicle.id);
        const totalRevenue = vehicleRentals.reduce((sum, r) => sum + r.totalPrice, 0);
        const totalCost = vehicle.serviceHistory.reduce((sum, s) => sum + s.cost, 0);
        const netProfit = totalRevenue - totalCost;
        return {
            name: vehicle.brand,
            Příjmy: totalRevenue,
            Náklady: totalCost,
            'Čistý zisk': netProfit,
        };
    });

    const pendingRequests = rentalRequests.filter(r => r.status === 'pending');

    const handleCopyLink = () => {
        const publicUrl = `${window.location.origin}${window.location.pathname}#/request`;
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        addToast("Odkaz pro zákazníky byl zkopírován!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center">
                        <Car className="w-8 h-8 text-primary" />
                        <div className="ml-4">
                            <p className="text-sm text-text-secondary">Celkem vozidel</p>
                            <p className="text-2xl font-bold">{vehicles.length}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <FileText className="w-8 h-8 text-secondary" />
                        <div className="ml-4">
                            <p className="text-sm text-text-secondary">Aktivní pronájmy</p>
                            <p className="text-2xl font-bold">{activeRentals}</p>
                        </div>
                    </div>
                </Card>
                 <Card className="col-span-1 md:col-span-2">
                    <div className="flex items-center">
                        <LinkIcon className="w-8 h-8 text-accent" />
                        <div className="ml-4 flex-grow">
                             <p className="text-sm text-text-secondary">Samoobslužný portál pro zákazníky</p>
                             <p className="text-xs text-gray-400">Pošlete tento odkaz zákazníkům pro vytvoření poptávky.</p>
                        </div>
                        <button onClick={handleCopyLink} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                           {copied ? <CheckIcon className="w-5 h-5 mr-2" /> : <ClipboardIcon className="w-5 h-5 mr-2" />}
                           {copied ? 'Zkopírováno!' : 'Kopírovat odkaz'}
                        </button>
                    </div>
                </Card>
            </div>

            {pendingRequests.length > 0 && (
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Nové žádosti ke schválení ({pendingRequests.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="p-3">Zákazník</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Datum žádosti</th>
                                    <th className="p-3 text-right">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map(req => (
                                    <tr key={req.id} className="border-b border-gray-800 hover:bg-gray-800">
                                        <td className="p-3">{req.customer_details.first_name} {req.customer_details.last_name}</td>
                                        <td className="p-3">{req.customer_details.email}</td>
                                        <td className="p-3">{new Date(req.digital_consent_at).toLocaleDateString('cs-CZ')}</td>
                                        <td className="p-3 text-right">
                                            <button 
                                                onClick={() => setSelectedRequest(req)}
                                                className="bg-accent hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition-colors"
                                            >
                                                Zkontrolovat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Card>
                <h2 className="text-xl font-semibold mb-4">Finanční Výkonnost Vozidel</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart data={financialData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                            <Legend />
                            <Bar dataKey="Příjmy" fill="#3B82F6" />
                            <Bar dataKey="Náklady" fill="#EF4444" />
                            <Bar dataKey="Čistý zisk" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {selectedRequest && <RequestApprovalModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
        </div>
    );
};

export default Dashboard;
