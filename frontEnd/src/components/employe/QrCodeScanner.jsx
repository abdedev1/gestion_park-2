import { fetchParkingTickets,updateParkingTicket } from '../Redux/slices/parkingTicketsSlice';
import { useSelector,useDispatch } from "react-redux";
import { fetchPricingRates } from '../Redux/slices/pricingRatesSlice';
import isEqual from "lodash/isEqual";
import { RotateCcw, X } from "lucide-react";
import { updateSpot,getEmployeSpots  } from "../Redux/slices/spotsSlice";
import { fetchEmployes } from '../Redux/slices/employesSlice';
import { useEffect, useState,useRef } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import Cookies from "js-cookie";
export default function QRCodeScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const defaultDeviceId = Cookies.get('deviceId');
  const [selectedDeviceId, setSelectedDeviceId] = useState(defaultDeviceId || null);
  const [updateTicketG,setUpdateTicketG] =useState(null)
  const hasProcessed = useRef(false);

  const dispatch = useDispatch();
  const devices = useDevices();


  const { parkingTickets } = useSelector(state => state.parkingTickets);
  const { pricingRates } = useSelector(state => state.pricingRates);
  const employeeSpots = useSelector(state => state.spots.employeeSpots);
  const {employes} = useSelector(state=>state.employes) 
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
     dispatch(fetchParkingTickets())
     dispatch(fetchPricingRates());
     dispatch(fetchEmployes())
  },[dispatch])

  const handleScan = (result) => {
    if (!result?.[0]?.rawValue) return;
    setScanResult(result[0].rawValue);
    setIsScanning(false);
    Cookies.set('deviceId', selectedDeviceId, { expires: 30 });
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
    setUpdateTicketG(null);
    hasProcessed.current = false;
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
  


  const processScannedResult = async () => {
    if (hasProcessed.current || !scanResult) return;

    const parsedObject = parseQRTextToObject(scanResult);
    if (!parsedObject) return;

    const ticket = parkingTickets.find(ticket =>
      Number(ticket.spot_id) === Number(parsedObject.spot_id) &&
      ticket.status === "active" &&
      Number(ticket.id) === Number(parsedObject.id)
    );

    if (!ticket) return;

    const entryTime = new Date(ticket.entry_time);
    const now = new Date();
    const exitTimeStr = now.toISOString().slice(0, 16);
    const durationInHours = (now - entryTime) / (1000 * 60 * 60);

    const rate = pricingRates.find(r => r.id === ticket.base_rate_id);
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

    const spot = employeeSpots.find(s => Number(s.id) === Number(ticket.spot_id));
    if (!spot) return;

    await dispatch(updateParkingTicket({
      id: ticket.id,
      updatedParkingTicket: {
        ...updatedTicket,
        status: 'completed'
      }
    }));

    await dispatch(updateSpot({
      id: ticket.spot_id,
      updatedSpot: { ...spot, status: "available" }
    }));

    if (user && employes.length > 0) {
      const employe_id = employes.find(emp => Number(emp.user_id) === Number(user.id))?.id;
      if (employe_id) {
        dispatch(getEmployeSpots(employe_id));
      }
    }

    hasProcessed.current = true;
  };

  useEffect(() => {
    processScannedResult();
  }, [scanResult]);
  
  

  return (
    <div className="max-w-md bg-base-100">

      {isScanning ? (
        <div className="overflow-hidden p-2 rounded-lg">
          
          <Scanner
            constraints={{deviceId: selectedDeviceId}}
            onScan={handleScan}
            onError={handleError}
          />
          {devices.length > 1  && (
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
            
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Scan Result:</h2>
            {updateTicketG && (
              <div className="bg-gray-100 p-4 rounded-md mb-4 break-all">
                
                <p className="font-mono">Client: {updateTicketG.clientName}</p>
                <p className="font-mono">Spot: {updateTicketG.spotName}</p>
                <p className="font-mono">Entrée: {updateTicketG.entry_time}</p>
                <p className="font-mono">Sortie: {updateTicketG.exit_time}</p>
                <p className="font-mono">Total Price: {updateTicketG.total_price} MAD</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-between">
              <button onClick={resetScanner} className="btn btn-primary min-w-36"><RotateCcw size={18} />Scan Again</button>
            </div>
        </div>
      )}

      {isScanning && (
        <p className="text-center mt-4 text-gray-600">
          Position a QR code in front of your camera to scan it
        </p>
      )}
    </div>
  );
  
}