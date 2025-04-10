import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployes } from '../Redux/Reducer/employesSlice';
import { axios } from '../../assets/api/axios';

export default function SpotsEmploye() {
    const { employes } = useSelector(state => state.employes);
    const dispatch = useDispatch();
    const [spots, setSpots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        clientName: '',
        spotName: '',  
        type: '',
        price: '',
        date: '',      
    });

    useEffect(() => {
        dispatch(fetchEmployes());
        axios.get('spots').then((res) => {
            setSpots(res.data);
        });
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSpotClick = (spot) => {
        setFormData({
            clientName: '',  
            spotName: spot.nom, 
            type: spot.type,  
            price: spot.price,  
            date: new Date().toISOString().slice(0, 16),  
        });
        setIsModalOpen(true);  
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="grid grid-cols-10 gap-2 p-4 bg-white rounded">
                {spots.map((spot) => (
                    <button
                        key={spot.id}
                        onClick={() => handleSpotClick(spot)} 
                        className={`
                            text-center py-2 px-3 rounded border font-medium text-sm
                            ${spot.status === 'reserved'
                                ? 'bg-gray-800 text-white'
                                : spot.status === 'free'
                                    ? 'bg-white text-black border-gray-300'
                                    : 'bg-gray-300 text-gray-600'
                            }
                            ${spot.type === 'handicap' ? 'flex items-center justify-center gap-1' : ''}
                        `}
                    >
                        {spot.nom}
                        {spot.type === 'handicap' && <span className="text-lg">♿</span>}
                    </button>
                ))}
            </div>

            {/* Modal with the form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
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
                                        value={formData.type}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium">Prix</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            </div>

                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                <label htmlFor="spotName" className="block text-sm font-medium">Nom du Spot</label>
                                <input
                                    type="text"
                                    id="spotName"
                                    name="spotName"
                                    value={formData.spotName}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                />
                                </div>
                                <div>
                                <label htmlFor="date" className="block text-sm font-medium">Date et Heure</label>
                                <input
                                    type="datetime-local"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                />
                                </div>
                            </div>

                            

                            <div className="mt-6 flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Confirmer
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
