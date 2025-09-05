import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button, Card } from './ui';
import { PlusIcon, EyeIcon } from './Icons';
import NewRentalForm from './NewRentalForm';
import ContractView from './ContractView';
import type { Rental } from '../types';

const Rentals: React.FC = () => {
    const { rentals, vehicles, customers } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

    const getVehicleBrand = (id: string) => vehicles.find(v => v.id === id)?.brand || 'Neznámé';
    const getCustomerName = (id: string) => {
        const c = customers.find(cust => cust.id === id);
        return c ? `${c.first_name} ${c.last_name}` : 'Neznámý';
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Půjčovné</h1>
                <Button onClick={() => setIsFormOpen(true)}><PlusIcon className="w-5 h-5 mr-2" /> Vytvořit smlouvu</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3">Vozidlo</th>
                                <th className="p-3">Zákazník</th>
                                <th className="p-3">Od</th>
                                <th className="p-3">Do</th>
                                <th className="p-3">Cena</th>
                                <th className="p-3">Stav</th>
                                <th className="p-3">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map(rental => (
                                <tr key={rental.id} className="border-b border-gray-700 hover:bg-gray-800">
                                    <td className="p-3">{getVehicleBrand(rental.vehicleId)}</td>
                                    <td className="p-3">{getCustomerName(rental.customerId)}</td>
                                    <td className="p-3">{new Date(rental.startDate).toLocaleString('cs-CZ')}</td>
                                    <td className="p-3">{new Date(rental.endDate).toLocaleString('cs-CZ')}</td>
                                    <td className="p-3">{rental.totalPrice.toLocaleString('cs-CZ')} Kč</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            rental.status === 'active' ? 'bg-green-500/20 text-green-300' : 
                                            rental.status === 'completed' ? 'bg-gray-500/20 text-gray-300' : 'bg-yellow-500/20 text-yellow-300'
                                        }`}>
                                            {rental.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <Button variant="secondary" size="sm" onClick={() => setSelectedRental(rental)}>
                                            <EyeIcon className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isFormOpen && <NewRentalForm onClose={() => setIsFormOpen(false)} />}
            
            {selectedRental && <ContractView rental={selectedRental} onClose={() => setSelectedRental(null)} />}
        </div>
    );
};

export default Rentals;
