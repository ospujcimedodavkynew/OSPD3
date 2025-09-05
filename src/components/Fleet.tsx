import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Modal, Input, Textarea } from './ui';
import type { Vehicle, ServiceRecord } from '../types';
import { PlusIcon, EditIcon, Trash2Icon } from './Icons';

const Fleet = () => {
    const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const openModal = (vehicle: Vehicle | null = null) => {
        setEditingVehicle(vehicle);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
    };

    const handleSave = (vehicle: Vehicle) => {
        if (editingVehicle) {
            updateVehicle(vehicle);
        } else {
            addVehicle(vehicle);
        }
        closeModal();
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Přehled vozového parku</h1>
                <Button onClick={() => openModal()}><PlusIcon className="w-5 h-5 mr-2" />Přidat vozidlo</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                    <Card key={vehicle.id} className="flex flex-col">
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold">{vehicle.brand}</h2>
                            <p className="text-text-secondary">{vehicle.license_plate}</p>
                            <div className="mt-4 space-y-2 text-sm">
                                <p><strong>VIN:</strong> {vehicle.vin}</p>
                                <p><strong>Rok výroby:</strong> {vehicle.year}</p>
                                <p><strong>Cena/den:</strong> {vehicle.pricing.perDay} Kč</p>
                                <p><strong>STK do:</strong> {new Date(vehicle.stk_date).toLocaleDateString('cs-CZ')}</p>
                                <p><strong>Poslední servis:</strong> {vehicle.serviceHistory.length > 0 ? new Date(vehicle.serviceHistory[vehicle.serviceHistory.length - 1].date).toLocaleDateString('cs-CZ') : 'Nezáznamenáno'}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end gap-2">
                            <Button variant="secondary" size="sm" onClick={() => openModal(vehicle)}><EditIcon className="w-4 h-4 mr-2"/>Upravit</Button>
                            <Button variant="danger" size="sm" onClick={() => deleteVehicle(vehicle.id)}><Trash2Icon className="w-4 h-4 mr-2"/>Smazat</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {isModalOpen && <VehicleForm vehicle={editingVehicle} onSave={handleSave} onClose={closeModal} />}
        </div>
    );
};

// VehicleForm Component
const VehicleForm: React.FC<{ vehicle: Vehicle | null, onSave: (vehicle: Vehicle) => void, onClose: () => void }> = ({ vehicle, onSave, onClose }) => {
    const { addServiceRecord, updateServiceRecord, deleteServiceRecord, addToast } = useData();
    const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>(
        vehicle ? { ...vehicle } : {
            brand: '', license_plate: '', vin: '', year: new Date().getFullYear(),
            serviceHistory: [], pricing: { perDay: 0 }, stk_date: '',
            insurance_info: '', vignette_until: ''
        }
    );
    
    const [newServiceRecord, setNewServiceRecord] = useState<Omit<ServiceRecord, 'id'>>({ date: '', description: '', cost: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (name === 'perDay') {
            setFormData(prev => ({ ...prev, pricing: { ...prev.pricing, perDay: Number(value) } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
        }
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setNewServiceRecord(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleAddServiceRecord = () => {
        if (!newServiceRecord.date || !newServiceRecord.description) {
            addToast('Datum a popis servisu jsou povinné.', 'error');
            return;
        }
        if (vehicle) {
            addServiceRecord(vehicle.id, newServiceRecord);
            // We need to update the form state directly as the context update won't be reflected here
            setFormData(prev => ({ ...prev, serviceHistory: [...prev.serviceHistory, { ...newServiceRecord, id: 'temp-id' }] }));
        } else {
            setFormData(prev => ({...prev, serviceHistory: [...prev.serviceHistory, {...newServiceRecord, id: 'temp-id-' + Math.random()}]}));
        }
        setNewServiceRecord({ date: '', description: '', cost: 0 });
    };

    const handleDeleteServiceRecord = (recordId: string) => {
        if (vehicle) {
            deleteServiceRecord(vehicle.id, recordId);
            setFormData(prev => ({...prev, serviceHistory: prev.serviceHistory.filter(r => r.id !== recordId)}));
        } else {
             setFormData(prev => ({...prev, serviceHistory: prev.serviceHistory.filter(r => r.id !== recordId)}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: vehicle?.id || '' });
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={vehicle ? 'Upravit vozidlo' : 'Nové vozidlo'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Značka a model" name="brand" value={formData.brand} onChange={handleChange} required />
                    <Input label="SPZ" name="license_plate" value={formData.license_plate} onChange={handleChange} required />
                    <Input label="VIN" name="vin" value={formData.vin} onChange={handleChange} required />
                    <Input label="Rok výroby" name="year" type="number" value={formData.year} onChange={handleChange} required />
                    <Input label="Cena/den (Kč)" name="perDay" type="number" value={formData.pricing.perDay} onChange={handleChange} required />
                    <Input label="STK platná do" name="stk_date" type="date" value={formData.stk_date} onChange={handleChange} required />
                </div>
                <Textarea label="Informace o pojištění" name="insurance_info" value={formData.insurance_info} onChange={handleChange} rows={2} />
                <Input label="Dálniční známka do" name="vignette_until" type="date" value={formData.vignette_until} onChange={handleChange} required />
                
                {/* Service History */}
                <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Servisní historie</h3>
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                        {formData.serviceHistory.map(record => (
                            <div key={record.id} className="flex items-center justify-between bg-gray-800 p-2 rounded-md text-sm">
                                <div>
                                    <p className="font-semibold">{new Date(record.date).toLocaleDateString('cs-CZ')} - {record.description}</p>
                                    <p className="text-text-secondary">{record.cost.toLocaleString('cs-CZ')} Kč</p>
                                </div>
                                <Button type="button" variant="danger" size="sm" onClick={() => handleDeleteServiceRecord(record.id)}>
                                    <Trash2Icon className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end bg-gray-900/50 p-3 rounded-lg">
                        <Input label="Datum" name="date" type="date" value={newServiceRecord.date} onChange={handleServiceChange} />
                        <Input label="Popis" name="description" value={newServiceRecord.description} onChange={handleServiceChange} />
                        <Input label="Cena (Kč)" name="cost" type="number" value={newServiceRecord.cost} onChange={handleServiceChange} />
                        <Button type="button" onClick={handleAddServiceRecord} className="w-full">Přidat záznam</Button>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                    <Button type="button" variant="secondary" onClick={onClose}>Zrušit</Button>
                    <Button type="submit">Uložit vozidlo</Button>
                </div>
            </form>
        </Modal>
    );
};


export default Fleet;
