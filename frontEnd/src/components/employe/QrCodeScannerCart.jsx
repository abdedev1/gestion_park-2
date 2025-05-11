import { useState } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";

export default function QrCodeScannerCart({ onScanResult, onClose }) {
  const [isScanning, setIsScanning] = useState(true);
  const devices = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.deviceId || "");

  const handleScan = (result) => {
    if (!result?.[0]?.rawValue) return;
    
    setIsScanning(false);

    // Parse la valeur scannée (ex: "client_id:2") en objet { client_id: 2 }
    let parsed = result[0].rawValue;
    if (typeof parsed === "string" && parsed.includes(":")) {
        const [key, value] = parsed.split(":");
        parsed = { [key.trim()]: Number(value.trim()) };
    }

    if (onScanResult) {
      onScanResult(parsed);
    }
    if (onClose) onClose();
};

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  return (
    <>
      {isScanning && (
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
      )}
    </>
  );
}