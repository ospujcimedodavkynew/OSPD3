import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Button, Card, Input, Modal, Textarea } from './ui';
import { PlusIcon, EditIcon, Trash2Icon } from './Icons';
import type { Vehicle } from '../types';

const VehicleForm: React.FC<{
    vehicle?: Vehicle | null;
    onSave: (vehicle: Omit<Vehicle, 'id'> | Vehicle) => void;
    onClose: () => void;
}> = ({ vehicle, onSave, onClose }) => {
    const [formData, setFormData] = useState(
        vehicle || {
            brand: '', license_plate: '', vin: '', year: new Date().getFullYear(),
            stk_date: '', insurance_info: '', vignette_until: '',
            pricing: { perDay: 0, perHour: 0 }, serviceHistory: []
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, pricing: { ...formData.pricing, [e.target.name]: Number(e.target.value) } });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="brand" label="Značka a model" value={formData.brand} onChange={handleChange} required />
                <Input name="license_plate" label="SPZ" value={formData.license_plate} onChange={handleChange} required />
                <Input name="vin" label="VIN" value={formData.vin} onChange={handleChange} required />
                <Input name="year" label="Rok výroby" type="number" value={formData.year} onChange={handleChange} required />
                <Input name="stk_date" label="STK platná do" type="date" value={formData.stk_date} onChange={handleChange} required />
                <Input name="vignette_until" label="Dálniční známka do" type="date" value={formData.vignette_until} onChange={handleChange} required />
                <Input name="perDay" label="Cena za den (Kč)" type="number" name="perDay" value={formData.pricing.perDay} onChange={handlePricingChange} required />
                <Input name="perHour" label="Cena za hodinu (Kč)" type="number" name="perHour" value={formData.pricing.perHour || ''} onChange={handlePricingChange} />
            </div>
             <Textarea name="insurance_info" label="Informace o pojištění" value={formData.insurance_info} onChange={handleChange} required />
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Zrušit</Button>
                <Button type="submit">{vehicle ? 'Uložit změny' : 'Přidat vozidlo'}</Button>
            </div>
        </form>
    );
};

const Fleet: React.FC = () => {
    const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const handleSave = (vehicle: Omit<Vehicle, 'id'> | Vehicle) => {
        if ('id' in vehicle) {
            updateVehicle(vehicle);
        } else {
            addVehicle(vehicle);
        }
        setIsModalOpen(false);
        setSelectedVehicle(null);
    };

    const openAddModal = () => {
        setSelectedVehicle(null);
        setIsModalOpen(true);
    };

    const openEditModal = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Vozový park</h1>
                <Button onClick={openAddModal}><PlusIcon className="w-5 h-5 mr-2" /> Přidat vozidlo</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                    <Card key={vehicle.id} className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold">{vehicle.brand}</h2>
                            <p className="text-text-secondary">{vehicle.license_plate}</p>
                            <div className="mt-4 text-sm space-y-1">
                                <p><strong>VIN:</strong> {vehicle.vin}</p>
                                <p><strong>STK do:</strong> {new Date(vehicle.stk_date).toLocaleDateString('cs-CZ')}</p>
                                <p><strong>Cena/den:</strong> {vehicle.pricing.perDay} Kč</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                             <Button size="sm" variant="secondary" onClick={() => openEditModal(vehicle)}><EditIcon className="w-4 h-4" /></Button>
                             <Button size="sm" variant="danger" onClick={() => deleteVehicle(vehicle.id)}><Trash2Icon className="w-4 h-4" /></Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedVehicle ? 'Upravit vozidlo' : 'Nové vozidlo'}>
                <VehicleForm vehicle={selectedVehicle} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Fleet;
