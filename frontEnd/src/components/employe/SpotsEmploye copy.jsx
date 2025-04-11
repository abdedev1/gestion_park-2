import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployeSpots } from '../Redux/Reducer/spotsSlice';
import { fetchPricing_rates } from '../Redux/Reducer/pracingRatesSlice';
import { addParking_ticket } from '../Redux/Reducer/parkingTicketsSlice';
import { updateSpot } from '../Redux/Reducer/spotsSlice';
import { updateParking_ticket } from '../Redux/Reducer/parkingTicketsSlice';
import { fetchParking_tickets } from '../Redux/Reducer/parkingTicketsSlice';
export default function SpotsEmploye() {
    const { spots } = useSelector(state => state.spots);
    const {pricing_rates} = useSelector(state =>state.pricing_rates)
    const {parking_tickets} = useSelector(state =>state.parking_tickets)
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        clientName: '',
        spot_id: '',  
        client_id: null,
        base_rate_id: null,
        entry_time: '',
        exit_time: null,
        total_price: 0,
        status:null
    });
    
    const [selectedSpot, setSelectedSpot] = useState(null);

    useEffect(() => {
        dispatch(getEmployeSpots(1));
        dispatch(fetchPricing_rates())
        dispatch(fetchParking_tickets())
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'exit_time') {
            const entryTime = new Date(formData.entry_time);
            const exitTime = new Date(value);
            const durationInHours = (exitTime - entryTime) / (1000 * 60 * 60);  
            console.log(durationInHours)
            setFormData(prevState => ({
                ...prevState,
                total_price: durationInHours * prevState.base_rate_id,  
            }));
        }
    };
    const handleSpotClick = (spot) => {
        if(spot.status === "disponible"){
            setFormData({
                clientName: '',  
                spot_id: spot.id, 
                base_rate_id: pricing_rates[0].id, 
                client_id: null ,  
                entry_time: new Date().toISOString().slice(0, 16),
                exit_time: null,  
                total_price: 0,  
                status:'active'
            });
            setSelectedSpot(spot);
            setIsModalOpen(true);  
        }else{
            let newdata = parking_tickets.find(t=> Number(selectedSpot.id) === Number(t.spot_id))
            setFormData({
                clientName: newdata.clientName,  
                spot_id: spot.id, 
                base_rate_id: pricing_rates[0].id, 
                client_id: null ,  
                entry_time: newdata.entry_time,
                exit_time: null,  
                total_price: 0,  
                status:newdata.status
            });
            setSelectedSpot(spot);
            setIsModalOpen(true);  
        }
        
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        if(selectedSpot.status === "disponible"){
            dispatch(addParking_ticket(formData))
            dispatch(updateSpot({id:formData.spot_id,updatedSpot:{...selectedSpot,status:"reserve"}}))
        }
        else if(selectedSpot.status === "reserve"){
            let id_ticket = String(parking_tickets.find(t=> Number(selectedSpot.id) === Number(t.spot_id))?.id)
            dispatch(updateParking_ticket({id:id_ticket,updatedParking_ticket:{...formData,status:'completed'}}))
            dispatch(updateSpot({id:formData.spot_id,updatedSpot:{...selectedSpot,status:"disponible"}}))
        }
        
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="grid grid-cols-10 gap-2 p-4 bg-white rounded">
                {spots.map((spot) => (
                    <button
                        key={spot.id}
                        onClick={() => handleSpotClick(spot)} 
                        className={`text-center py-2 px-3 rounded border font-medium text-sm
                            ${spot.status === 'reserve'
                                ? 'bg-gray-800 text-white'
                                : spot.status === 'disponible'
                                    ? 'bg-white text-black border-gray-300'
                                    : 'bg-gray-300 text-gray-600'
                            }
                            ${spot.type === 'handicap' ? 'flex items-center justify-center gap-1' : ''}`}
                    >
                        {spot.nom}
                        {spot.type === 'handicap' && <span className="text-lg">♿</span>}
                    </button>
                ))}
            </div>

            {/* Modal with the form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-400">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
                        <h2 className="text-xl font-bold mb-4">Réservation du Spot</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="clientName" className="block text-sm font-medium">Nom du Client</label>
                                <input
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="Nom du client"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Type */}
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium">Type</label>
                                    <input
                                        type="text"
                                        id="type"
                                        name="type"
                                        value={selectedSpot.type}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="base_rate_id" className="block text-sm font-medium">Prix Par Heure</label>
                                    <input
                                        type="number"
                                        id="base_rate_id"
                                        name="base_rate_id"
                                        value={pricing_rates[0].price_per_hour}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="spot_id" className="block text-sm font-medium">Nom du Spot</label>
                                    <input
                                        type="text"
                                        id="spot_id"
                                        name="spot_id"
                                        value={selectedSpot ? selectedSpot.nom : ''}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="entry_time" className="block text-sm font-medium">Date et Heure</label>
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

                            {formData.entry_time && (
                                <div>
                                    <label htmlFor="exit_time" className="block text-sm font-medium">Date et Heure de Sortie</label>
                                    <input
                                        type="datetime-local"
                                        id="exit_time"
                                        name="exit_time"
                                        value={formData.exit_time || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                    />
                                </div>
                            )}

                            <div className="mt-4">
                                <label htmlFor="total_price" className="block text-sm font-medium">Prix Total</label>
                                <input
                                    type="number"
                                    id="total_price"
                                    name="total_price"
                                    value={formData.total_price}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                />
                            </div>

                            <div className="mt-6 flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    {selectedSpot.status === "disponible" ? 'Confirmer':"Update"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)} 
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg"
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
