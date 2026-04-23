import React from "react";
import { useGetallEvents } from "../Queries/Allquery";
import { Link } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import moment from "moment";
import Nav from "./Nav";
import Footer from "./Footer";

const VolunteeringLanding: React.FC = () => {
    const { data: events, isLoading, isError } = useGetallEvents();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Nav />
            <div className="flex-grow container mx-auto px-4 py-12">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
                        Be the Heart of the Event
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join our community of passionate volunteers. Choose an event that inspires you and help us create unforgettable experiences.
                    </p>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                    </div>
                ) : isError ? (
                    <div className="text-center text-red-500 py-20">
                        <p>Something went wrong. Please try again later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events?.filter((e: any) => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0)).map((event: any) => (
                            <div key={event._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={event.image || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80"}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-blue-800 shadow-sm uppercase tracking-wider">
                                        {event.ticketCategory}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>

                                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <i className="pi pi-calendar mr-2 text-blue-500"></i>
                                            <span>{moment(event.date).format("MMMM DD, YYYY")}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="pi pi-map-marker mr-2 text-blue-500"></i>
                                            <span>{event.venue}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="pi pi-clock mr-2 text-blue-500"></i>
                                            <span>{moment(event.startTime).format("hh:mm A")} - {moment(event.endTime).format("hh:mm A")}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            to={`/participate/${event._id}`}
                                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors duration-200"
                                        >
                                            Volunteer Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {events && events.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                        <i className="pi pi-calendar-minus text-5xl text-gray-400 mb-4"></i>
                        <p className="text-xl text-gray-500">No events currently looking for volunteers.</p>
                    </div>
                )}
            </div>

            <section className="bg-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Already a Volunteer?</h2>
                    <p className="text-blue-200 mb-10 max-w-xl mx-auto">
                        Access your dashboard to check your assigned tasks, event schedules, and updates.
                    </p>
                    <Link
                        to="/VolLogin"
                        className="inline-block border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold px-10 py-3 rounded-full transition-all duration-300"
                    >
                        Volunteer Login
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default VolunteeringLanding;
