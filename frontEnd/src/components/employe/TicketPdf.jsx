import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

export const generateQRBase64 = async (text) => {
  try {
    return await QRCode.toDataURL(text, { margin: 2 });
  } catch (err) {
    console.error("QR Error", err);
    return null;
  }
};

export const generateTicketPDF = async (formData, selectedSpot, pricePerHour) => {
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

  page.drawText("Ticket de Stationnement", {
    x: width / 2 - 100,
    y: height - 135,
    size: 18,
    font,
    color: rgb(0, 0, 0.6),
  });

  const drawLine = (label, value, yOffset) => {
    page.drawText(`${label}: ${value}`, {
      x: 40,
      y: height - 180 - yOffset,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  };

  drawLine("Client", formData.clientName, 0);
  drawLine("Prix / Heure", `${pricePerHour} MAD`, 35);
  drawLine("Spot", selectedSpot.nom, 70);
  drawLine("Entrée", new Date(formData.entry_time).toLocaleString(), 105);

  const qrData = `Client: ${formData.clientName}, Spot: ${selectedSpot.nom}, Entrée: ${formData.entry_time},Spot_id : ${formData.spot_id},Tickit_id:${formData.id}`;
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
  link.download = `ticket-${selectedSpot.nom}.pdf`;
  link.click();
};
