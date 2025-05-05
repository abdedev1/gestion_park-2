import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployes, getEmployeById } from '../Redux/slices/employesSlice';
import { getEmployeSpots,updateSpot } from '../Redux/slices/spotsSlice';
import { fetchPricingRates } from '../Redux/slices/pricingRatesSlice';
import { addParkingTicket,fetchParkingTickets  } from '../Redux/slices/parkingTicketsSlice';
import { FloatButton } from 'antd';
import { ScanLine } from 'lucide-react';
import QRCodeScanner from './QrCodeScanner';
import { FaCar,FaChargingStation,FaWheelchair  } from 'react-icons/fa';
import isEqual from "lodash/isEqual";
import { generateTicketPDF } from './ticketPdf';
import { ParkMap } from '../ParkMap';

export default function SpotsEmploye() {
    const { user } = useSelector((state) => state.auth);
    const { park } = user.role_data
    const { pricingRates } = useSelector(state => state.pricingRates);
    const [showScanner, setShowScanner] = useState(false);
    const dispatch = useDispatch();
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
        dispatch(fetchPricingRates());
        dispatch(fetchParkingTickets());
    }, [dispatch]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevent =>({
            ...prevent,[name]:value
        }))
    };

    const handleSpotClick = (spot) => {
      setSelectedSpot(spot)
      if(spot.status === "available"){
        setFormData({
            clientName: '',
            spot_id: spot.id,  
            client_id: null,
            base_rate_id: pricingRates[0]?.id,
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
            const pricePerHour = pricingRates.find(r => r.id === formData.base_rate_id)?.price_per_hour || 0;
    
            if (selectedSpot.status === "available") {
                const resultAction = await dispatch(addParkingTicket(formData));
    
                if (addParkingTicket.fulfilled.match(resultAction)) {
                    const newTicket = resultAction.payload;
                    const ticketId = newTicket.id;
    
                    setFormData(prev => ({
                        ...prev,
                        id: ticketId
                    }));
    
                    await dispatch(updateSpot({
                        id: formData.spot_id,
                        updatedSpot: { ...selectedSpot, status: "reserved" }
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

            <div className="bg-base-100 mx-auto my-4 flex justify-center">
                {park ? <ParkMap park={park} action={handleSpotClick} /> : <p className="text-center text-gray-500">No parks available</p>}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center" onClick={() => setIsModalOpen(false)} >
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">
                            {selectedSpot?.status === "available" 
                                ? "Réservation du Spot" 
                                : "Libération du Spot"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="clientName" className="block text-sm font-medium">
                                    Client Name
                                </label>
                                <input
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    required={selectedSpot?.status === "available"}
                                    disabled={selectedSpot?.status === "reserved"}
                                    className={`w-full px-3 py-2 border rounded ${
                                        selectedSpot?.status === "reserved" 
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
                                            pricingRates.find(r => r.id === formData.base_rate_id)?.price_per_hour || 0
                                        }
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="spotName" className="block text-sm font-medium">
                                        Spot Name
                                    </label>
                                    <input
                                        type="text"
                                        id="spotName"
                                        name="spotName"
                                        value={selectedSpot?.name || ''}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="entry_time" className="block text-sm font-medium">
                                        Entry Date and Time
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
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)} 
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
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