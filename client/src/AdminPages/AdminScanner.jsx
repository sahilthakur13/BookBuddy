import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast from 'react-hot-toast';
import { tickedVerification } from "../api/axios";

const AdminScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Only initialize scanner if we are actively in scanning state
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText) {
  
      // Immediately clear and unmount camera to freeze scanning state
      scanner.clear()
        .then(() => {
          setIsScanning(false);
          handleTicketVerification(decodedText);
        })
        .catch(err => console.error("Error clearing scanner on success:", err));
    }

    function onScanFailure(error) {
      // CRITICAL FIX: Do NOT use toast.error here. 
      // This function executes 10 times a second if no QR is in frame.
      console.warn("Searching for QR...");
    }

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner on unmount", err));
    };

  }, [isScanning]);

  const handleTicketVerification = async (qrRawText) => {
  // 1. Create a loading toast and save its reference ID
  const toastId = toast.loading("Checking ticket verification status...");
  

  try {

    const parsedData = JSON.parse(qrRawText);
    

    if (!parsedData.ticketNumber || !parsedData.bookingId) {
      throw new Error("QR layout missing required validation tokens.");
    }
    
    const verificationData = {
      ticketNumber: parsedData.ticketNumber,
      bookingId: parsedData.bookingId
    };


    const response = await tickedVerification(verificationData);
    const result = response.data; 
  
    if (response.status === 200 || result.success) {
      toast.success(result.message || "Ticket Verified! Access Granted.", { id: toastId, duration: 5000 });
      setScanResult(result.ticketDetails);
    } else {
      toast.error(result.message || "Invalid Ticket Verification.", { id: toastId, duration: 6000 });
    }

  } catch (err) {
    console.error(err);
    
    // 3. Fallback error handler for API failures (e.g., 400 Bad Request, 404 Not Found)
    // Extract the exact error message sent by your backend router if available
    const errorMessage = err.response?.data?.message || "Failed parsing code. Ensure this is a valid ticket QR.";
    
    toast.error(errorMessage, { id: toastId, duration: 5000 });
  }
};


  const handleResetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-[90vh] custom-rounded bg-slate-700 text-white p-4 sm:p-6 flex flex-col items-center justify-center">
      <h1 className="text-lg sm:text-2xl font-bold mb-4 tracking-wide text-center">Event Access Verification</h1>
      
      {/* Target Container Element for Camera Element Stream */}
      {isScanning ? (
        <div id="reader" className="w-full max-w-xs sm:max-w-sm bg-white rounded-lg overflow-hidden text-black shadow-2xl"></div>
      ) : (
        <div className="w-full max-w-xs sm:max-w-sm bg-slate-800 border border-slate-700 p-4 sm:p-6 rounded-lg text-center shadow-2xl flex flex-col items-center gap-4">
          <p className="text-gray-400 font-medium text-sm sm:text-base">Camera Feed Suspended</p>
          
          {scanResult && (
            <div className="bg-slate-900/50 p-3 sm:p-4 rounded-md border border-slate-700/50 w-full text-left">
              <p className="text-xs text-violet-400 font-mono uppercase tracking-wider">Attendee Profile</p>
              <h3 className="font-semibold text-base sm:text-lg text-white mt-1 truncate">{scanResult.user}</h3>
              <p className="text-sm text-gray-300 mt-1">Seats: <span className="text-yellow-500 font-mono font-bold">{scanResult.seats?.join(", ")}</span></p>
            </div>
          )}

          <button 
            onClick={handleResetScanner} 
            className="w-full bg-violet-600 px-6 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20 text-sm sm:text-base"
          >
            Scan Next Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminScanner;