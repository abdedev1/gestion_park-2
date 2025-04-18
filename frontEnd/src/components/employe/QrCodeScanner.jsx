import { fetchParking_tickets } from '../Redux/slices/parkingTicketsSlice';
import { useSelector,useDispatch } from "react-redux";
import { fetchPricing_rates } from '../Redux/slices/pracingRatesSlice';
import isEqual from "lodash/isEqual";
import { RotateCcw, X,Repeat } from "lucide-react";
import { updateParking_ticket } from "../Redux/slices/parkingTicketsSlice";
import { updateSpot } from "../Redux/slices/spotsSlice";
import { fetchEmployes } from '../Redux/slices/employesSlice';
import { getEmployeSpots } from "../Redux/slices/spotsSlice";
import { useEffect, useState } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import Cookies from "js-cookie";

export default function QRCodeScanner({onClose, openModel}) {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const defaultDeviceId = Cookies.get('deviceId');
  const [selectedDeviceId, setSelectedDeviceId] = useState(defaultDeviceId || null);
  const devices = useDevices();
  const { parking_tickets } = useSelector(state => state.parking_tickets);
  const { pricing_rates } = useSelector(state => state.pricing_rates);
  const employeeSpots = useSelector(state => state.spots.employeeSpots);
  const [updateTicketG,setUpdateTicketG] =useState(null)
  const {employes} = useSelector(state=>state.employes) 
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Set default camera on first load
  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDeviceId(defaultDeviceId || null);
      if (!selectedDeviceId) {
        setSelectedDeviceId(devices[0].deviceId);
      }
    }
  }, [devices]);

  
  useEffect(()=>{
     dispatch(fetchParking_tickets())
     dispatch(fetchPricing_rates());
     dispatch(fetchEmployes())
  },[dispatch])

  const handleScan = (result) => {
    setScanResult(result);
    setIsScanning(false);
    Cookies.set('deviceId', selectedDeviceId, { expires: 7 });
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };
  
  const parseQRTextToObject = (text) => {
    if (!text || typeof text !== 'string') return null;
  
    const parts = text.split(',').map(part => part.trim());
    const data = {};
  
    parts.forEach(part => {
      const [key, value] = part.split(':').map(s => s.trim());
      if (key === "Spot_id") data.spot_id = value;
      if (key === "Spot") data.spotName = value;
      if(key ==="Tickit_id") data.id = value
      
    });
  
    return data;
  };
  


  useEffect(() => {
    if (!scanResult) return;
  
    const parsedObject = parseQRTextToObject(scanResult);
    if (!parsedObject) return;
  
    const ticket = parking_tickets.find(ticket => 
      Number(ticket.spot_id) === Number(parsedObject.spot_id) && ticket.status === "active" && Number(ticket.id) === Number(parsedObject.id)
    );
  
    if (!ticket) return;
  
    const entryTime = new Date(ticket.entry_time);
    const now = new Date();
    const exitTimeStr = now.toISOString().slice(0, 16);
    const durationInHours = (now - entryTime) / (1000 * 60 * 60);
  
    const rate = pricing_rates.find(r => r.id === ticket.base_rate_id);
    const pricePerHour = rate ? rate.price_per_hour : 0;
  
    const updatedTicket = {
      ...ticket,
      exit_time: exitTimeStr,
      total_price: parseFloat((durationInHours * pricePerHour).toFixed(2)),
      spotName: parsedObject.spotName
    };
  
    if (!isEqual(updateTicketG, updatedTicket)) {
      setUpdateTicketG(updatedTicket);
    }
  }, [scanResult, parking_tickets, pricing_rates]);

  
  useEffect(() => {
    if (!updateTicketG || !employeeSpots) return;
    if(!user || !employes) return;
  
    const { spotName, ...ticketupdate } = updateTicketG;
    const spot = employeeSpots.find(spot => Number(spot.id) === Number(ticketupdate.spot_id));
    if (!spot) return;
  
    dispatch(updateParking_ticket({
      id: ticketupdate.id,
      updatedParking_ticket: { 
        ...ticketupdate, 
        status: 'completed',
      }
    }));
  
    dispatch(updateSpot({
      id: ticketupdate.spot_id,
      updatedSpot: { ...spot, status: "disponible" }
    }));
    if (user && employes.length > 0) {
      const employe_id = employes.find(employe => Number(employe.user_id) === Number(user.id))?.id;
      if (employe_id) {
         dispatch(getEmployeSpots(employe_id))
      }}
  }, [updateTicketG, employeeSpots, dispatch]);

  
  

  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex justify-center items-center">
    <div className="max-w-md mx-auto p-2 bg-base-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">QR Code Scanner</h1>

      {isScanning ? (
        <div className="overflow-hidden rounded-lg shadow-lg">
          
          <Scanner
            constraints={{deviceId: selectedDeviceId}}
            onScan={(result) => handleScan(result[0].rawValue)}
            onError={handleError}
          />
          {devices.length > 1 && (
            <div className="flex flex-col my-3 mx-2 gap-2">
              <select
                value={selectedDeviceId || ""}
                onChange={handleDeviceChange}
                className="select w-full"
              >
                {devices.map((device, index) => (
                  <option key={index} value={device.deviceId}>Selected:&nbsp;
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            <button onClick={onClose} className="btn btn-error w-full"><X size={18} />Close</button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Scan Result:</h2>
            {updateTicketG && (
              <div className="bg-gray-100 p-4 rounded-md mb-4 break-all">
                {/* <p className="text-xl font-bold text-center text-balance text-primary mb-4">
                  Merci pour votre parking dans le parc ParkEase
                </p> */}
                <p className="font-mono">Client: {updateTicketG.clientName}</p>
                <p className="font-mono">Spot: {updateTicketG.spotName}</p>
                <p className="font-mono">Entrée: {updateTicketG.entry_time}</p>
                <p className="font-mono">Sortie: {updateTicketG.exit_time}</p>
                <p className="font-mono">Total Price: {updateTicketG.total_price} MAD</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-between">
              <button onClick={resetScanner} className="btn btn-primary min-w-36"><RotateCcw size={18} />Scan Again</button>
              <button onClick={onClose} className="btn btn-error min-w-36"><X size={18} />Close</button>
            </div>
        </div>
      )}

      {isScanning && (
        <p className="text-center mt-4 text-gray-600">
          Position a QR code in front of your camera to scan it
        </p>
      )}
    </div>
    </div>
  );
  
}