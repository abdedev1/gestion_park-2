import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSpot } from '../Redux/slices/spotsSlice';
import { fetchPricingRates } from '../Redux/slices/pricingRatesSlice';
import { addParkingTicket,fetchParkingTickets  } from '../Redux/slices/parkingTicketsSlice';
import { Button, FloatButton, Modal } from 'antd';
import { ScanLine } from 'lucide-react';
import QRCodeScanner from './QrCodeScanner';
import { FaQrcode } from 'react-icons/fa';
import { generateTicketPDF } from './ticketPdf';
import { ParkMap } from '../ParkMap';
import QrCodeScannerCart from './QrCodeScannerCart';
import { getClientById } from '../../assets/api/admin/users'
import {getPark} from '../../assets/api/parks/park';

export default function SpotsEmploye() {
    const { user } = useSelector((state) => state.auth);
    const [park, setPark] = useState(user.role_data.park);
    const { pricingRates } = useSelector(state => state.pricingRates);
    const [showScanner, setShowScanner] = useState(false);
    const [showCartScanner, setShowCartScanner] = useState(false);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [scanLoading, setScanLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pendingSpot, setPendingSpot] = useState(null);
    const [client, setClient] = useState(null);



    const [formData, setFormData] = useState({
        clientName: 'Not registered',
        spot_id: '',  
        client_id: null,
        base_rate_id: null,
        entry_time: '',
        exit_time: null,
        total_price: 0,
        status: null
    });

 const getBaseRateIdForType = (type) => {
  if (!type || !pricingRates) return null;
  const found = pricingRates.find(r => r.rate_name.toLowerCase() === type.toLowerCase());
  return found ? found.id : null;
};

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

    const handleScanClient = async () => {
        setScanLoading(true);
        setShowCartScanner(true)
    }

    const handleClientScanResult = async (result) => {
        if (result?.client_id) {
            setFormData(prev => ({
                ...prev,
                client_id: result.client_id
            }));
            
            try {
                const res = await getClientById(result.client_id);
                setClient(res);
            } catch (error) {
                console.error('Error fetching client:', error);
            }

        }
        setShowCartScanner(false);
        setScanLoading(false);
    };

        
    const handleSpotClick = (spot) => {
    setSelectedSpot(spot);
    if (client && spot.status === "available") {
        setFormData({
        clientName: client.user.first_name + " " + client.user.last_name,
        spot_id: spot.id,
        client_id: client.id,
        base_rate_id: getBaseRateIdForType(spot.type),
        entry_time: new Date().toISOString().slice(0, 16),
        exit_time: null,
        total_price: 0,
        status: "active"
        });
        setIsModalOpen(true);
        setPendingSpot(null); 
    } else if (spot.status === "available") {
        setFormData({
        clientName: 'Not registered',
        spot_id: spot.id,
        client_id: null,
        base_rate_id: getBaseRateIdForType(spot.type),
        entry_time: new Date().toISOString().slice(0, 16),
        exit_time: null,
        total_price: 0,
        status: "active"
        });
        setIsModalOpen(true);
        setPendingSpot(spot); 
    }
    };
    useEffect(() => {
    if (client && pendingSpot) {
        setFormData(prev => ({
        ...prev,
        clientName: client.user.first_name + " " + client.user.last_name,
        client_id: client.id,
        }));
        setPendingSpot(null);
    }
    }, [client, pendingSpot]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (selectedSpot) {
            const pricePerHour = pricingRates.find(r => r.id === formData.base_rate_id)?.price_per_hour;
            
            if (selectedSpot.status === "available") {
                const resultAction = await dispatch(addParkingTicket(formData));
    
                if (addParkingTicket.fulfilled.match(resultAction)) {
                    const newTicket = resultAction.payload;
                    const ticketId = newTicket.id;
    
                    setFormData(prev => ({
                        ...prev,
                        id: ticketId
                    }));
    
                    const updatedSpot = { ...selectedSpot, status: "reserved" }
                    await dispatch(updateSpot({
                        id: formData.spot_id,
                        updatedSpot: updatedSpot
                    }));
                    updateSpotStatus(formData.spot_id, updatedSpot);

    
                  
                    await generateTicketPDF({ ...formData, id: ticketId }, selectedSpot, pricePerHour);
        
                    setIsModalOpen(false);}
                    
                   
        }
        
    }
        
       setClient(null);
       setLoading(false);
        
    };

    const updateSpotStatus = (spotId, updatedSpot) => {
        setPark({...park, spots: park.spots.map(spot => spot.id === spotId ? updatedSpot : spot)});
    }

    console.log(selectedSpot)
    const SpotModel = () => {
        return (
            <>
            {pricingRates  ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="clientName" className="block text-sm font-medium">
                        Client Name
                    </label>
                    <div className="flex items-center gap-2">
                    <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            value={formData.clientName}
                            readOnly
                            onChange={handleInputChange}
                            required={selectedSpot?.status === "available"}
                            disabled={selectedSpot?.status === "reserved"}
                            className={`w-full px-3 py-2 border rounded ${selectedSpot?.status === "reserved"
                                ? "bg-gray-200"
                                : "border-gray-300"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={handleScanClient}
                            disabled={scanLoading}
                            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            <FaQrcode className={`text-xl ${scanLoading ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                    
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            Price Per Hour
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={
                                park.price
                            }
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="flex justify-between gap-2 mt-4">
                    <Button onClick={() => { setIsModalOpen(false); setClient(null); }} className="rounded" >Cancel</Button>
                    <button type="submit"  className="btn btn-primary btn-sm w-16" disabled={loading}>{loading ? <span className="loading loading-spinner loading-md" />: "Confirm"} </button>
                </div>
            </form>
            ): <span className="loading loading-spinner loading-md" />}
            </>
            
        )
    }
    

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
            
            <ShowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedSpot?.status === "available" ? "Spot Reservation" : "Spot Release"} content={<SpotModel />} />
            <ShowModal isOpen={showScanner} onClose={() => setShowScanner(false)} title="QR Code Scanner" content={<QRCodeScanner updateSpotStatus={updateSpotStatus} />} />
            <ShowModal isOpen={showCartScanner} onClose={() => { setShowCartScanner(false); setScanLoading(false);}} title="Cart Scanner" content={<QrCodeScannerCart onScanResult={handleClientScanResult} onClose={() => { setShowCartScanner(false); setScanLoading(false);}} />} />
        </div>
    );
}

function ShowModal({ isOpen, onClose, content, title}) {
  
    return (
      <Modal
        title={<h1 className="text-xl font-bold text-center">{title}</h1>}
        open={isOpen}
        onCancel={onClose}
        footer={null}
      >
        {content}
      </Modal>
    )
  }