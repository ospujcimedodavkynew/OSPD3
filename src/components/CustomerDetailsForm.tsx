import React, { useState } from 'react';
import type { Customer } from '../types';
import { Input, Button } from './ui';

interface CustomerDetailsFormProps {
  customer: Customer;
  onSave: (updatedCustomer: Customer) => void;
  onCancel: () => void;
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Customer>(customer);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Jméno" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <Input label="Příjmení" name="last_name" value={formData.last_name} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <Input label="Telefon" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        <Input label="Číslo OP" name="id_card_number" value={formData.id_card_number} onChange={handleChange} required />
        <Input label="Číslo ŘP" name="drivers_license_number" value={formData.drivers_license_number} onChange={handleChange} required />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Zrušit</Button>
        <Button type="submit">Uložit změny</Button>
      </div>
    </form>
  );
};

export default CustomerDetailsForm;
