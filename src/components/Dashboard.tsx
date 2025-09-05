import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';
import type { RentalRequest } from '../types';
import RequestApprovalModal from './RequestApprovalModal';
import { EyeIcon } from './Icons';

const Dashboard: React.FC = () => {
    const { vehicles, rentals, rentalRequests } = useData();
    const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);

    const activeRentals = rentals.filter(r => r.status === 'active');
    const pendingRequests = rentalRequests.filter(r => r.status === 'pending');
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Přehled</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h3 className="text-text-secondary">Celkem vozidel</h3>
                    <p className="text-3xl font-bold">{vehicles.length}</p>
                </Card>
                <Card>
                    <h3 className="text-text-secondary">Aktivní výpůjčky</h3>
                    <p className="text-3xl font-bold">{activeRentals.length}</p>
                </Card>
                <Card>
                    <h3 className="text-text-secondary">Čekající žádosti</h3>
                    <p className="text-3xl font-bold text-accent">{pendingRequests.length}</p>
                </Card>
                 <Card>
                    <h3 className="text-text-secondary">Celkem výpůjček</h3>
                    <p className="text-3xl font-bold">{rentals.length}</p>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-bold mb-4">Nové žádosti o pronájem</h2>
                {pendingRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="p-3">Zákazník</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Datum</th>
                                    <th className="p-3">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map(request => (
                                    <tr key={request.id} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="p-3">{request.customer_details.first_name} {request.customer_details.last_name}</td>
                                        <td className="p-3">{request.customer_details.email}</td>
                                        <td className="p-3">{new Date(request.digital_consent_at).toLocaleDateString('cs-CZ')}</td>
                                        <td className="p-3">
                                            <button onClick={() => setSelectedRequest(request)} className="text-primary hover:text-primary-focus p-1 rounded-full">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-text-secondary">Nejsou zde žádné nové žádosti.</p>
                )}
            </Card>

            {selectedRequest && (
                <RequestApprovalModal 
                    request={selectedRequest} 
                    onClose={() => setSelectedRequest(null)} 
                />
            )}
        </div>
    );
};

export default Dashboard;
