import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployeSpots } from '../Redux/Reducer/spotsSlice';
import { fetchPricing_rates } from '../Redux/Reducer/pracingRatesSlice';
import { addParking_ticket } from '../Redux/Reducer/parkingTicketsSlice';
import { updateSpot } from '../Redux/Reducer/spotsSlice';
import { updateParking_ticket } from '../Redux/Reducer/parkingTicketsSlice';
import { fetchParking_tickets } from '../Redux/Reducer/parkingTicketsSlice';

const selectTicketForSpot = (tickets, spotId) => 
    tickets.find(t => Number(t.spot_id) === Number(spotId) && t.status === "active");

export default function SpotsEmploye() {
    const { spots } = useSelector(state => state.spots);
    const { pricing_rates } = useSelector(state => state.pricing_rates);
    const { parking_tickets } = useSelector(state => state.parking_tickets);
    const dispatch = useDispatch();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [formData, setFormData] = useState({
        clientName: '',
        spot_id: '',  
        client_id: null,
        base_rate_id: null,
        entry_time: '',
        exit_time: null,
        total_price: 0,
        status: null
    });

    useEffect(() => {
        dispatch(getEmployeSpots(1));
        dispatch(fetchPricing_rates());
        dispatch(fetchParking_tickets());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'exit_time' && formData.entry_time) {
            const entryTime = new Date(formData.entry_time);
            const exitTime = new Date(value);
            const durationInHours = (exitTime - entryTime) / (1000 * 60 * 60);
            
            const rate = pricing_rates.find(r => r.id === formData.base_rate_id);
            const pricePerHour = rate ? rate.price_per_hour : 0;
            
            setFormData(prev => ({
                ...prev,
                [name]: value,
                total_price: parseFloat((durationInHours * pricePerHour).toFixed(2))
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSpotClick = (spot) => {
        setSelectedSpot(spot);
        const ticket = selectTicketForSpot(parking_tickets, spot.id);
        
        if (spot.status === "disponible") {
            setFormData({
                clientName: '',  
                spot_id: spot.id, 
                base_rate_id: pricing_rates[0]?.id || null, 
                client_id: null,  
                entry_time: new Date().toISOString().slice(0, 16),
                exit_time: null,  
                total_price: 0,  
                status: 'active'
            });
        } else if (ticket) {
            console.log(ticket)
            setFormData({
                clientName: ticket.clientName,  
                spot_id: spot.id, 
                base_rate_id: ticket.base_rate_id, 
                client_id: ticket.client_id,  
                entry_time: ticket.entry_time,
                exit_time: ticket.exit_time || null,  
                total_price: ticket.total_price || 0,  
                status: ticket.status
            });
        }
        
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedSpot) return;
        
        try {
            if (selectedSpot.status === "disponible") {
                 await dispatch(addParking_ticket(formData));
                 await dispatch(updateSpot({
                    id: formData.spot_id,
                    updatedSpot: { ...selectedSpot, status: "reserve" }
                }));
            } else {
                const ticket = selectTicketForSpot(parking_tickets, selectedSpot.id);
                
                if (ticket) {
                     await dispatch(updateParking_ticket({
                        id: ticket.id,
                        updatedParking_ticket: { 
                            ...formData, 
                            status: 'completed',
                            exit_time: formData.exit_time
                        }
                    }));
                    
                     await dispatch(updateSpot({
                        id: formData.spot_id,
                        updatedSpot: { ...selectedSpot, status: "disponible" }
                    }));
                }
            }
            
            // Refresh data
            await dispatch(getEmployeSpots(1));
            await dispatch(fetchParking_tickets());
            
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
        }
    };

    const renderSpotButton = (spot) => {
        const ticket = selectTicketForSpot(parking_tickets, spot.id);
        const isReserved = spot.status === 'reserve';
        const isAvailable = spot.status === 'disponible';
        
        return (
            <button
                key={spot.id}
                onClick={() => handleSpotClick(spot)}
                className={`text-center py-2 px-3 rounded border font-medium text-sm 
                    ${isReserved
                        ? 'bg-gray-800 text-white'
                        : isAvailable
                            ? 'bg-white text-black border-gray-300'
                            : 'bg-gray-300 text-gray-600'
                    }
                    ${spot.type === 'handicap' ? 'flex items-center justify-center gap-1' : ''}`}
            >
                {isReserved && ticket 
                    ? `${spot.nom}` 
                    : spot.nom}
                {spot.type === 'handicap' && <span className="text-lg">♿</span>}
            </button>
        );
    };

    return (
        <div>
            <div className="grid grid-cols-10 gap-2 p-4 bg-white rounded">
                {spots.map(renderSpotButton)}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-500">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedSpot?.status === "disponible" 
                                ? "Réservation du Spot" 
                                : "Libération du Spot"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="clientName" className="block text-sm font-medium">
                                    Nom du Client
                                </label>
                                <input
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    required={selectedSpot?.status === "disponible"}
                                    disabled={selectedSpot?.status === "reserve"}
                                    className={`w-full px-3 py-2 border rounded ${
                                        selectedSpot?.status === "reserve" 
                                            ? "bg-gray-200" 
                                            : "border-gray-300"
                                    }`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium">
                                        Type
                                    </label>
                                    <input
                                        type="text"
                                        id="type"
                                        name="type"
                                        value={selectedSpot?.type || ''}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium">
                                        Prix Par Heure
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={
                                            pricing_rates.find(r => r.id === formData.base_rate_id)?.price_per_hour || 0
                                        }
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="spotName" className="block text-sm font-medium">
                                        Nom du Spot
                                    </label>
                                    <input
                                        type="text"
                                        id="spotName"
                                        name="spotName"
                                        value={selectedSpot?.nom || ''}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="entry_time" className="block text-sm font-medium">
                                        Date et Heure d'Entrée
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="entry_time"
                                        name="entry_time"
                                        value={formData.entry_time}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            </div>

                            {selectedSpot?.status === "reserve" && (
                                <div>
                                    <label htmlFor="exit_time" className="block text-sm font-medium">
                                        Date et Heure de Sortie
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="exit_time"
                                        name="exit_time"
                                        value={formData.exit_time || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                    />
                                </div>
                            )}

                            {formData.exit_time && (
                                <div>
                                    <label htmlFor="total_price" className="block text-sm font-medium">
                                        Prix Total
                                    </label>
                                    <input
                                        type="number"
                                        id="total_price"
                                        name="total_price"
                                        value={formData.total_price}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            )}

                            <div className="mt-6 flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    {selectedSpot?.status === "disponible" ? 'Confirmer' : 'Terminer'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)} 
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}