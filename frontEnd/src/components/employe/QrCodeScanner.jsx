import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { fetchParking_tickets } from '../Redux/Reducer/parkingTicketsSlice';
import { useSelector,useDispatch } from "react-redux";
import { fetchPricing_rates } from '../Redux/Reducer/pracingRatesSlice';
import isEqual from "lodash/isEqual";
import { RotateCcw, X,Repeat } from "lucide-react";
import { updateParking_ticket } from "../Redux/Reducer/parkingTicketsSlice";
import { updateSpot } from "../Redux/Reducer/spotsSlice";
import { fetchEmployes } from '../Redux/Reducer/employesSlice';
import { getEmployeSpots } from "../Redux/Reducer/spotsSlice";
export default function QRCodeScanner({ openModel, onClose }) {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' (back) or 'user' (front)
  const { parking_tickets } = useSelector(state => state.parking_tickets);
  const { pricing_rates } = useSelector(state => state.pricing_rates);
  const employeeSpots = useSelector(state => state.spots.employeeSpots);
  const [updateTicketG,setUpdateTicketG] =useState(null)
  const {employes} = useSelector(state=>state.employes) 
  const dispatch = useDispatch();
  const { user, token} = useSelector((state) => state.auth);
  
  useEffect(()=>{
     dispatch(fetchParking_tickets())
     dispatch(fetchPricing_rates());
     dispatch(fetchEmployes())
  },[dispatch])
  const handleScan = (result) => {
    setScanResult(result);
    setIsScanning(false);
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };
  const parseQRTextToObject = (text) => {
    if (!text || typeof text !== 'string') return null;
  
    const parts = text.split(',').map(part => part.trim());
    const data = {};
  
    parts.forEach(part => {
      const [key, value] = part.split(':').map(s => s.trim());
      if (key === "Spot_id") data.spot_id = value;
      if (key === "Spot") data.spotName = value;
      if(key ==="Tickit_id") data.id =value
      
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
    <div className="fixed inset-0 bg-black bg-opacity-0.5 flex justify-center items-center">
    <div className="max-w-md mx-auto p-4 ">
      <h1 className="text-2xl font-bold text-center mb-6">QR Code Scanner</h1>

      {isScanning ? (
        <div className="overflow-hidden rounded-lg shadow-lg">
          
          <Scanner
          onScan={(result) => handleScan(result[0].rawValue)}
          onError={handleError}
          />
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={toggleCamera}
              className="flex items-center gap-2 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
            >
              <Repeat size={18} />
              Switch Camera ({facingMode === "environment" ? "Front" : "Back"})
            </button>

            <button
              onClick={onClose} 
              className="flex items-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
            >
              <X size={18} />
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Scan Result:</h2>
            {updateTicketG && (
              <div className="bg-gray-100 p-4 rounded-md mb-4 break-all">
                <h1 className="text-xl font-bold text-center text-blue-600 mb-4">
                  Merci pour votre parking dans le parc ParkEase
                </h1>
                <p className="font-mono">Client: {updateTicketG.clientName}</p>
                <p className="font-mono">Spot: {updateTicketG.spotName}</p>
                <p className="font-mono">Entrée: {updateTicketG.entry_time}</p>
                <p className="font-mono">Sortie: {updateTicketG.exit_time}</p>
                <p className="font-mono">Total Price: {updateTicketG.total_price} MAD</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={resetScanner}
                className="flex items-center justify-center gap-2 flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
              >
                <RotateCcw size={18} />
                Scan Again
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
              >
                <X size={18} />
                Close
              </button>
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