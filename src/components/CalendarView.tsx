import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';

const CalendarView = () => {
    const { vehicles, rentals } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const isRented = (vehicleId: string, day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return rentals.some(rental => {
            const startDate = new Date(rental.startDate);
            const endDate = new Date(rental.endDate);
            return rental.vehicleId === vehicleId && checkDate >= startDate && checkDate <= endDate;
        });
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="px-4 py-2 bg-primary rounded-lg">&lt;</button>
                <h2 className="text-2xl font-bold">
                    {currentDate.toLocaleString('cs-CZ', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={nextMonth} className="px-4 py-2 bg-primary rounded-lg">&gt;</button>
            </div>
            <div className="overflow-x-auto">
                <div className="grid gap-px bg-gray-700" style={{ gridTemplateColumns: `150px repeat(${daysInMonth}, minmax(40px, 1fr))` }}>
                    <div className="p-2 font-semibold bg-surface sticky left-0 z-10">Vozidlo</div>
                    {days.map(day => (
                        <div key={day} className="p-2 text-center font-semibold bg-surface">
                            {day}
                        </div>
                    ))}
                    
                    {vehicles.map(vehicle => (
                        <React.Fragment key={vehicle.id}>
                            <div className="p-2 text-sm font-semibold bg-surface sticky left-0 z-10 border-t border-gray-700">{vehicle.brand}</div>
                            {days.map(day => (
                                <div key={day} className={`p-2 border-t border-gray-700 ${isRented(vehicle.id, day) ? 'bg-red-500/50' : 'bg-surface'}`}>
                                    &nbsp;
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default CalendarView;
