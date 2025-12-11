import React, { useState, useEffect } from "react";
import EventLayout from "../layout/EventLayout";
import { useGetAiMessage } from "../Queries/Allquery";

// Define interface for generated content to match API response
interface GeneratedContent {
  email: string;
  message: string;
  flyer: string; // Base64-encoded PNG image
}

const AIPromotionGenerator = () => {
  const [eventDetails, setEventDetails] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    email: "",
    message: "",
    flyer: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "message" | "flyer">(
    "email"
  );
  const { mutate: GetAiMessage, data, isSuccess } = useGetAiMessage();
  console.log(data);

  // Update generatedContent when API data changes
  useEffect(() => {
    if (data && isSuccess) {
      setGeneratedContent({
        email: data.email || "",
        message: data.message || "",
        flyer: data.flyer || "", // Base64 image string
      });
      setIsLoading(false);
    }
  }, [data, isSuccess]);

  const generateContent = () => {
    setIsLoading(true);

    GetAiMessage({
      eventDetails: {
        eventName: eventDetails.name,
        date: eventDetails.date,
        time: eventDetails.time,
        location: eventDetails.location,
        description: eventDetails.description,
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, add a toast notification here
  };

  const downloadFlyer = () => {
    if (!generatedContent.flyer) return;
    const link = document.createElement("a");
    link.href = generatedContent.flyer;
    link.download = `${eventDetails.name || "event"}-flyer.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendToParticipants = () => {
    // Integrate with email/SMS sending service
    alert(
      "In a real implementation, this would send content to all participants"
    );
  };

  return (
    <EventLayout>
      <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6 md:text-2xl">
          AI Event Promotion Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Event Details</h3>

            <div>
              <label className="block text-sm font-medium mb-1">
                Event Name
              </label>
              <input
                type="text"
                name="name"
                value={eventDetails.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Annual Conference 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={eventDetails.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={eventDetails.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={eventDetails.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Grand Hotel, New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={eventDetails.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md h-20"
                placeholder="Join us for a day of networking and learning..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Custom AI Prompt
              </label>
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                className="w-full p-2 border rounded-md h-20"
                placeholder="Create a professional invitation with a focus on networking opportunities..."
              />
            </div>

            <button
              onClick={generateContent}
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              {isLoading ? <>Generating...</> : <>Generate Content</>}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Content</h3>

            <div className="border rounded-md overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`py-2 px-4 flex items-center gap-2 ${
                    activeTab === "email" ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("email")}
                >
                  Email
                </button>
                <button
                  className={`py-2 px-4 flex items-center gap-2 ${
                    activeTab === "message" ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("message")}
                >
                  Message
                </button>
                <button
                  className={`py-2 px-4 flex items-center gap-2 ${
                    activeTab === "flyer" ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("flyer")}
                >
                  Flyer
                </button>
              </div>

              <div className="p-4">
                {activeTab === "email" && (
                  <div>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded min-h-64 max-h-96 overflow-y-auto">
                      {generatedContent.email ||
                        "Generated email will appear here"}
                    </pre>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => copyToClipboard(generatedContent.email)}
                        disabled={!generatedContent.email}
                        className="py-1 px-3 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center gap-1"
                      >
                        Copy
                      </button>
                      <button
                        onClick={sendToParticipants}
                        disabled={!generatedContent.email}
                        className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
                      >
                        Send to All Participants
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "message" && (
                  <div>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded min-h-64 max-h-96 overflow-y-auto">
                      {generatedContent.message ||
                        "Generated message will appear here"}
                    </pre>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => copyToClipboard(generatedContent.message)}
                        disabled={!generatedContent.message}
                        className="py-1 px-3 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center gap-1"
                      >
                        Copy
                      </button>
                      <button
                        onClick={sendToParticipants}
                        disabled={!generatedContent.message}
                        className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
                      >
                        Send to All Participants
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "flyer" && (
                  <div>
                    <div className="flex flex-col items-center bg-gray-50 p-3 rounded min-h-64">
                      {generatedContent.flyer ? (
                        <div className="flex-shrink-0 text-center">
                          <img
                            src={generatedContent.flyer}
                            alt="Generated event flyer"
                            className="max-h-96 mx-auto"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Event flyer generated based on your details
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 w-full text-gray-400">
                          Flyer image will appear here
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={downloadFlyer}
                        disabled={!generatedContent.flyer}
                        className="py-1 px-3 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center gap-1"
                      >
                        Download
                      </button>
                      <button
                        onClick={sendToParticipants}
                        disabled={!generatedContent.flyer}
                        className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
                      >
                        Share with All Participants
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EventLayout>
  );
};

export default AIPromotionGenerator;