"use client"

import { useEffect, useRef } from "react"

export default function QrScanner({ onScan, onError }) {
  const containerRef = useRef(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    // Dynamically import the HTML5QrCode library to avoid SSR issues
    const loadScanner = async () => {
      try {
        // Only import the library on the client side
        const { Html5Qrcode } = await import("html5-qrcode")

        if (containerRef.current && !scannerRef.current) {
          const scannerId = "qr-reader"

          // Create container for scanner if it doesn't exist
          let scannerContainer = containerRef.current.querySelector(`#${scannerId}`)
          if (!scannerContainer) {
            scannerContainer = document.createElement("div")
            scannerContainer.id = scannerId
            containerRef.current.appendChild(scannerContainer)
          }

          // Initialize scanner
          const html5QrCode = new Html5Qrcode(scannerId)
          scannerRef.current = html5QrCode

          // Start scanner
          const config = { fps: 10, qrbox: { width: 250, height: 250 } }

          html5QrCode
            .start(
              { facingMode: "environment" },
              config,
              (decodedText) => {
                onScan(decodedText)
              },
              (errorMessage) => {
                // Ignore frequent errors about not finding QR code
                if (typeof errorMessage === "string" && errorMessage.includes("No QR code found")) {
                  return
                }
                console.warn("QR Scanner warning:", errorMessage)
              },
            )
            .catch((err) => {
              console.error("Failed to start scanner:", err)
              onError(err)
            })
        }
      } catch (err) {
        console.error("Error loading QR scanner:", err)
        onError(err)
      }
    }

    loadScanner()

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch((err) => console.error("Error stopping scanner:", err))
        scannerRef.current = null
      }
    }
  }, [onScan, onError])

  return <div ref={containerRef} className="w-full h-full" />
}
