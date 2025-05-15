import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import dayjs from "dayjs";

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
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 14;

  // Draw border and background
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 2,
    color: rgb(0.98, 0.98, 0.98),
  });

  // Logo
  const logoUrl = "/Logo/logo.png";
  const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const scaledLogoDims = logoImage.scale(0.10);
  const marginTop = 20; // Adjust the margin top as needed
  page.drawImage(logoImage, {
    x: width / 2 - scaledLogoDims.width / 2,
    y: height - 80 - marginTop,
    width: scaledLogoDims.width,
    height: scaledLogoDims.height,
  });

  // Title
  const title = "Parking Ticket";
  page.drawText(title, {
    x: width / 2 - fontBold.widthOfTextAtSize(title, 18) / 2,
    y: height - 120,
    size: 18,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.5),
  });

  // Separator
  page.drawLine({
    start: { x: 40, y: height - 130 },
    end: { x: width - 40, y: height - 130 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Info lines
  const drawLine = (label, value, yOffset) => {
    page.drawText(`${label}:`, {
      x: 50,
      y: height - 160 - yOffset,
      size: fontSize,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(`${value}`, {
      x: 170,
      y: height - 160 - yOffset,
      size: fontSize,
      font: fontRegular,
      color: rgb(0.1, 0.1, 0.1),
    });
  };

  drawLine("Client", formData.clientName, 0);
  drawLine("Price / Hour", `${pricePerHour} MAD`, 30);
  drawLine("Spot", selectedSpot.name, 60);
  drawLine("Entry", new Date(formData.entry_time).toLocaleString(), 90);

  // Another separator
  page.drawLine({
    start: { x: 40, y: height - 270 },
    end: { x: width - 40, y: height - 270 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // QR Code
  const qrData = `Client: ${formData.clientName}, Spot: ${selectedSpot.name}, Entrée: ${formData.entry_time},Spot_id : ${formData.spot_id},Tickit_id:${formData.id}`;
  const qrBase64 = await generateQRBase64(qrData);
  const qrImageBytes = await fetch(qrBase64).then(res => res.arrayBuffer());
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrDims = qrImage.scale(1.0);

  page.drawImage(qrImage, {
    x: width / 2 - qrDims.width / 2,
    y: 60,
    width: qrDims.width,
    height: qrDims.height,
  });

  // Footer
  const footer = "Thank you for using our service!";
  page.drawText(footer, {
    x: width / 2 - fontRegular.widthOfTextAtSize(footer, 12) / 2,
    y: 30,
    size: 12,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ticket-${selectedSpot.name}.pdf`;
  link.click();
};




export const generateCartPDF = async (cart, clientName, rateName) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([324, 204]);
  const { width, height } = page.getSize();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background image
  const bgUrl = "/Logo/backgroundcart.jpg"; 
  const userImageUrl = "/Logo/person.png";
  const bgBytes = await fetch(bgUrl).then(res => res.arrayBuffer());
  const bgImage = await pdfDoc.embedJpg(bgBytes);
  page.drawImage(bgImage, {
    x: 0,
    y: 0,
    width,
    height,
  });

  // Logo above title background (centered)
  const logoUrl = "/Logo/logo.png";
  const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoHeight = 28;
  const logoDims = logoImage.scale(logoHeight / logoImage.height);
  const logoX = width - logoDims.width - 20;
  const logoY = height - 45;
  page.drawImage(logoImage, {
    x: logoX,
    y: logoY,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Title background (below logo)
  const titleBgHeight = 30;
  const titleBgWidth = width - 130;
  const titleBgX = 0;
  const titleBgY = height - 45;
  const borderRadius = 8;
  page.drawRectangle({
    x: titleBgX,
    y: titleBgY,
    width: titleBgWidth,
    height: titleBgHeight,
    color: rgb(0.082, 0.365, 0.988), // #155dfc
    borderRadius,
  });

  // Title text
  const title = "Subscription Card";
  const titleFontSize = 18;
  const titleTextX = titleBgX + 20;
  const titleTextY = titleBgY + 8;
  page.drawText(title, {
    x: titleTextX,
    y: titleTextY,
    size: titleFontSize,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // User image (left, below title) - increased size
  const userImgBytes = await fetch(userImageUrl).then(res => res.arrayBuffer());
  const userImg = await pdfDoc.embedPng(userImgBytes);
  const userImgSize = 60; // Increased size
  const userImgDims = userImg.scale(userImgSize / userImg.height);
  const userImgX = 5;
  const userImgY = titleBgY - userImgDims.height - 20;
  page.drawImage(userImg, {
    x: userImgX,
    y: userImgY,
    width: userImgDims.width,
    height: userImgDims.height,
  });

  // Info (right of user image)
  const infoX = userImgX + userImgDims.width + 15;
  const infoY = userImgY + userImgDims.height - 17;
  page.drawText(`Client: ${clientName}`, { x: infoX, y: infoY, size: 14, font: fontBold, color: rgb(0,0,0) });
  const expiry = dayjs().add(cart.duration, "month").format("YYYY-MM-DD");
  page.drawText(`Expiry: ${expiry}`, { x: infoX, y: infoY - 18, size: 12, font: fontRegular, color: rgb(0,0,0) });
  page.drawText(`Rate: ${rateName}`, { x: infoX, y: infoY - 34, size: 12, font: fontRegular, color: rgb(0,0,0) });
  const fontSize = 9;
  const lineHeight = 12;
  const maxLineWidth = 250;
  const disclaimer = 'This card is strictly personal and must not be used by anyone except the person named on it.';
  const disclaimerLines = disclaimer.split(' ').reduce((lines, word) => {
    const currentLine = lines[lines.length - 1];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (fontRegular.widthOfTextAtSize(testLine, fontSize) > maxLineWidth) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = testLine;
    }
    return lines;
  }, ['']);

  disclaimerLines.forEach((line, index) => {
    page.drawText(line, {
      x: 10,
      y: 40 - index * lineHeight,
      size: fontSize,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
  });


  // QR code with only client_id
  const qrData = `client_id:${cart.client_id}`;
  const qrBase64 = await generateQRBase64(qrData);
  const qrImageBytes = await fetch(qrBase64).then(res => res.arrayBuffer());
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrDims = qrImage.scale(0.5);
  page.drawImage(qrImage, {
    x: width - qrDims.width - 5,
    y: 30,
    width: qrDims.width,
    height: qrDims.height,
  });

  
  // Footer image
  const footerImgUrl = "/Logo/footer.png";
  const footerImgBytes = await fetch(footerImgUrl).then(res => res.arrayBuffer());
  const footerImg = await pdfDoc.embedPng(footerImgBytes);
  const footerImgDims = footerImg.scale(width / footerImg.width);
  page.drawImage(footerImg, {
    x: 0,
    y: 0,
    width: width,
    height: footerImgDims.height,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cart-${clientName}.pdf`;
  link.click();
};