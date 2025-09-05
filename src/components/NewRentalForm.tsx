import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Modal, Button, Input, Select } from './ui';
import type { Customer } from '../types';

const NewRentalForm = ({ onClose }: { onClose: () => void }) => {
    const { vehicles, customers, rentals, addRental, addCustomer, addToast } = useData();
    const [step, setStep] = useState(1);
    const [existingCustomerId, setExistingCustomerId] = useState<string>('');
    const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'drivers_license_image_path'>>({
        first_name: '', last_name: '', email: '', phone: '',
        id_card_number: '', drivers_license_number: ''
    });
    const [rentalData, setRentalData] = useState({
        vehicleId: '', startDate: '', endDate: '', totalPrice: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const unavailableVehicleIds = useMemo(() => {
        const { startDate, endDate } = rentalData;
        if (!startDate || !endDate) return new Set();
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) return new Set(vehicles.map(v => v.id));

        const unavailable = rentals.filter(rental => {
            const rentalStart = new Date(rental.startDate);
            const rentalEnd = new Date(rental.endDate);
            return start < rentalEnd && end > rentalStart;
        }).map(rental => rental.vehicleId);
        
        return new Set(unavailable);
    }, [rentalData.startDate, rentalData.endDate, rentals, vehicles]);

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    const handleRentalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setRentalData({ ...rentalData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        let customerId: string;
        if (existingCustomerId) {
            customerId = existingCustomerId;
        } else {
            const createdCustomer = addCustomer(newCustomer);
            customerId = createdCustomer.id;
        }

        addRental({
            ...rentalData,
            totalPrice: Number(rentalData.totalPrice),
            customerId,
            status: 'active'
        });
        
        addToast('Nový pronájem byl úspěšně vytvořen.', 'success');
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Vytvořit novou rezervaci">
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Customer Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Krok 1: Zákazník</h3>
                        <div className="space-y-4">
                            <Select label="Vybrat existujícího zákazníka" value={existingCustomerId} onChange={(e) => {
                                setExistingCustomerId(e.target.value);
                                setStep(e.target.value ? 2 : 1.5);
                            }}>
                                <option value="">-- Nový zákazník --</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                            </Select>

                            {!existingCustomerId && (
                                <div className="p-4 border border-gray-700 rounded-lg space-y-4">
                                     <h4 className="font-semibold text-text-secondary">Údaje nového zákazníka</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input label="Jméno" name="first_name" value={newCustomer.first_name} onChange={handleCustomerChange} required />
                                        <Input label="Příjmení" name="last_name" value={newCustomer.last_name} onChange={handleCustomerChange} required />
                                        <Input label="Email" name="email" type="email" value={newCustomer.email} onChange={handleCustomerChange} required />
                                        <Input label="Telefon" name="phone" type="tel" value={newCustomer.phone} onChange={handleCustomerChange} required />
                                        <Input label="Číslo OP" name="id_card_number" value={newCustomer.id_card_number} onChange={handleCustomerChange} required />
                                        <Input label="Číslo ŘP" name="drivers_license_number" value={newCustomer.drivers_license_number} onChange={handleCustomerChange} required />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rental Details */}
                    <div className="pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Krok 2: Detaily pronájmu</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <Select label="Vozidlo" name="vehicleId" value={rentalData.vehicleId} onChange={handleRentalChange} required>
                                <option value="">-- Vyberte vozidlo --</option>
                                {vehicles.map(v => {
                                    const isUnavailable = unavailableVehicleIds.has(v.id);
                                    return <option key={v.id} value={v.id} disabled={isUnavailable}>
                                        {v.brand} {isUnavailable ? '(Obsazeno)' : ''}
                                    </option>
                                })}
                            </Select>
                            <Input label="Začátek" name="startDate" type="datetime-local" value={rentalData.startDate} onChange={handleRentalChange} required />
                            <Input label="Konec" name="endDate" type="datetime-local" value={rentalData.endDate} onChange={handleRentalChange} required />
                            <Input label="Celková cena (Kč)" name="totalPrice" type="number" value={rentalData.totalPrice} onChange={handleRentalChange} required />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Zrušit</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Vytvářím...' : 'Vytvořit rezervaci'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default NewRentalForm;
