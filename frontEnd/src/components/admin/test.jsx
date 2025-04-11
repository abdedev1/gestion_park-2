"use client"

import { useEffect, useState, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function QrScanner() {
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState(null)
  const [permissionGranted, setPermissionGranted] = useState(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    // Only initialize the scanner if it hasn't been created yet
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 10,
          rememberLastUsedCamera: true,
        },
        false, // Don't start scanning automatically
      )
    }

    return () => {
      // Clean up the scanner when component unmounts
      if (scannerRef.current) {
        try {
          scannerRef.current.clear()
        } catch (error) {
          console.error("Failed to clear scanner:", error)
        }
      }
    }
  }, [])

  const startScanner = () => {
    setError(null)

    // Check if camera permissions are available
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setPermissionGranted(true)

        if (scannerRef.current) {
          scannerRef.current.render(
            (result) => {
              // Success callback
              if (scannerRef.current) {
                scannerRef.current.clear()
              }
              setScanResult(result)
            },
            (err) => {
              // Error callback
              console.warn(err)
              if (err.name === "NotAllowedError") {
                setError("Camera access denied. Please allow camera access and try again.")
              } else if (err.name === "NotFoundError") {
                setError("No camera found on this device.")
              } else {
                setError(`Error: ${err.message || "Unknown error occurred"}`)
              }
            },
          )
        }
      })
      .catch((err) => {
        setPermissionGranted(false)
        if (err.name === "NotAllowedError") {
          setError("Camera access denied. Please allow camera access in your browser settings and try again.")
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.")
        } else {
          setError(`Error accessing camera: ${err.message}`)
        }
        console.error("Camera access error:", err)
      })
  }

  const resetScanner = () => {
    setScanResult(null)
    setError(null)
    startScanner()
  }

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-4 max-w-md p-4 border border-red-300 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {scanResult ? (
        <div className="text-center">
          <div className="mb-4 max-w-md p-4 border border-green-300 bg-green-50 rounded-md flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700">
              <span className="font-semibold">QR Code Scanned Successfully!</span>
            </p>
          </div>

          <div className="p-4 border rounded-md mb-4 max-w-md break-all">
            <p className="text-sm text-gray-500 mb-1">Scan Result:</p>
            <p className="font-mono">{scanResult}</p>
          </div>

          <button
            onClick={resetScanner}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Scan Another Code
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div id="reader" className="w-full max-w-md mb-4"></div>

          {permissionGranted === null && (
            <button
              onClick={startScanner}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Camera
            </button>
          )}

          {permissionGranted === false && (
            <div className="mt-4 text-center">
              <p className="text-red-500 mb-2">Camera access is required to scan QR codes.</p>
              <button
                onClick={startScanner}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
