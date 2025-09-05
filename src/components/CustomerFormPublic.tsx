// Populating placeholder file with a public customer form component.
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button, Input, Select, Card } from './ui';
import type { Customer, Rental } from '../types';

const CustomerFormPublic: React.FC = () => {
    const { vehicles, setRentals, setCustomers, addToast } = useData();
    const [customer, setCustomer] = useState<Omit<Customer, 'id'>>({
        first_name: '', last_name: '', email: '', phone: '', id_card_number: '', drivers_license_number: ''
    });
    const [rentalInfo, setRentalInfo] = useState({
        vehicleId: '', startDate: '', endDate: ''
    });
    const [submitted, setSubmitted] = useState(false);
    
    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleRentalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setRentalInfo({ ...rentalInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newCustomer: Customer = { id: `c${Date.now()}`, ...customer };
        setCustomers(prev => [...prev, newCustomer]);

        const vehicle = vehicles.find(v => v.id === rentalInfo.vehicleId);
        if (!vehicle) {
            addToast('Vybrané vozidlo neexistuje.', 'error');
            return;
        }

        const newRental: Rental = {
            id: `r${Date.now()}`,
            customerId: newCustomer.id,
            vehicleId: rentalInfo.vehicleId,
            startDate: rentalInfo.startDate,
            endDate: rentalInfo.endDate,
            totalPrice: 0, // Price to be confirmed by admin
            status: 'pending',
        };

        setRentals(prev => [...prev, newRental]);
        addToast("Váše poptávka byla odeslána. Budeme vás kontaktovat.", "success");
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-4">Děkujeme!</h1>
                    <p className="text-text-secondary">Vaše poptávka byla úspěšně odeslána. Brzy se vám ozveme s potvrzením.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background py-12">
            <Card className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Poptávka pronájmu</h1>
                        <p className="text-text-secondary mt-2">Vyplňte formulář a my se vám co nejdříve ozveme.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Údaje o zákazníkovi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Jméno" name="first_name" value={customer.first_name} onChange={handleCustomerChange} required />
                            <Input label="Příjmení" name="last_name" value={customer.last_name} onChange={handleCustomerChange} required />
                            <Input label="Email" name="email" type="email" value={customer.email} onChange={handleCustomerChange} required />
                            <Input label="Telefon" name="phone" type="tel" value={customer.phone} onChange={handleCustomerChange} required />
                            <Input label="Číslo OP" name="id_card_number" value={customer.id_card_number} onChange={handleCustomerChange} required />
                            <Input label="Číslo ŘP" name="drivers_license_number" value={customer.drivers_license_number} onChange={handleCustomerChange} required />
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Údaje o pronájmu</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <Select label="Vozidlo" name="vehicleId" value={rentalInfo.vehicleId} onChange={handleRentalChange} required>
                                <option value="">-- Vyberte vozidlo --</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} - {v.license_plate}</option>)}
                            </Select>
                            <Input label="Předpokládaný začátek" name="startDate" type="datetime-local" value={rentalInfo.startDate} onChange={handleRentalChange} required />
                            <Input label="Předpokládaný konec" name="endDate" type="datetime-local" value={rentalInfo.endDate} onChange={handleRentalChange} required />
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-6 border-t border-gray-700">
                        <Button type="submit">Odeslat poptávku</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CustomerFormPublic;
