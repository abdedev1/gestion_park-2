import { useEffect, useState } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import Cookies from "js-cookie";

export default function QRCodeScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const devices = useDevices();
  const defaultDeviceId = Cookies.get('deviceId');

  // Set default camera on first load
  useEffect(() => {
    setSelectedDeviceId(defaultDeviceId || null);
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].deviceId);
    }
  }, [devices]);

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

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">QR Code Scanner</h1>

      {isScanning ? (
        <div className="overflow-hidden rounded-lg shadow-lg">
          <Scanner
            constraints={{
              deviceId: selectedDeviceId,
            }}
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
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Scan Result:</h2>
          <div className="bg-gray-100 p-4 rounded-md mb-4 break-all">
            <p className="font-mono">{scanResult}</p>
          </div>
          <button
            onClick={resetScanner}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Scan Again
          </button>
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