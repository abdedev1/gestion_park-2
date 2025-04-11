import React, { useState } from 'react';
import { NavLink, Link, Outlet } from "react-router-dom";
import { Menu, X, Bell, ScanLine } from "lucide-react";
import ScanerQrCode from './ScanerQrCode';
import Footer from './Footer';
function HeaderEmploye() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSc, setIsOpenSc] = useState(false);
    const navLinkClass = ({ isActive }) =>
        `px-3 py-2 transition duration-200 ${
          isActive
            ? "text-blue-500 border-b-2 border-blue-500 pb-5.5"
            : "text-gray-700 hover:text-blue-500 hover:border-b-2 pb-5.5 "
        }`;
    return (
        <div className="h-screen flex flex-col">
            <header className="h-16  text-black  flex items-center justify-between px-6 shadow-md z-200">
                <div className='flex items-center gap-16'>
                    <NavLink ><img className='h-12' src="/Logo/logo.png" alt="" /></NavLink>
                    <nav className="space-x-10">
                        <NavLink className={navLinkClass}>Overview</NavLink>
                    </nav>
                </div>
                <div className="flex items-center gap-5">
                    <button className="p-2  text-black rounded-md " aria-label="Open Scan" onClick={() => setIsOpenSc(true)}>
                        <ScanLine  size={24} />
                    </button>
                    <button className="p-2  text-black rounded-md " aria-label="Open Notfication" onClick={() => setIsOpen(true)}>
                        <Bell size={24} />
                    </button>
                    <button className="p-2  text-black rounded-md " aria-label="Open Menu" onClick={() => setIsOpen(true)}>
                        
                        <Menu size={24} />
                    </button>
                </div>
            </header>
            {/*Main*/}
            {<Outlet/>}

            {/* SiderBar Menu */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-300 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={() => setIsOpen(false)}
            />

            <aside
                className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 transform transition-transform z-500 ${
                    isOpen ? "-translate-x-0" : "translate-x-full"
                }`}
            >
                <button
                    className="absolute top-4 right-4 p-2  text-black rounded-md"
                    onClick={() => setIsOpen(false)}
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-black">Menu</h2>
                <ul>
                    <li className="p-2 hover:bg-gray-700 hover:text-white rounded ">
                        <Link to="/admin/SettingsAdmin">Setting</Link>
                    </li>
                </ul>
            </aside>
            {isOpenSc && <ScanerQrCode/>}
        </div>
        
    );
}

export default HeaderEmploye;