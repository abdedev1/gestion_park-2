import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QRCodeScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' (back) or 'user' (front)

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

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">QR Code Scanner</h1>

      {isScanning ? (
        <div className="overflow-hidden rounded-lg shadow-lg">
          <Scanner
          onScan={(result) => handleScan(result[0].rawValue)}
          onError={handleError}
          />
          <div className="flex justify-center mt-4">
            <button
              onClick={toggleCamera}
              className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
            >
              Switch Camera ({facingMode === "environment" ? "Front" : "Back"})
            </button>
          </div>
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