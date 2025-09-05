import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Input, Button, TermsModal } from './ui';
import { ClipboardIcon, CheckIcon, LinkIcon } from './Icons';

const Settings: React.FC = () => {
    const { bankAccount, setBankAccount, addToast } = useData();
    const [account, setAccount] = useState(bankAccount);
    const [isTermsVisible, setIsTermsVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    
    const publicFormUrl = `${window.location.origin}${window.location.pathname}#/public-request`;

    const handleSave = () => {
        setBankAccount(account);
        addToast('Bankovní účet byl aktualizován.', 'success');
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(publicFormUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Nastavení</h1>
            
            <Card>
                <h2 className="text-xl font-bold mb-4">Firemní údaje</h2>
                <div className="space-y-4">
                    <Input 
                        label="Bankovní účet (pro QR platby)"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        placeholder="123456789/0800"
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleSave}>Uložit</Button>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Samoobslužný formulář</h2>
                <p className="text-text-secondary mb-4">
                    Sdílejte tento odkaz se zákazníky, aby si mohli sami vytvořit žádost o pronájem.
                </p>
                <div className="flex items-center gap-4 bg-gray-900 p-3 rounded-lg">
                    <LinkIcon className="w-5 h-5 text-text-secondary" />
                    <input type="text" readOnly value={publicFormUrl} className="bg-transparent w-full focus:outline-none" />
                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                        {copied ? <CheckIcon className="w-4 h-4 mr-1" /> : <ClipboardIcon className="w-4 h-4 mr-1" />}
                        {copied ? 'Zkopírováno' : 'Kopírovat'}
                    </Button>
                </div>
            </Card>

             <Card>
                <h2 className="text-xl font-bold mb-4">Všeobecné obchodní podmínky</h2>
                <p className="text-text-secondary mb-4">
                    Zde můžete upravit text Všeobecných obchodních podmínek, které se zobrazují zákazníkům.
                </p>
                 <div className="flex justify-start">
                    <Button variant="secondary" onClick={() => setIsTermsVisible(true)}>Zobrazit a upravit podmínky</Button>
                </div>
            </Card>

            {isTermsVisible && <TermsModal onClose={() => setIsTermsVisible(false)} />}
        </div>
    );
};

export default Settings;
