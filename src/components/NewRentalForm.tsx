import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Modal, Button, Input, Select } from './ui';
import type { Customer, Vehicle } from '../types';

const NewRentalForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { vehicles, customers, addRental, addCustomer, addToast } = useData();
    
    const [step, setStep] = useState(1);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
        first_name: '', last_name: '', email: '', phone: '',
        id_card_number: '', drivers_license_number: ''
    });
    const [rentalDates, setRentalDates] = useState({ startDate: '', endDate: '' });
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (selectedVehicle && rentalDates.startDate && rentalDates.endDate) {
            const start = new Date(rentalDates.startDate);
            const end = new Date(rentalDates.endDate);
            if (start < end) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setTotalPrice(diffDays * selectedVehicle.pricing.perDay);
            } else {
                setTotalPrice(0);
            }
        }
    }, [selectedVehicle, rentalDates]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRentalDates({ ...rentalDates, [e.target.name]: e.target.value });
    };

    const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    const handleCreateRental = () => {
        let customerId = selectedCustomerId;
        if (customerType === 'new') {
            const addedCustomer = addCustomer(newCustomer);
            customerId = addedCustomer.id;
        }

        if (!selectedVehicle || !customerId || !rentalDates.startDate || !rentalDates.endDate || totalPrice <= 0) {
            addToast('Prosím vyplňte všechna pole správně.', 'error');
            return;
        }

        addRental({
            vehicleId: selectedVehicle.id,
            customerId: customerId,
            startDate: rentalDates.startDate,
            endDate: rentalDates.endDate,
            totalPrice: totalPrice,
            status: 'active'
        });
        
        addToast('Nová smlouva byla úspěšně vytvořena.', 'success');
        onClose();
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Select Vehicle
                return (
                    <div>
                        <h3 className="font-semibold mb-4">1. Vyberte vozidlo</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {vehicles.map(v => (
                                <button key={v.id} onClick={() => { setSelectedVehicle(v); setStep(2); }}
                                    className={`p-4 border rounded-lg text-left ${selectedVehicle?.id === v.id ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-primary'}`}>
                                    <p className="font-bold">{v.brand}</p>
                                    <p className="text-sm text-text-secondary">{v.license_plate}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2: // Select Customer
                return (
                    <div>
                        <h3 className="font-semibold mb-4">2. Zadejte zákazníka</h3>
                        <div className="flex gap-4 mb-4">
                            <Button variant={customerType === 'existing' ? 'primary' : 'secondary'} onClick={() => setCustomerType('existing')}>Stávající zákazník</Button>
                            <Button variant={customerType === 'new' ? 'primary' : 'secondary'} onClick={() => setCustomerType('new')}>Nový zákazník</Button>
                        </div>
                        {customerType === 'existing' ? (
                            <Select label="Vyberte zákazníka" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}>
                                <option value="">-- Vyberte --</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                            </Select>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Jméno" name="first_name" value={newCustomer.first_name} onChange={handleNewCustomerChange} />
                                <Input label="Příjmení" name="last_name" value={newCustomer.last_name} onChange={handleNewCustomerChange} />
                                <Input label="Email" name="email" type="email" value={newCustomer.email} onChange={handleNewCustomerChange} />
                                <Input label="Telefon" name="phone" type="tel" value={newCustomer.phone} onChange={handleNewCustomerChange} />
                                <Input label="Číslo OP" name="id_card_number" value={newCustomer.id_card_number} onChange={handleNewCustomerChange} />
                                <Input label="Číslo ŘP" name="drivers_license_number" value={newCustomer.drivers_license_number} onChange={handleNewCustomerChange} />
                            </div>
                        )}
                        <div className="flex justify-end mt-6">
                             <Button onClick={() => setStep(3)} disabled={customerType === 'existing' && !selectedCustomerId}>Pokračovat</Button>
                        </div>
                    </div>
                );
            case 3: // Dates and Confirmation
                return (
                    <div>
                         <h3 className="font-semibold mb-4">3. Termín a potvrzení</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <Input label="Začátek pronájmu" name="startDate" type="datetime-local" value={rentalDates.startDate} onChange={handleDateChange} />
                            <Input label="Konec pronájmu" name="endDate" type="datetime-local" value={rentalDates.endDate} onChange={handleDateChange} />
                         </div>
                         <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                            <h4 className="font-bold">Rekapitulace</h4>
                            <p><strong>Vozidlo:</strong> {selectedVehicle?.brand}</p>
                            <p><strong>Cena:</strong> {totalPrice.toLocaleString('cs-CZ')} Kč</p>
                         </div>
                    </div>
                );
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title="Vytvořit novou smlouvu">
            <div>
                {renderStep()}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                    <div>
                        {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Zpět</Button>}
                    </div>
                    <div>
                        {step === 3 && <Button onClick={handleCreateRental}>Vytvořit smlouvu</Button>}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default NewRentalForm;
