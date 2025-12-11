/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
// @ts-ignore
import QrReader from "react-qr-scanner";

interface EventInput {
  _id: string;
  assignedTasks: string;
  completed: boolean;
  date: string;
  event: string; 
  eventname: string;
  role: string;
}

interface EventCardProps {
  events: EventInput[] | undefined;
}

const EventCard: React.FC<EventCardProps> = ({ events }) => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  interface ScanData {
    text: string;
  }

  const handleScan = (data: ScanData | null) => {
    if (data) {
      setScannedData(data.text);
      setTimeout(() => {
        setScannedData(null);
      }, 2000);
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scanner Error:", err);
  };

  if (!events || events.length === 0) {
    return (
      <div className="container w-full">
        <p className="text-gray-400 text-center">No events available</p>
      </div>
    );
  }
const formatEventDate = (dateString: string): string => {
  try {
    const eventDate = new Date(dateString);
    return eventDate.toLocaleString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch (error) {
    console.error("Error formatting event date:", error);
    return "Invalid date";
  }
};
  return (
    <div className="container w-full">
      {events.map((event) => (
        <div
          key={event._id}
          style={{ backgroundColor: "#1a2331" }}
          className="flex flex-col sm:flex-row justify-between items-center rounded-lg shadow-lg mb-6 p-6 border border-gray-600 hover:border-blue-500 transition-all duration-300"
        >
          <div className="flex flex-col justify-center text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{event.eventname}</h2>
            <p className="text-sm font-medium text-white mt-3">
              <span className="text-white font-light">Date & Time:</span>{" "}
{formatEventDate(event.date)}            </p>
            <p className="text-sm font-medium text-white">
              <span className="text-white font-light">Role:</span>{" "}
              {event.role}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 pr-4 mt-4 sm:mt-0">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
              onClick={() => setActiveEventId(event._id)}
            >
              <i className="pi pi-users text-white"></i>
            </button>

            <Dialog
              header={`Participants of ${event.eventname}`}
              visible={activeEventId === event._id}
              onHide={() => setActiveEventId(null)}
              style={{ width: "50vw" }}
              breakpoints={{ "960px": "75vw", "641px": "100vw" }}
            >
              <ul className="list-disc pl-5">
                <li className="text-gray-700 text-sm">
                  Participants not available
                </li>
              </ul>
            </Dialog>

            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
              onClick={() => setActiveEventId(`${event._id}-qr`)}
            >
              <i className="pi pi-qrcode text-white"></i>
            </button>

            <Dialog
              header="QR Code Scanner"
              visible={activeEventId === `${event._id}-qr`}
              onHide={() => setActiveEventId(null)}
              style={{ width: "40vw" }}
            >
              <div className="flex justify-center items-center">
                <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    className="w-full h-full"
                    constraints={{
                      video: { facingMode: "environment" },
                    }}
                  />
                </div>
              </div>
              {scannedData && (
                <p className="mt-2 text-sm text-green-600 font-medium text-center">
                  Scanned Code: {scannedData}
                </p>
              )}
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventCard;