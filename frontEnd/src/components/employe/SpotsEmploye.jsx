import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployeSpots } from '../Redux/slices/spotsSlice';
import { fetchEmployes } from '../Redux/slices/employesSlice';
import { fetchPricingRates } from '../Redux/slices/pricingRatesSlice';
import { addParkingTicket, fetchParkingTickets } from '../Redux/slices/parkingTicketsSlice';
import { updateSpot } from '../Redux/slices/spotsSlice';
import { FloatButton } from 'antd';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from "react-qr-code";
import { ScanLine } from 'lucide-react';
import QRCodeScanner from './QrCodeScanner';
import { FaCar, FaChargingStation, FaWheelchair } from 'react-icons/fa';
import isEqual from "lodash/isEqual";
import { useRemover } from '../../lib/utils';

export default function SpotsEmployee() {
    const employeeSpots = useSelector(state => state.spots.employeeSpots);
    const { pricingRates } = useSelector(state => state.pricingRates);
    const [showScanner, setShowScanner] = useState(false);
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const { employees } = useSelector(state => state.employees);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [employeeIdStock, setEmployeeIdStock] = useState(null);
    const [formData, setFormData] = useState({
        clientName: '',
        spot_id: '',
        client_id: null,
        base_rate_id: null,
        entry_time: '',
        exit_time: null,
        total_price: 0,
        status: null
    });

    useEffect(() => {
        dispatch(fetchPricingRates());
        dispatch(fetchParkingTickets());
        dispatch(fetchEmployes());
    }, [dispatch]);

    useEffect(() => {
        if (user && employees.length > 0) {
            const employee_id = employees.find(employee => Number(employee.user_id) === Number(user.id))?.id;
            if (employee_id) {
                dispatch(getEmployeSpots(employee_id));
                if (!isEqual(employee_id, employeeIdStock)) {
                    setEmployeeIdStock(employee_id);
                }
            }
        }
    }, [user, employees, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleSpotClick = (spot) => {
        setSelectedSpot(spot);
        if (spot.status === "available") {
            setFormData({
                clientName: '',
                spot_id: spot.id,
                client_id: null,
                base_rate_id: pricingRates[0]?.id,
                entry_time: new Date().toISOString().slice(0, 16),
                exit_time: null,
                total_price: 0,
                status: "active"
            });
            setIsModalOpen(true);
        }
    };

    const generateQRBase64 = (text) => {
        return new Promise((resolve) => {
            const qr = (
                <QRCode
                    value={text}
                    size={128}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                />
            );

            const container = document.createElement("div");
            document.body.appendChild(container);

            import("react-dom/client").then((ReactDOM) => {
                const root = ReactDOM.createRoot(container);
                root.render(qr);

                setTimeout(() => {
                    const svg = container.querySelector("svg");
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    const svgData = new XMLSerializer().serializeToString(svg);
                    const img = new Image();
                    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
                    const url = URL.createObjectURL(svgBlob);

                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        const pngBase64 = canvas.toDataURL("image/png");
                        URL.revokeObjectURL(url);
                        document.body.removeChild(container);
                        resolve(pngBase64);
                    };

                    img.src = url;
                }, 100);
            });
        });
    };

    const generateTicketPDF = async (formData, selectedSpot, pricePerHour) => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([400, 500]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const fontSize = 14;

        const logoUrl = "/Logo/logo.png";
        const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.3);
        page.drawImage(logoImage, {
            x: width / 2 - logoDims.width / 2,
            y: height - 100,
            width: logoDims.width,
            height: logoDims.height,
        });

        page.drawText("Reservation Ticket", {
            x: width / 2 - 100,
            y: height - 135,
            size: 18,
            font,
            color: rgb(0, 0, 0.6),
        });

        const startY = height - 180;
        const lineHeight = 35;

        const drawLine = (label, value, yOffset) => {
            page.drawText(`${label}: ${value}`, {
                x: 40,
                y: startY - yOffset,
                size: fontSize,
                font,
                color: rgb(0.2, 0.2, 0.2),
            });
        };

        drawLine("Client", formData.clientName, 0);
        drawLine("Price / Hour", `${pricePerHour} MAD`, lineHeight);
        drawLine("Spot", selectedSpot.name, lineHeight * 2);
        drawLine("Entry", new Date(formData.entry_time).toLocaleString(), lineHeight * 3);

        const qrData = `Client: ${formData.clientName}, Spot: ${selectedSpot.name}, Entry: ${formData.entry_time}, Spot_id: ${formData.spot_id}, Ticket_id: ${formData.id}`;
        const qrBase64 = await generateQRBase64(qrData);
        const qrImageBytes = await fetch(qrBase64).then(res => res.arrayBuffer());
        const qrImage = await pdfDoc.embedPng(qrImageBytes);

        const qrDims = qrImage.scale(1.0);
        page.drawImage(qrImage, {
            x: width / 2 - qrDims.width / 2,
            y: 40,
            width: qrDims.width,
            height: qrDims.height,
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${selectedSpot.name}.pdf`;
        link.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSpot) {
            const pricePerHour = pricingRates.find(r => r.id === formData.base_rate_id)?.price_per_hour || 0;

            if (selectedSpot.status === "available") {
                const resultAction = await dispatch(addParkingTicket(formData));

                if (addParkingTicket.fulfilled.match(resultAction)) {
                    const newTicket = resultAction.payload;
                    const ticketId = newTicket.id;

                    setFormData(prev => ({
                        ...prev,
                        id: ticketId
                    }));

                    await dispatch(updateSpot({
                        id: formData.spot_id,
                        updatedSpot: { ...selectedSpot, status: "reserved" }
                    }));

                    if (employeeIdStock) {
                        dispatch(getEmployeSpots(employeeIdStock));
                    }

                    await generateTicketPDF({ ...formData, id: ticketId }, selectedSpot, pricePerHour);

                    setIsModalOpen(false);
                }
            }
        }
    };

    return (
        <div>
            <FloatButton
                shape="circle"
                type="primary"
                style={{
                    insetInlineEnd: 74,
                }}
                icon={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }}>
                        <ScanLine size={50} />
                    </div>
                } onClick={() => setShowScanner(true)} />
            {employeeSpots && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2 p-4 bg-white rounded">
                    {employeeSpots.map(spot => (
                        <button
                            key={spot.id}
                            onClick={() => handleSpotClick(spot)}
                            className={`text-center py-2 px-3 rounded border font-medium text-sm w-full flex items-center justify-center
                                    ${spot.status === "reserved"
                                    ? 'bg-gray-800 text-white'
                                    : spot.status === "available"
                                        ? 'bg-white text-black border-gray-300 hover:bg-gray-500'
                                        : 'bg-gray-300 text-gray-600'
                                }`}
                        >
                            {spot.type === 'accessible' && (
                                <FaWheelchair className="w-6 h-6 text-blue-600 mb-1 mr-4" />
                            )}
                            {spot.type === 'electric' && (
                                <FaChargingStation className="w-6 h-6 text-green-600 mb-1 mr-4" />
                            )}
                            {spot.type === 'standard' && (
                                <FaCar className="w-6 h-6 text-gray-600 mb-1 mr-4" />
                            )}

                            {spot.name}
                        </button>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center" onClick={() => setIsModalOpen(false)} >
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">
                            {selectedSpot?.status === "available"
                                ? "Spot Reservation"
                                : "Spot Release"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="clientName" className="block text-sm font-medium">
                                    Client Name
                                </label>
                                <input
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    required={selectedSpot?.status === "available"}
                                    disabled={selectedSpot?.status === "reserved"}
                                    className={`w-full px-3 py-2 border rounded ${
                                        selectedSpot?.status === "reserved"
                                            ? "bg-gray-200"
                                            : "border-gray-300"
                                        }`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium">
                                        Type
                                    </label>
                                    <input
                                        type="text"
                                        id="type"
                                        name="type"
                                        value={selectedSpot?.type || ''}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium">
                                        Price Per Hour
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={
                                            pricingRates.find(r => r.id === formData.base_rate_id)?.price_per_hour || 0
                                        }
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="spotName" className="block text-sm font-medium">
                                        Spot Name
                                    </label>
                                    <input
                                        type="text"
                                        id="spotName"
                                        name="spotName"
                                        value={selectedSpot?.name || ''}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="entry_time" className="block text-sm font-medium">
                                        Entry Date and Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="entry_time"
                                        name="entry_time"
                                        value={formData.entry_time}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            </div>

                            {selectedSpot?.status === "reserved" && (
                                <div>
                                    <label htmlFor="exit_time" className="block text-sm font-medium">
                                        Exit Date and Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="exit_time"
                                        name="exit_time"
                                        value={formData.exit_time || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                    />
                                </div>
                            )}

                            {formData.exit_time && (
                                <div>
                                    <label htmlFor="total_price" className="block text-sm font-medium">
                                        Total Price
                                    </label>
                                    <input
                                        type="number"
                                        id="total_price"
                                        name="total_price"
                                        value={formData.total_price}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200"
                                    />
                                </div>
                            )}

                            <div className="mt-6 flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    {selectedSpot?.status === "available" ? 'Confirm' : 'Finish'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showScanner && <QRCodeScanner openModel={showScanner} onClose={() => setShowScanner(false)} />}
        </div>
    );
}
