import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button } from './ui';
import type { Rental } from '../types';
import { EyeIcon, PlusIcon, Trash2Icon } from './Icons';
import NewRentalForm from './NewRentalForm';
import ContractView from './ContractView';

const Rentals = () => {
    const { rentals, vehicles, customers, deleteRental } = useData();
    const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState(false);
    const [viewingContract, setViewingContract] = useState<Rental | null>(null);

    const getVehicleById = (id: string) => vehicles.find(v => v.id === id);
    const getCustomerById = (id: string) => customers.find(c => c.id === id);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Přehled všech pronájmů</h1>
                <Button onClick={() => setIsNewRentalModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Vytvořit rezervaci
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="p-4">Vozidlo</th>
                                <th className="p-4">Zákazník</th>
                                <th className="p-4">Od</th>
                                <th className="p-4">Do</th>
                                <th className="p-4">Cena</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map(rental => {
                                const vehicle = getVehicleById(rental.vehicleId);
                                const customer = getCustomerById(rental.customerId);
                                return (
                                    <tr key={rental.id} className="border-b border-gray-800 hover:bg-gray-800">
                                        <td className="p-4">{vehicle?.brand || 'N/A'}</td>
                                        <td className="p-4">{customer ? `${customer.first_name} ${customer.last_name}` : 'N/A'}</td>
                                        <td className="p-4">{new Date(rental.startDate).toLocaleString('cs-CZ')}</td>
                                        <td className="p-4">{new Date(rental.endDate).toLocaleString('cs-CZ')}</td>
                                        <td className="p-4">{rental.totalPrice.toLocaleString('cs-CZ')} Kč</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                rental.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                rental.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {rental.status === 'completed' ? 'Dokončeno' : rental.status === 'active' ? 'Aktivní' : 'Čekající'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-end gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => setViewingContract(rental)}>
                                                <EyeIcon className="w-4 h-4 mr-1" />
                                                Detail
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => deleteRental(rental.id)}>
                                                <Trash2Icon className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isNewRentalModalOpen && <NewRentalForm onClose={() => setIsNewRentalModalOpen(false)} />}
            {viewingContract && <ContractView rental={viewingContract} onClose={() => setViewingContract(null)} />}
        </div>
    );
};

export default Rentals;
