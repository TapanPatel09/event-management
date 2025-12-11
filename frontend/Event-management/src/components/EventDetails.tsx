/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventLayout from "../layout/EventLayout";
import { BreadCrumb } from "primereact/breadcrumb";
import { MenuItem } from "primereact/menuitem";
import { api, useFetchEventByID } from "../Queries/Allquery";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import moment from "moment";
import axios from "axios";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

interface RouteParams {
  eventId?: string;
  [key: string]: string | undefined;
}

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { eventId }: any = useParams<RouteParams>();
  const { data: event, refetch } = useFetchEventByID(eventId);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editedEvent, setEditedEvent] = useState<any>(null);
  const toast = React.useRef<Toast>(null);

  React.useEffect(() => {
    if (event) {
      setEditedEvent({
        ...event,
        date: new Date(event.date),
      });
    }
  }, [event]);

  if (!event) {
    return <p>Loading event details...</p>;
  }

  const items: MenuItem[] = [
    {
      label: "Events",
      command: () => {
        navigate("/events");
      },
    },
    { label: event.title, className: "font-semibold text-primary" },
  ];

  const home: MenuItem = {
    icon: "pi pi-home",
    command: () => {
      navigate("/");
    },
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${api}/event/edit/${eventId}`,
        {
          title: editedEvent.title,
          venue: editedEvent.venue,
          date: editedEvent.date,
          startTime: editedEvent.startTime,
          endTime: editedEvent.endTime,
          image: editedEvent.image,
          ticketCategory: editedEvent.ticketCategory,
          ticketPrice: editedEvent.ticketPrice,
          ticketsAvailable: editedEvent.ticketsAvailable,
        }
      );

      if (!response) {
        throw new Error("Failed to update event");
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Event updated successfully",
      });
      setEditDialog(false);
      refetch();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update event",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${api}/event/delete/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Event deleted successfully",
      });
      setTimeout(() => {
        navigate("/events");
      }, 1500);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete event",
      });
    }
  };

  return (
    <>
      <EventLayout>
        <Toast ref={toast} />
        <div className="flex justify-between items-center mb-6 px-4">
          <BreadCrumb
            model={items}
            home={home}
            className="border-none shadow-sm"
          />
          <div className="flex gap-3">
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-success hover:scale-105 transition-transform"
              onClick={() => setEditDialog(true)}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger hover:scale-105 transition-transform"
              onClick={() => setDeleteDialog(true)}
            />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="grid gap-8">
                <div className="col-12 md:col-6">
                  <div className="relative group">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-[400px] object-cover rounded-lg shadow-md transform group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <h1 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-4">
                    {event.title}
                  </h1>
                  <div className="grid gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="font-semibold text-gray-700 mb-2">Venue</p>
                      <p className="text-gray-600">{event.venue}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="font-semibold text-gray-700 mb-2">Date</p>
                        <p className="text-gray-600">
                          {moment(event.date).format("DD-MM-y")}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="font-semibold text-gray-700 mb-2">Time</p>
                        <p className="text-gray-600">
                          {moment(event.startTime).format("hh:mm A")} -{" "}
                          {moment(event.endTime).format("hh:mm A") || "TBA"}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="font-semibold text-gray-700 mb-2">
                          Ticket Category
                        </p>
                        <p className="text-gray-600 capitalize">
                          {event.ticketCategory}
                        </p>
                      </div>
                      {event.ticketCategory === "paid" && (
                        <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                          <p className="font-semibold text-gray-700 mb-2">
                            Price
                          </p>
                          <p className="text-gray-600 text-lg">
                            ${event.ticketPrice}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="font-semibold text-gray-700 mb-2">
                        Available Tickets
                      </p>
                      <p className="text-gray-600 text-lg font-medium">
                        {event.ticketsAvailable}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          visible={editDialog}
          onHide={() => setEditDialog(false)}
          header="Edit Event"
          className="w-2/5"
          contentClassName="p-6 "
          headerClassName="bg-gray-50 p-4"
        >
          {editedEvent && (
            <div className="grid p-fluid gap-4">
              {/* Title Field */}
              <div className="col-12">
                <label
                  htmlFor="title"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Title
                </label>
                <InputText
                  id="title"
                  value={editedEvent.title}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              {/* Venue Field */}
              <div className="col-12">
                <label
                  htmlFor="venue"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Venue
                </label>
                <InputText
                  id="venue"
                  value={editedEvent.venue}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, venue: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              <div className="col-12">
                <label
                  htmlFor="date"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Date
                </label>

                <Calendar
                  id="date"
                  dateFormat="dd-mm-yy"
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={editedEvent.date || null}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      date: e.value,
                    })
                  }
                />
              </div>
              <div className="col-12">
                <label
                  htmlFor="startTime"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Start Time
                </label>
                <Calendar
                  id="startTime"
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={moment(editedEvent.startTime).toDate()}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      startTime: e.target.value,
                    })
                  }
                  hourFormat="12"
                  timeOnly
                />
              </div>
              <div className="col-12">
                <label
                  htmlFor="endTime"
                  className="block mb-2 font-medium text-gray-700"
                >
                  End Time
                </label>
                <Calendar
                  id="endTime"
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  value={moment(editedEvent.endTime).toDate()}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, endTime: e.target.value })
                  }
                  hourFormat="12"
                  timeOnly
                />
              </div>

              <div className="col-12">
                <label
                  htmlFor="ticketCategory"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Ticket Category
                </label>
                <Dropdown
                  id="ticketCategory"
                  value={editedEvent.ticketCategory}
                  options={[
                    { label: "free", value: "free" },
                    { label: "paid", value: "paid" },
                  ]}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      ticketCategory: e.value,
                    })
                  }
                  placeholder="Select Ticket Type"
                  className="w-full border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              {editedEvent.ticketCategory === "paid" && (
                <div className="col-12">
                  <label
                    htmlFor="ticketPrice"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Ticket Price
                  </label>
                  <InputText
                    id="ticketPrice"
                    type="number"
                    value={editedEvent.ticketPrice}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent,
                        ticketPrice: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  />
                </div>
              )}

              {/* Available Tickets Field */}
              <div className="col-12">
                <label
                  htmlFor="ticketsAvailable"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Available Tickets
                </label>
                <InputText
                  id="ticketsAvailable"
                  type="number"
                  value={editedEvent.ticketsAvailable}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      ticketsAvailable: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              {/* Update Button */}
              <div className="col-12 mt-6">
                <Button
                  label="Update Event"
                  onClick={handleUpdate}
                  className="w-full p-3 bg-blue-500 font-semibold rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                />
              </div>
            </div>
          )}
        </Dialog>

        <Dialog
          visible={deleteDialog}
          onHide={() => setDeleteDialog(false)}
          header="Confirm Delete"
          contentClassName="p-6"
          headerClassName="bg-red-50 text-red-700 p-4"
          footer={
            <div className="flex justify-end gap-3 p-4 bg-gray-50">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setDeleteDialog(false)}
                className="p-button-text hover:bg-gray-100"
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                onClick={handleDelete}
                className="p-button-danger hover:bg-red-600"
              />
            </div>
          }
        >
          <div className="flex items-center gap-4 text-gray-700">
            <i className="pi pi-exclamation-triangle text-red-500 text-4xl" />
            <p className="text-lg">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
          </div>
        </Dialog>
      </EventLayout>
    </>
  );
};

export default EventDetails;
