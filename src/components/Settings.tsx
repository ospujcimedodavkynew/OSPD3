import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Input, Button } from './ui';

const Settings = () => {
    const { bankAccount, setBankAccount, addToast } = useData();
    const [localBankAccount, setLocalBankAccount] = useState(bankAccount);

    const handleSave = () => {
        setBankAccount(localBankAccount);
        addToast('Nastavení bylo uloženo.', 'success');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <h2 className="text-xl font-bold mb-6">Nastavení Aplikace</h2>
                <div className="space-y-4">
                    <Input
                        label="Číslo bankovního účtu pro QR platby"
                        value={localBankAccount}
                        onChange={(e) => setLocalBankAccount(e.target.value)}
                        placeholder="Např. 123456789/0800"
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave}>Uložit změny</Button>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
