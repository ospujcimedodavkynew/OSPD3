import React, { useState, useMemo } from 'react';
import type { RentalRequest, Vehicle } from '../types';
import { Modal, Button, Input, Select } from './ui';
import { useData } from '../context/DataContext';

interface RequestApprovalModalProps {
  request: RentalRequest;
  onClose: () => void;
}

const getFormattedCurrentDateTime = () => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - timezoneOffset)).toISOString().slice(0, 16);
    return localISOTime;
};

const RequestApprovalModal: React.FC<RequestApprovalModalProps> = ({ request, onClose }) => {
    const { vehicles, rentals, approveRentalRequest, addToast } = useData();
    const [vehicleId, setVehicleId] = useState('');
    const [startDate, setStartDate] = useState(getFormattedCurrentDateTime());
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const customer = request.customer_details;

    const unavailableVehicleIds = useMemo(() => {
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
    }, [startDate, endDate, rentals, vehicles]);

    const handleApprove = async () => {
        if (!vehicleId || !startDate || !endDate || totalPrice <= 0) {
            addToast('Vyplňte prosím všechny údaje o pronájmu.', 'error');
            return;
        }
        setIsSubmitting(true);
        await approveRentalRequest(request.id, vehicleId, startDate, endDate, totalPrice);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Schválení žádosti o pronájem">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Údaje od zákazníka</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p><strong>Jméno:</strong> {customer.first_name} {customer.last_name}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Telefon:</strong> {customer.phone}</p>
                        <p><strong>Číslo OP:</strong> {customer.id_card_number}</p>
                        <p><strong>Číslo ŘP:</strong> {customer.drivers_license_number}</p>
                    </div>
                    {request.drivers_license_image_base64 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-text-secondary">Řidičský průkaz:</h4>
                            <img src={request.drivers_license_image_base64} alt="Řidičský průkaz" className="mt-2 rounded-lg border-2 border-gray-600 max-w-sm w-full" />
                        </div>
                    )}
                     <p className="text-xs text-green-400 mt-4 italic">Zákazník digitálně souhlasil s podmínkami dne: {new Date(request.digital_consent_at).toLocaleString('cs-CZ')}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Doplnění údajů o pronájmu</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <Select label="Přidělit vozidlo" value={vehicleId} onChange={e => setVehicleId(e.target.value)} required>
                            <option value="">-- Vyberte vozidlo --</option>
                            {vehicles.map(v => {
                                const isUnavailable = unavailableVehicleIds.has(v.id);
                                return <option key={v.id} value={v.id} disabled={isUnavailable}>
                                    {v.brand} {isUnavailable ? '(Obsazeno)' : ''}
                                </option>
                            })}
                        </Select>
                        <Input label="Začátek pronájmu" type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        <Input label="Konec pronájmu" type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                        <Input label="Celková cena (Kč)" type="number" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} required />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
                <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Zrušit</Button>
                <Button onClick={handleApprove} disabled={isSubmitting}>
                    {isSubmitting ? 'Schvaluji...' : 'Schválit a vytvořit smlouvu'}
                </Button>
            </div>
        </Modal>
    );
};

export default RequestApprovalModal;
