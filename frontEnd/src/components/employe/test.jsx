import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet } from "react-router-dom";
import { Menu, X, Bell, ScanLine } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Footer from './Footer';
import { useSelector } from 'react-redux';

function HeaderEmploye() {
    const { isLoading } = useSelector(state => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [barcode, setBarcode] = useState('');

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 transition duration-200 ${
      isActive
        ? "text-blue-500 border-b-2 border-blue-500 pb-5.5"
        : "text-gray-700 hover:text-blue-500 hover:border-b-2 pb-5.5 "
    }`

  const handleScanClick = () => {
    setShowScanner(!showScanner)
    setBarcode("") // Clear previous scan results when opening scanner
  }

<<<<<<< HEAD
  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      })

      scanner.render(
        (decodedText) => {
          setBarcode(decodedText) // Store the scanned QR code
          scanner.clear() // Stop the scanner after a successful scan
          setShowScanner(false)
        },
        (error) => {
          console.error(`Error scanning: ${error}`)
        },
      )
=======
    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } });
            scanner.render(
                (decodedText) => {
                    setBarcode(decodedText); // Store the scanned QR code
                    scanner.clear(); // Stop the scanner after a successful scan
                    setShowScanner(false);
                },
                (error) => {
                    console.error(`Error scanning: ${error}`);
                }
            );

            return () => scanner.clear(); // Cleanup on component unmount
        }
    }, [showScanner]);
    if (isLoading) {
        return (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        );
    }
>>>>>>> d02b0e08dd95218169b9e10ce2a5c70863ce0b4b

      return () => scanner.clear() // Cleanup on component unmount
    }
  }, [showScanner])

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 text-black flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-16">
          <NavLink to="/">
            <img className="h-12" src="/Logo/logo.png" alt="Logo" />
          </NavLink>
          <nav className="space-x-10">
            <NavLink to="/overview" className={navLinkClass}>
              Overview
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <button
            className={`p-2 rounded-md ${showScanner ? "bg-blue-500 text-white" : "text-black"}`}
            aria-label="Open Scan"
            onClick={handleScanClick}
          >
            <ScanLine size={24} />
          </button>
          <button className="p-2 text-black rounded-md" aria-label="Open Notification">
            <Bell size={24} />
          </button>
          <button className="p-2 text-black rounded-md" aria-label="Open Menu" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow">{<Outlet />}</main>

      {/* Sidebar Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 transform transition-transform z-50 ${
          isOpen ? "-translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="absolute top-4 right-4 p-2 text-black rounded-md" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Menu</h2>
        <ul>
          <li className="p-2 hover:bg-gray-100 rounded transition-colors">
            <Link to="/admin/SettingsAdmin" className="block text-gray-700 hover:text-blue-500">
              Settings
            </Link>
          </li>
        </ul>
      </aside>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Scan QR Code</h3>
              <button onClick={() => setShowScanner(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">Position the QR code within the scanning area below</p>

            <div className="scanner-container border-2 border-dashed border-blue-500 rounded-lg p-2 mb-4">
              <div id="reader" className="w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Show scanned result */}
      {barcode && (
        <div className="fixed bottom-16 left-0 right-0 bg-green-100 p-4 border-t border-green-200 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-green-800">Successfully Scanned:</h3>
            <p className="text-gray-700">{barcode}</p>
          </div>
          <button onClick={() => setBarcode("")} className="p-1 rounded-full hover:bg-green-200">
            <X size={20} />
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default HeaderEmploye
