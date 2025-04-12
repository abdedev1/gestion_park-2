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
        }`;

    const handleScanClick = () => {
        setShowScanner(!showScanner);
    };

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

    return (
        <div className="h-screen flex flex-col">
            <header className="h-16 text-black flex items-center justify-between px-6 shadow-md">
                <div className="flex items-center gap-16">
                    <NavLink><img className="h-12" src="/Logo/logo.png" alt="" /></NavLink>
                    <nav className="space-x-10">
                        <NavLink className={navLinkClass}>Overview</NavLink>
                    </nav>
                </div>
                <div className="flex items-center gap-5">
                    <button className="p-2 text-black rounded-md" aria-label="Open Scan" onClick={handleScanClick}>
                        <ScanLine size={24} />
                    </button>
                    <button className="p-2 text-black rounded-md" aria-label="Open Notification" onClick={() => setIsOpen(true)}>
                        <Bell size={24} />
                    </button>
                    <button className="p-2 text-black rounded-md" aria-label="Open Menu" onClick={() => setIsOpen(true)}>
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* Main */}
            {<Outlet />}

            {/* Sidebar Menu */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={() => setIsOpen(false)}
            />

            <aside
                className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 transform transition-transform ${
                    isOpen ? "-translate-x-0" : "translate-x-full"
                }`}
            >
                <button
                    className="absolute top-4 right-4 p-2 text-black rounded-md"
                    onClick={() => setIsOpen(false)}
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-black">Menu</h2>
                <ul>
                    <li className="p-2 hover:bg-gray-700 hover:text-white rounded">
                        <Link to="/admin/SettingsAdmin">Setting</Link>
                    </li>
                </ul>
            </aside>

            {/* Show scanner when button is clicked */}
            {showScanner && (
                <div className="scanner-container">
                    <div id="reader" />
                </div>
            )}

            {/* Show scanned result */}
            {barcode && (
                <div>
                    <h3>Scanned QR Code:</h3>
                    <p>{barcode}</p>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default HeaderEmploye;