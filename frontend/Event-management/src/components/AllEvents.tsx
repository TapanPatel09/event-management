/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import MyLayout from "../layout/MainLayout";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import { ProgressSpinner } from "primereact/progressspinner";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { FileUpload } from "primereact/fileupload";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { useCreateEvent, useFetchMyEvent } from "../Queries/Allquery";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Toast } from "primereact/toast";

const AllEvents: React.FC = () => {
  const user = useSelector((store: any) => store.auth.user);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [visible, setVisible] = useState<boolean>(false);

  const [title, settitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [venue, setvenue] = useState<string>("");
  const [ticketprice, setticketprice] = useState<Nullable<number>>();
  const [ticketavaible, setticketavaible] = useState<Nullable<number>>();
  const [starttime, setstartTime] = useState<Nullable<Date>>(null);
  const [endtime, setendTime] = useState<Nullable<Date>>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [Date, setDate] = useState<Nullable<Date>>(null);
  const [selectedCategory, setSelectedCategory] = useState("free");
  const queryClient = useQueryClient();
  const handleCategoryChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedCategory(event.target.value);
  };

  const getTicketColor = (ticketsAvailable: number) => {
    if (ticketsAvailable > 100) {
      return "bg-green-500";
    } else if (ticketsAvailable <= 50 && ticketsAvailable > 20) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useFetchMyEvent(user?._id);
  const { mutate: createEvent } = useCreateEvent();
  if (!user) {
    return <div>Loading user information...</div>;
  }
  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  const handlesubmit = async (e: any) => {
    e.preventDefault();

    if (!title || !venue || !Date || !starttime || !endtime || !ticketavaible) {
      showError("Please fill in all required fields.");
      return;
    }

  
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("venue", venue);
    formData.append("date", Date.toISOString());
    formData.append("startTime", starttime.toISOString());
    formData.append("endTime", endtime.toISOString());
    formData.append("ticketCategory", selectedCategory);
    if (selectedCategory === "paid") {
      formData.append("ticketPrice", (ticketprice ?? 0).toString()); 
  }
    formData.append("ticketsAvailable", ticketavaible.toString());
    formData.append("createdBy", user._id);
    if (imageFile) {
      formData.append("image", imageFile); 
  }
      console.log(formData);
    
    // const formdata = {
    //   title: title,
    //   venue: venue,
    //   date: Date,
    //   startTime: starttime,
    //   endTime: endtime,
    //   image:"as", // Replace this with actual uploaded image
    //   ticketCategory: selectedCategory,
    //   ticketsAvailable: ticketavaible,
    //   ticketPrice: ticketprice,
    //   createdBy: user._id,
    // };

    setLoading(true);

    createEvent(formData, {
      onSuccess: () => {
        showSuccess("Event created successfully!");
        queryClient.invalidateQueries({ queryKey: ["myevents"] });
        setLoading(false);
        setVisible(false);
      },
      onError: (error: any) => {
        if (error.message.includes("Network Error")) {
          showError("Network error: Please check your internet connection.");
        } else {
          showError(`Error: ${error.message}`);
        }
        setLoading(false);
      },
    });
  };

  return (
    <MyLayout>
      <Toast ref={toast} />
      {isError && <p>error : {error.message}</p>}
      <Sidebar visible={visible} onHide={() => setVisible(false)} fullScreen>
        <div className="pl-10">
          <h2 className="text-2xl mb-10">Create Event</h2>
          <div className="flex flex-wrap gap-4 w-full">
            <FloatLabel className="flex-1 min-w-[250px]">
              <InputText
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={title}
                onChange={(e) => settitle(e.target.value)}
              />
              <label htmlFor="title">Event Title</label>
            </FloatLabel>
            <FloatLabel className="flex-1 min-w-[250px]">
              <InputText
                id="venue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={venue}
                onChange={(e) => setvenue(e.target.value)}
              />
              <label htmlFor="venue">Event Venue</label>
            </FloatLabel>
            <FloatLabel className="flex-1 min-w-[250px]">
              <Calendar
                dateFormat="dd/mm/yy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                inputId="Date"
                value={Date}
                onChange={(e) => setDate(e.target.value)}
              />
              <label htmlFor="Date">Event Date</label>
            </FloatLabel>
          </div>
          <div className="flex mt-10 flex-wrap gap-4 w-full">
            <FloatLabel className="flex-1 min-w-[250px]">
              <Calendar
                hourFormat="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="Start_time"
                value={starttime}
                onChange={(e) => setstartTime(e.value)}
                timeOnly
              />
              <label htmlFor="Start_time">Event Starting time</label>
            </FloatLabel>
            <FloatLabel className="flex-1 min-w-[250px]">
              <Calendar
                hourFormat="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="Start_time"
                value={endtime}
                onChange={(e) => setendTime(e.value)}
                timeOnly
              />
              <label htmlFor="Start_time">Event Ending time</label>
            </FloatLabel>
          </div>
          <div className="flex mt-10 flex-wrap gap-4 w-full">
           <FileUpload
            onSelect={(e) => setImageFile(e.files[0])} 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              name="demo[]"
              url="/api/upload"
              multiple
              accept="image/*"
              headerTemplate={({ chooseButton, cancelButton }) => (
                <div className="flex items-center gap-6 p-3 bg-gray-100 rounded-lg shadow-md">
                  {chooseButton}
                  {cancelButton}
                </div>
              )}
              maxFileSize={1000000}
              emptyTemplate={
                <p className="m-0 text-center text-gray-600">
                  Drag and drop files here to upload.
                </p>
              }
            />
          </div>
          <div className="flex mt-10 flex-wrap gap-4 w-full">
            <FloatLabel className="flex-1 min-w-[250px] relative">
              <select
                name="Category"
                id="dd"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleCategoryChange}
              >
                <option value="free">FREE</option>
                <option value="paid">PAID</option>
              </select>
              <label
                htmlFor="dd"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-300"
              >
                Select a Category
              </label>
            </FloatLabel>

            {selectedCategory === "paid" && (
              <FloatLabel className="flex-1 min-w-[250px] relative">
                <InputNumber
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  inputId="integeronly"
                  value={ticketprice}
                  onValueChange={(e: InputNumberValueChangeEvent) =>
                    setticketprice(e.value)
                  }
                />
                <label htmlFor="integeronly">Ticket Price</label>
              </FloatLabel>
            )}

            <FloatLabel>
              <InputNumber
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="ticketavaible"
                value={ticketavaible}
                onChange={(e) => setticketavaible(e.value)}
              />
              <label htmlFor="ticketavaible">Ticket Available</label>
            </FloatLabel>
          </div>

          <div className="flex mt-10 flex-wrap gap-4 w-full">
            <Button
              pt={{
                label: { className: "text-white" },
              }}
              className="w-full  bg-blue-500 p-2"
              label="Submit"
              loading={loading}
              onClick={handlesubmit}
            />
          </div>
        </div>
      </Sidebar>

      <div className="h-full rounded-xl ">
        <div className="max-w-full mx-auto p-6">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl mt-2 font-bold mb-10  ">All Events</h1>
            <Button
              className="bg-blue-500 text-white flex items-center justify-center px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setVisible(true)}
            >
              +
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading && (
              <div className="card flex items-center justify-center">
                <ProgressSpinner />
              </div>
            )}
            {events && events.length === 0 && (
              <div>
                <p>No event is Created Yet.</p>
              </div>
            )}

            {events?.map((event: any) => (
              <div
                key={event._id}
                className="rounded-lg shadow-lg bg-white hover:cursor-pointer"
                onClick={() =>
                  navigate(`/events/${event._id}`, { state: { event } })
                }
              >
                <div className="relative">
                  <img
                    alt={event.title || "Event Image"}
                    src={
                      event.image ||
                      "https://i2.wp.com/wallpapercave.com/wp/wp7488244.jpg"
                    }
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <button
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      const eventUrl = `${
                        window.location.origin
                      }/participate/${encodeURIComponent(event._id)}`;
                      navigator.share({
                        title: event.title,
                        text: `Check out this event: ${event.title}!`,
                        url: eventUrl,
                      });
                    }}
                  >
                    <i className="pi pi-share-alt"></i>
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {event.title}
                  </h3>

                  <div className="flex gap-2 items-center mt-2 text-gray-600">
                    <i className="pi pi-map-marker"></i>
                    <p>{event.venue || "Venue to be decided"}</p>
                  </div>

                  <div className="flex gap-2 items-center mt-2 text-gray-600">
                    <i className="pi pi-calendar"></i>
                    <p>{moment(event.date).format("DD-MM-YYYY")}</p>
                  </div>

                  <div className="flex gap-2 items-center mt-2 text-gray-600">
                    <i className="pi pi-clock"></i>
                    <p>
                      <p>
                        {moment(event.startTime).format("hh:mm A")} -{" "}
                        {moment(event.endTime).format("hh:mm A") || "TBA"}
                      </p>
                    </p>
                  </div>

                  <div className="flex gap-2 items-center mt-2 text-gray-600">
                    <i className="pi pi-ticket"></i>
                    <p>
                      {event.ticketCategory === "free" ? (
                        <span className="px-2 py-1 text-xs text-white bg-green-500 rounded">
                          Free
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded">
                          Paid | {event.ticketPrice} $
                        </span>
                      )}
                      <span>
                        {" "}
                        |{" "}
                        <span
                          className={`px-2 py-1 text-xs text-white ${getTicketColor(
                            event.ticketsAvailable
                          )} rounded`}
                        >
                          {event.ticketsAvailable} tickets left
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MyLayout>
  );
};

export default AllEvents;
