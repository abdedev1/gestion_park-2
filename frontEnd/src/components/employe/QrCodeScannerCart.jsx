import { useState } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { RotateCcw } from "lucide-react";

export default function QrCodeScannerCart({ onScanResult, onClose }) {
  const [isScanning, setIsScanning] = useState(true);
  const devices = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.deviceId || "");

  const handleScan = (result) => {
    if (!result?.[0]?.rawValue) return;
    
    setIsScanning(false);

    let parsed = result[0].rawValue;
    if (typeof parsed === "string" && parsed.includes(":")) {
        const [key, value] = parsed.split(":");
        parsed = { [key.trim()]: Number(value.trim()) };
    }

    if (onScanResult) {
      onScanResult(parsed);
    }
    if (onClose) {
      onClose()
    }
};

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

    const resetScanner = () => {
    setIsScanning(true);
  };

  return (
    <>
      {isScanning ? (
        <>
          <Scanner
            constraints={{ deviceId: selectedDeviceId }}
            onScan={handleScan}
            onError={handleError}
          />
          {devices.length > 1 && (
            <select value={selectedDeviceId} onChange={handleDeviceChange}>
              {devices.map((device, idx) => (
                <option key={idx} value={device.deviceId}>
                  {device.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          )}
        </>
      ) : <div className="flex justify-center bg-black items-center h-96 m-4">
            <button onClick={resetScanner} className="btn btn-primary min-w-36"><RotateCcw size={18} />Scan Again</button>
          </div>
        }
    </>
  );
}