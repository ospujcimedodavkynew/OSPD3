import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';

const CalendarView: React.FC = () => {
    const { rentals, vehicles, customers } = useData();

    // This is a simplified calendar view. A real app would use a library like FullCalendar.
    // We will group rentals by date.
    const eventsByDate: { [key: string]: any[] } = {};
    rentals.forEach(rental => {
        const startDate = new Date(rental.startDate);
        const dateKey = startDate.toISOString().split('T')[0];
        if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push({
            type: 'start',
            ...rental
        });

        const endDate = new Date(rental.endDate);
        const endDateKey = endDate.toISOString().split('T')[0];
        if (!eventsByDate[endDateKey]) {
            eventsByDate[endDateKey] = [];
        }
        eventsByDate[endDateKey].push({
            type: 'end',
            ...rental
        });
    });

    const sortedDates = Object.keys(eventsByDate).sort();

    const getVehicleBrand = (id: string) => vehicles.find(v => v.id === id)?.brand || 'Neznámé';
    const getCustomerName = (id:string) => {
        const c = customers.find(cust => cust.id === id);
        return c ? `${c.first_name} ${c.last_name}` : 'Neznámý';
    };
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Kalendář</h1>
            <Card>
                {sortedDates.length > 0 ? (
                    <div className="space-y-6">
                        {sortedDates.map(date => (
                            <div key={date}>
                                <h2 className="font-bold text-lg mb-2 border-b border-gray-700 pb-1">
                                    {new Date(date).toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </h2>
                                <ul className="space-y-2">
                                    {eventsByDate[date].map(event => (
                                        <li key={`${event.id}-${event.type}`} className={`p-3 rounded-lg flex items-center ${
                                            event.type === 'start' ? 'bg-blue-500/20' : 'bg-red-500/20'
                                        }`}>
                                            <span className={`w-3 h-3 rounded-full mr-3 ${event.type === 'start' ? 'bg-blue-400' : 'bg-red-400'}`}></span>
                                            <div>
                                                <span className="font-semibold">{getVehicleBrand(event.vehicleId)}</span> - {getCustomerName(event.customerId)}
                                                <span className="text-sm text-text-secondary ml-2">
                                                    ({event.type === 'start' ? 'Začátek' : 'Konec'} v {new Date(event.type === 'start' ? event.startDate : event.endDate).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })})
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-secondary">V kalendáři nejsou žádné události.</p>
                )}
            </Card>
        </div>
    );
};

export default CalendarView;
