import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const startOfMonth = currentDate.startOf("month").day();
  const daysInMonth = currentDate.daysInMonth();

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < startOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="text-gray-300"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          className={`relative flex items-center justify-center w-10 h-10 text-gray-900 font-medium transition-all ${
            i === currentDate.date() 
              ? "bg-purple-600 text-white rounded-full shadow-md"
              : "hover:bg-gray-200 hover:rounded-md"
          }`}
        >
          {i}
          {Math.random() > 0.7 && (
            <span className="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="p-4 w-96 h-96 bg-white/70 backdrop-blur-lg shadow-lg border border-white/30 rounded-xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeft className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold">{currentDate.format("MMMM, YYYY")}</h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRight className="text-gray-600" />
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 text-gray-600 text-sm font-medium mt-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center">{day}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-y-2 mt-2 flex-grow">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
