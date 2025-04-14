import QRCodeScanner from "./QrCodeScanner"

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <QRCodeScanner />
    </main>
  )
}
