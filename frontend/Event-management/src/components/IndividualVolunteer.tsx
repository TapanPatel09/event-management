import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import { Tag } from "primereact/tag";
import "../css/indi.css";
import { useEffect, useState } from "react";
import { useGetvolunteerDetails } from "../Queries/Allquery";
import EventCard from "./VolEvents";
import { CheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the Events interface to match the data structure
interface Events {
  event: string;
  role: string;
  assignedTasks: string;
  _id: string;
  date: string;
  completed: boolean;
  eventname: string; // Added to match the data and EventInput in VolEvents.tsx
}

interface EventData {
  email: string;
  events: Events[];
  name: string;
  phone: string;
  totalEventsParticipated: number;
  _id: string;
}

const IndividualVolunteer = () => {
  const [storedUser, setStoredUser] = useState<EventData | null>(null);
  const [storageStatus, setStorageStatus] = useState<string>(
    "Checking storage..."
  );
  const navigate = useNavigate();

  const getUserData = (): EventData | null => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        setStorageStatus("No user data found in localStorage");
        return null;
      }

      const parsedData = JSON.parse(userData);
      return parsedData.user || parsedData;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      setStorageStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return null;
    }
  };

  useEffect(() => {
    const checkStorage = () => {
      try {
        localStorage.setItem("storage_test", "test");
        if (localStorage.getItem("storage_test") === "test") {
          localStorage.removeItem("storage_test");
          setStorageStatus("LocalStorage is available");
        } else {
          setStorageStatus(
            "LocalStorage is available but not working correctly"
          );
        }
      } catch (e) {
        setStorageStatus(
          `LocalStorage error: ${
            e instanceof Error ? e.message : "Unknown error"
          }`
        );
        console.error("LocalStorage not available:", e);
      }
    };

    checkStorage();
  }, []);

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      const updatedEvents = userData.events.map((event) => ({
        ...event,
        completed: event.completed ?? false,
      }));
      const updatedUserData = { ...userData, events: updatedEvents };
      setStoredUser(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setStorageStatus("User data loaded successfully");
    } else {
      setStorageStatus("No user data found");
      navigate("/VolLogin"); // Redirect to login if no user data
    }
  }, [navigate]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (storedUser) {
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [storedUser]);

  const { data: upcomingEvents } = useGetvolunteerDetails(
    storedUser?._id ?? ""
  );

  const eventsData: EventData[] = Array.isArray(upcomingEvents)
    ? upcomingEvents
    : upcomingEvents
    ? [upcomingEvents]
    : [];

  console.log(eventsData);

  // Map the events to include user details and correct eventname
  const flattenedEventsData = storedUser?.events.map((event) => ({
    name: storedUser?.name,
    email: storedUser?.email,
    phone: storedUser?.phone,
    ...event,
  })) ?? [];

  const tasks = [
    {
      id: 1,
      task: "Check-in attendees",
      status: "pending",
      time: "9:00 AM - 11:00 AM",
    },
    {
      id: 2,
      task: "Help with setup",
      status: "completed",
      time: "8:00 AM - 9:00 AM",
    },
  ];

  const statusTemplate = (rowData: { status: string }) => {
    const severity = rowData.status === "completed" ? "success" : "warning";
    return (
      <Tag
        value={rowData.status}
        severity={severity}
        className="px-3 py-1 text-sm rounded-lg"
      />
    );
  };

  const recoverSession = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        setStoredUser(parsedData.user || parsedData);
        setStorageStatus("Session recovered");
      } else {
        setStorageStatus("No recovery data available");
        navigate("/VolLogin");
      }
    } catch (e) {
      setStorageStatus(
        `Recovery error: ${e instanceof Error ? e.message : "Unknown error"}`
      );
      navigate("/VolLogin");
    }
  };

  const toggleTaskCompletion = (eventId: string) => {
    if (!storedUser) return;
    const updatedEvents = storedUser.events.map((event) =>
      event._id === eventId ? { ...event, completed: !event.completed } : event
    );
    const updatedUser = { ...storedUser, events: updatedEvents };
    setStoredUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (!storedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Card className="p-6 bg-gray-800 bg-opacity-50 border border-gray-700 w-96">
          <div className="text-white text-center">
            <i className="pi pi-exclamation-triangle text-3xl mb-4 text-yellow-400"></i>
            <h2 className="text-xl mb-4">Dashboard Access Issue</h2>
            <p className="mb-4">Status: {storageStatus}</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={recoverSession}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recover Session
              </button>
              <button
                onClick={() => navigate("/VolLogin")}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Return to Login
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const datePart = dateString.split(" Off:")[0];
      const eventDate = new Date(datePart);
      return eventDate.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg rounded-xl p-6 bg-gray-800 bg-opacity-50 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-5 shadow-md"
                  icon="pi pi-user"
                  size="xlarge"
                  shape="circle"
                />
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    {storedUser.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Volunteer since Jan 2025
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-xl text-center border border-gray-600 hover:border-gray-500 transition-all duration-300">
                  <p className="text-2xl font-bold text-blue-400">
                    {storedUser.totalEventsParticipated}
                  </p>
                  <p className="text-sm text-gray-400">Events</p>
                </div>
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-xl text-center border border-gray-600 hover:border-gray-500 transition-all duration-300">
                  <p className="text-2xl font-bold text-purple-400">24h</p>
                  <p className="text-sm text-gray-400">Hours</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <TabView className="bg-gray-800 bg-opacity-50 shadow-lg rounded-xl overflow-hidden border border-gray-700">
              <TabPanel header="Dashboard">
                <Card className="mb-6 bg-gray-700 bg-opacity-50 shadow-md rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300">
                  <h2 className="text-xl md:text-xl font-semibold flex items-center mb-4 text-white">
                    <i className="pi pi-calendar text-blue-400 mr-2"></i>
                    Upcoming Events
                  </h2>

                  <div className="overflow-x-auto">
                    <DataTable
                      value={flattenedEventsData}
                      className="p-datatable-striped p-datatable-gridlines bg-gray-700 rounded-lg overflow-hidden border border-gray-600 w-full"
                      aria-label="Upcoming Events Table"
                    >
                      <Column
                        field="date"
                        header="Date"
                        headerClassName="center-header"
                        className="w-36 sm:w-48 md:w-52 text-center text-white"
                        body={(rowData) => {
                          if (!rowData.date)
                            return (
                              <span className="text-gray-400">
                                No date available
                              </span>
                            );
                          return (
                            <span className="text-white">
                              {formatDate(rowData.date)}
                            </span>
                          );
                        }}
                      />
                      <Column
                        field="eventname"
                        header="Event Name"
                        headerClassName="center-header"
                        className="text-white text-center w-48 sm:w-60 md:w-72"
                      />
                      <Column
                        field="role"
                        header="Role"
                        headerClassName="center-header"
                        className="text-white text-center w-32 sm:w-40 md:w-52"
                      />
                    </DataTable>
                  </div>
                </Card>

                <Card className="bg-gray-700 bg-opacity-50 shadow-md rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300">
                  <h2 className="text-xl font-semibold flex items-center mb-4 text-white">
                    <i className="pi pi-check-square text-green-400 mr-2"></i>
                    Today's Tasks
                  </h2>
                  <DataTable
                    value={tasks}
                    className="p-datatable-striped p-datatable-gridlines bg-gray-700 rounded-lg overflow-hidden border border-gray-600"
                  >
                    <Column field="task" header="Task" className="text-white" />
                    <Column field="time" header="Time" className="text-white" />
                    <Column
                      field="status"
                      header="Status"
                      body={statusTemplate}
                      className="text-white"
                    />
                  </DataTable>
                </Card>
              </TabPanel>

              <TabPanel header="Events">
                <Card className="p-6 bg-gray-700 bg-opacity-50 border border-gray-600 hover:border-gray-500 transition-all duration-300">
                  <EventCard events={storedUser.events} />
                </Card>
              </TabPanel>

              <TabPanel header="Tasks">
                <Card className="p-6 bg-gray-700 bg-opacity-50 border border-gray-600 hover:border-gray-500 transition-all duration-300">
                  <h2 className="text-xl font-semibold flex items-center mb-6 text-white">
                    <i className="pi pi-check-square text-green-400 mr-2"></i>
                    Assigned Tasks
                  </h2>
                  <div className="bg-gray-800 bg-opacity-70 border border-gray-600 hover:border-blue-500 transition-all duration-300 rounded-lg shadow-md p-4">
                    <ul className="space-y-4">
                      {storedUser.events.map((event) => (
                        <li
                          key={event._id}
                          className="flex justify-between items-center rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                          <span
                            className={`text-white font-medium ${
                              event.completed ? 'line-through text-gray-400' : ''
                            }`}
                          >
                            {event.assignedTasks ? event.assignedTasks : 'No tasks assigned'}
                          </span>
                        {event.assignedTasks && 
                          <button
                          onClick={() => toggleTaskCompletion(event._id)}
                          className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                            event.completed
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-blue-600 text-white hover:bg-purple-500'
                            }`}
                            >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualVolunteer;