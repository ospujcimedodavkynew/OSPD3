import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Modal, Button, Input, Select, Card } from './ui';
import type { RentalRequest } from '../types';

interface RequestApprovalModalProps {
    request: RentalRequest;
    onClose: () => void;
}

const RequestApprovalModal: React.FC<RequestApprovalModalProps> = ({ request, onClose }) => {
    const { vehicles, approveRentalRequest, getLicenseImageUrl, addToast } = useData();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [licenseImageUrl, setLicenseImageUrl] = useState<string | null>(null);

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    useEffect(() => {
        if (selectedVehicle && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start < end) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setTotalPrice(diffDays * selectedVehicle.pricing.perDay);
            } else {
                setTotalPrice(0);
            }
        }
    }, [selectedVehicle, startDate, endDate]);
    
    useEffect(() => {
        const fetchImageUrl = async () => {
            if (request.customer_details.drivers_license_image_path) {
                const url = await getLicenseImageUrl(request.customer_details.drivers_license_image_path);
                setLicenseImageUrl(url);
            }
        };
        // For local mock, we can display the base64 if it exists.
        if (request.drivers_license_image_base64) {
             setLicenseImageUrl(request.drivers_license_image_base64);
        } else {
            fetchImageUrl();
        }
    }, [request, getLicenseImageUrl]);

    const handleApprove = async () => {
        if (!selectedVehicleId || !startDate || !endDate || totalPrice <= 0) {
            addToast('Vyplňte prosím všechny detaily pronájmu.', 'error');
            return;
        }
        await approveRentalRequest(request.id, selectedVehicleId, startDate, endDate, totalPrice);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Schválení žádosti o pronájem">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Údaje o zákazníkovi</h3>
                    <Card className="bg-gray-900/50">
                        <p><strong>Jméno:</strong> {request.customer_details.first_name} {request.customer_details.last_name}</p>
                        <p><strong>Email:</strong> {request.customer_details.email}</p>
                        <p><strong>Telefon:</strong> {request.customer_details.phone}</p>
                        <p><strong>Číslo OP:</strong> {request.customer_details.id_card_number}</p>
                        <p><strong>Číslo ŘP:</strong> {request.customer_details.drivers_license_number}</p>
                        <p className="text-xs text-green-400 mt-2">Digitální souhlas udělen: {new Date(request.digital_consent_at).toLocaleString('cs-CZ')}</p>
                    </Card>
                    <h3 className="text-lg font-semibold mt-4">Doklad</h3>
                     {licenseImageUrl ? (
                        <a href={licenseImageUrl} target="_blank" rel="noopener noreferrer">
                            <img src={licenseImageUrl} alt="Řidičský průkaz" className="rounded-lg max-h-60 w-auto" />
                        </a>
                    ) : (
                        <p className="text-text-secondary">Zákazník nenahrál obrázek dokladu.</p>
                    )}
                </div>

                {/* Rental Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detaily pronájmu</h3>
                    <Select label="Vozidlo" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} required>
                        <option value="">-- Vyberte vozidlo --</option>
                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} - {v.license_plate}</option>)}
                    </Select>
                    <Input label="Začátek pronájmu" type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                    <Input label="Konec pronájmu" type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                    
                    {totalPrice > 0 && (
                        <Card className="bg-gray-900/50">
                            <h4 className="font-semibold">Cena</h4>
                            <p className="text-2xl font-bold">{totalPrice.toLocaleString('cs-CZ')} Kč</p>
                        </Card>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
                <Button variant="secondary" onClick={onClose}>Zavřít</Button>
                <Button onClick={handleApprove} disabled={!selectedVehicleId || !startDate || !endDate}>
                    Schválit a vytvořit smlouvu
                </Button>
            </div>
        </Modal>
    );
};

export default RequestApprovalModal;
