import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployes } from '../Redux/slices/employesSlice';
import { getEmployeSpots,updateSpot } from '../Redux/slices/spotsSlice';
import { fetchPricing_rates } from '../Redux/slices/pracingRatesSlice';
import { addParking_ticket,fetchParking_tickets  } from '../Redux/slices/parkingTicketsSlice';
import { FloatButton } from 'antd';
import { ScanLine } from 'lucide-react';
import QRCodeScanner from './QrCodeScanner';
import { FaCar,FaChargingStation,FaWheelchair  } from 'react-icons/fa';
import isEqual from "lodash/isEqual";
import { generateTicketPDF } from './ticketPdf';

export default function SpotsEmploye() {
    const employeeSpots = useSelector(state => state.spots.employeeSpots);
    const { pricing_rates } = useSelector(state => state.pricing_rates);
    const [showScanner, setShowScanner] = useState(false);
    const dispatch = useDispatch();
    const { user, token} = useSelector((state) => state.auth);
    const {employes} = useSelector(state=>state.employes) 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [employeIdStock,setEmployeIdStock] =useState(null)
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
        dispatch(fetchPricing_rates());
        dispatch(fetchParking_tickets());
        dispatch(fetchEmployes())
    }, [dispatch]);

    useEffect(() => {
        if (user && employes.length > 0) {
            const employe_id = employes.find(employe => Number(employe.user_id) === Number(user.id))?.id;
            if (employe_id) {
                dispatch(getEmployeSpots(employe_id));
                if (!isEqual(employe_id, employeIdStock)) {
                      setEmployeIdStock(employe_id);
                    }
            }
        }
    }, [user, employes, dispatch]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevent =>({
            ...prevent,[name]:value
        }))
    };

    const handleSpotClick = (spot) => {
      setSelectedSpot(spot)
      if(spot.status === "disponible"){
        setFormData({
            clientName: '',
            spot_id: spot.id,  
            client_id: null,
            base_rate_id: pricing_rates[0]?.id,
            entry_time: new Date().toISOString().slice(0, 16),
            exit_time: null,
            total_price: 0,
            status: "active"
        })
        setIsModalOpen(true)
      }
      
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSpot) {
            const pricePerHour = pricing_rates.find(r => r.id === formData.base_rate_id)?.price_per_hour || 0;
    
            if (selectedSpot.status === "disponible") {
                const resultAction = await dispatch(addParking_ticket(formData));
    
                if (addParking_ticket.fulfilled.match(resultAction)) {
                    const newTicket = resultAction.payload;
                    const ticketId = newTicket.id;
    
                    setFormData(prev => ({
                        ...prev,
                        id: ticketId
                    }));
    
                    await dispatch(updateSpot({
                        id: formData.spot_id,
                        updatedSpot: { ...selectedSpot, status: "reserve" }
                    }));
    
                    if (employeIdStock) {
                        dispatch(getEmployeSpots(employeIdStock));
                    }
    
                    await generateTicketPDF({ ...formData, id: ticketId }, selectedSpot, pricePerHour);
    
                    setIsModalOpen(false);}
        }
        
    }
        
    };
    

    return (
        <div>
           
           <FloatButton
            shape="circle"
            type="primary"
            style={{
                insetInlineEnd: 74,
            }}
            icon={
                <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                }}>
                <ScanLine size={50} /> 
                </div>
                
            }onClick={()=>setShowScanner(true)}/>
            {employeeSpots && (
                    <div className="grid grid-cols-2 m-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2 p-4 bg-white rounded">
                            {employeeSpots.map(spot => (
                                <button
                                    key={spot.id}
                                    onClick={() => handleSpotClick(spot)}
                                    className={`text-center py-2 px-3 rounded border  font-medium text-sm w-full flex items-center justify-center
                                    ${spot.status === "reserve"
                                        ? 'bg-gray-800 text-white'
                                        : spot.status === "disponible"
                                        ? 'bg-white text-black border-gray-300 hover:bg-gray-500'
                                        : 'bg-gray-300 text-gray-600'
                                    }`}
                                >
                                    {spot.type === 'Handicap' && (
                                    <FaWheelchair className="w-6 h-6 text-blue-600 mb-1 mr-4" />
                                    )}
                                    {spot.type === 'Electric Vehicle' && (
                                    <FaChargingStation className="w-6 h-6 text-green-600 mb-1 mr-4" />
                                    )}
                                    {spot.type === 'Moteur voiture' && (
                                    <FaCar className="w-6 h-6 text-gray-600 mb-1 mr-4" />
                                    )}

                                    {spot.nom}
                                </button>
                            ))}
                        </div>
                        )}


            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center" onClick={() => setIsModalOpen(false)} >
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md" onClick={(e) => e.stopPropagation()}>
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
                            <div className="mt-6 flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Confirmer
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
                    {showScanner && <QRCodeScanner openModel={showScanner} onClose={() => setShowScanner(false)}/>}

        </div>
    );
}