/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import TemplateDemo from "./Nav";
import { Sidebar } from "primereact/sidebar";
import { useEditOrganizer, useGetOrganizerDetails } from "../Queries/Allquery";
import { useSelector } from "react-redux";

const OrganizerProfile = () => {
  const userID = useSelector((store: any) => store.auth.user._id);
  const {
    data: organizer,
    isPending,
    isSuccess,
  } = useGetOrganizerDetails(userID);
  useEffect(() => {
    if (isSuccess && organizer) {
      setFormData({
        userID,
        username: organizer.username || "",
        email: organizer.email || "",
        phone: organizer.phone || "",
        organization: organizer.organization || "",
        designation: organizer.designation || "",
        bankDetails: organizer.bankDetails || "",
        currency: organizer.currency || "",
        preferredLocations: organizer.preferredLocations || "",
        techRequirements: organizer.techRequirements || "",
        socialMedia: {
          website: organizer.socialMedia?.website || "",
          linkedin: organizer.socialMedia?.linkedin || "",
          instagram: organizer.socialMedia?.instagram || "",
          twitter: organizer.socialMedia?.twitter || "",
        },
      });
    }
  }, [organizer, isSuccess, userID]);
  const [step, setStep] = useState(1);

  const [openPanels, setOpenPanels] = useState({
    contact: true,
    payment: true,
    locations: true,
    tech: true,
    social: true,
  });

  const [visible, setVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    userID,
    username: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    bankDetails: "",
    currency: "",
    preferredLocations: "",
    techRequirements: "",
    socialMedia: {
      website: "",
      linkedin: "",
      instagram: "",
      twitter: "",
    },
  });
  const { mutate: EditOrganizer } = useEditOrganizer();

  const events = [
    {
      id: 1,
      title: "Tech Conference 2025",
      startDate: new Date(2025, 2, 15),
      endDate: new Date(2025, 2, 17),
      location: "Manhattan Convention Center",
      attendees: 750,
      status: "upcoming",
    },
    {
      id: 2,
      title: "Marketing Summit",
      startDate: new Date(2025, 3, 8),
      endDate: new Date(2025, 3, 9),
      location: "Chicago Business Hub",
      attendees: 450,
      status: "upcoming",
    },
    {
      id: 3,
      title: "Leadership Workshop",
      startDate: new Date(2024, 11, 12),
      endDate: new Date(2024, 11, 12),
      location: "Boston Executive Center",
      attendees: 120,
      status: "completed",
    },
    {
      id: 4,
      title: "Industry Networking",
      startDate: new Date(2025, 0, 25),
      endDate: new Date(2025, 0, 25),
      location: "Virtual",
      attendees: 300,
      status: "upcoming",
    },
  ];
  if (isPending) {
    return <p>Loading...</p>;
  }

  const togglePanel = (panel: keyof typeof openPanels) => {
    setOpenPanels((prevPanels) => ({
      ...prevPanels,
      [panel]: !prevPanels[panel], // Toggle the selected panel
    }));
  };

  // Function to format dates for display
  const formatDate = (
    startDate: {
      toLocaleDateString: (
        arg0: undefined,
        arg1: { year: string; month: string; day: string }
      ) => any;
    },
    endDate: {
      toLocaleDateString: (
        arg0: undefined,
        arg1: { year: string; month: string; day: string }
      ) => any;
    }
  ) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const start = startDate.toLocaleDateString(undefined, options);
    const end = endDate.toLocaleDateString(undefined, options);

    return start === end ? start : `${start} - ${end}`;
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);

      const dayEvents = events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return currentDate >= eventStart && currentDate <= eventEnd;
      });

      calendarDays.push({
        day: i,
        events: dayEvents,
        isToday: i === today.getDate(),
      });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (e: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value,
      },
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const handleSubmit = () => {
    EditOrganizer(formData, {
      onSuccess: () => {
        console.log("Organizer updated successfully!");
      },
      onError: (error) => {
        console.error("Error updating organizer:", error);
      },
    });
  };

  return (
    <>
      <TemplateDemo />
      <div className="card flex justify-content-center">
        <Sidebar visible={visible} onHide={() => setVisible(false)} fullScreen>
          <div className="container">
            <h2 className="text-2xl">Profile Details</h2>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
              {/* Step Indicator */}
              <div className="flex justify-between mb-6">
                <div
                  className={`step ${
                    step >= 1 ? "text-blue-500 font-bold" : "text-gray-400"
                  }`}
                >
                  1. Contact Info
                </div>
                <div
                  className={`step ${
                    step >= 2 ? "text-blue-500 font-bold" : "text-gray-400"
                  }`}
                >
                  2. Payment Info
                </div>
                <div
                  className={`step ${
                    step >= 3 ? "text-blue-500 font-bold" : "text-gray-400"
                  }`}
                >
                  3. Preferences
                </div>
                <div
                  className={`step ${
                    step === 4 ? "text-blue-500 font-bold" : "text-gray-400"
                  }`}
                >
                  4. Social Media
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Contact Information */}
                {step === 1 && (
                  <div>
                    <label className="block">Full Name:</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">Organization:</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">Designation:</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {step === 2 && (
                  <div>
                    <label className="block">Bank Details:</label>
                    <input
                      type="text"
                      name="bankDetails"
                      value={formData.bankDetails}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">Currency:</label>
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}

                {/* Step 3: Preferences */}
                {step === 3 && (
                  <div>
                    <label className="block">Preferred Locations:</label>
                    <input
                      type="text"
                      name="preferredLocations"
                      value={formData.preferredLocations}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">Tech Requirements:</label>
                    <input
                      type="text"
                      name="techRequirements"
                      value={formData.techRequirements}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}

                {/* Step 4: Social Media */}
                {step === 4 && (
                  <div>
                    <label className="block">Website:</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.socialMedia.website}
                      onChange={handleSocialMediaChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">LinkedIn:</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleSocialMediaChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">Instagram:</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleSocialMediaChange}
                      className="w-full p-2 border rounded"
                    />

                    <label className="block mt-2">Twitter:</label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleSocialMediaChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-300 text-gray-700 p-2 rounded"
                    >
                      Previous
                    </button>
                  )}
                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-2 rounded"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Sidebar>
      </div>
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                className="relative top-6 hover:cursor-pointer "
                onClick={() => setVisible(true)}
                style={{ left: "90%" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="p-6 flex flex-col items-center border-b">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src="https://uploads-ssl.webflow.com/647c2797a041413036e8e6fd/647d8981865d5dee2d03896e_Daco_5511364.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{organizer.username}</h2>
                <p className="text-gray-500 mt-1">{organizer.designation}</p>
                <p className="font-medium mt-2 text-blue-600">
                  {organizer.organization}
                </p>
              </div>

              {/* Collapsible Panel: Contact Information */}
              <div className="border-b">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePanel("contact")}
                >
                  <h3 className="font-medium">Contact Information</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openPanels.contact ? "transform rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {openPanels.contact && (
                  <div className="p-4 pt-0">
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{organizer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{organizer.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Panel: Payment Information */}
              <div className="border-b">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePanel("payment")}
                >
                  <h3 className="font-medium">Payment Information</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openPanels.payment ? "transform rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {openPanels.payment && (
                  <div className="p-4 pt-0">
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span>{organizer.bankDetails}</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Currency: {organizer.currency}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Panel: Preferred Locations */}
              <div className="border-b">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePanel("locations")}
                >
                  <h3 className="font-medium">Preferred Locations</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openPanels.locations ? "transform rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {openPanels.locations && (
                  <div className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {organizer.preferredLocations.map(
                        (
                          location:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | null
                            | undefined,
                          i: Key | null | undefined
                        ) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {location}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Panel: Tech Requirements */}
              <div className="border-b">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePanel("tech")}
                >
                  <h3 className="font-medium">Tech Requirements</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openPanels.tech ? "transform rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {openPanels.tech && (
                  <div className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {organizer.techRequirements.map(
                        (
                          tech:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | null
                            | undefined,
                          i: Key | null | undefined
                        ) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Panel: Social Media */}
              <div className="border-b">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePanel("social")}
                >
                  <h3 className="font-medium">Social Media</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openPanels.social ? "transform rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {openPanels.social && (
                  <div className="p-4 pt-0">
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      <span>
                        {organizer?.socialMedia?.website || "Not Available"}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>{organizer?.socialMedia?.linkedin}</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>{organizer?.socialMedia?.instagram}</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                      <span>{organizer?.socialMedia?.twitter}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Events Calendar */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Events Calendar</h2>
                <p className="text-gray-600">{currentMonth}</p>
              </div>

              {/* Calendar */}
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekdays.map((day, index) => (
                    <div
                      key={index}
                      className="text-center font-medium text-sm py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-16 border rounded-md p-1 ${
                        !day
                          ? "bg-gray-50"
                          : day.isToday
                          ? "border-blue-500 border-2"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {day && (
                        <>
                          <div className="text-right text-sm mb-1">
                            {day.day}
                          </div>
                          <div className="space-y-1">
                            {day.events.map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className={`text-xs p-1 rounded truncate ${
                                  event.status === "upcoming"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6">
                <h3 className="font-bold text-lg mb-4">Your Events</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Event Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Attendees
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {event.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(event.startDate, event.endDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {event.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.attendees}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                event.status === "upcoming"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {event.status === "upcoming"
                                ? "Upcoming"
                                : "Completed"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default OrganizerProfile;
