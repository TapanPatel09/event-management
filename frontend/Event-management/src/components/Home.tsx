/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import MainLayout from "../layout/MainLayout";
import {
  ChevronRight,
  Ticket,
  IndianRupee,
  UsersRound,
  CalendarFold,
} from "lucide-react";
import Calendar from "./Calender";
import { Link, useNavigate } from "react-router";
import { useGetAnalytics } from "../Queries/Allquery";
import dayjs from "dayjs";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";

const Home = () => {
  const user = useSelector((store: any) => store.auth.user);
  const navigate = useNavigate();
  const userID = user._id;
  const { data } = useGetAnalytics(userID);
  if (!user && !data) {
    return <div>Loading user information...</div>;
  }
  console.log(data);

  const stats = [
    {
      icon: <CalendarFold className="text-green-600 w-6 h-6" />,
      title: <p className="text-purple-800">{data && data.totalEvents}</p>,
      subtitle: "Live Events Ongoing",
    },
    {
      icon: <Ticket className="text-blue-600 w-6 h-6" />,
      title: (
        <p className="text-yellow-500">{data && data.totalRegistrations}</p>
      ),
      subtitle: "Tickets Sold",
    },
    {
      icon: <IndianRupee className="text-red-600 w-6 h-6" />,
      title: <p className="text-green-600">{data && data.totalMoney}</p>,
      subtitle: "Revenue Generated",
    },
    {
      icon: <UsersRound className="text-yellow-600 w-6 h-6" />,
      title: (
        <p className="text-blue-600">{data && data.totalRegistrations + 4}</p>
      ),
      subtitle: "Registered Users",
    },
  ];

  return (
    <MainLayout>
      <div className="container min-h-screen rounded-xl bg-gray-100 p-4">
        <div className="mt-4 ml-4">
          <h1 className="text-2xl font-bold mb-10 text-gray-700">
            Event Management Dashboard for {user.username}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                subtitle={stat.subtitle}
              />
            ))}
          </div>

          <div className="mt-8 rounded-xl grid md:grid-cols-[3fr_1fr] gap-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-md border border-white/30">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Ongoing Events</p>
                <a
                  onClick={() => navigate("/events")}
                  className="text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  View All <ChevronRight size={18} />
                </a>
              </div>

              {/* Event Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data &&
                  data.ongoingEvents.map(
                    (
                      event: {
                        date: {
                          toString: () =>
                            | string
                            | number
                            | Date
                            | dayjs.Dayjs
                            | null
                            | undefined;
                        };
                        starttime: {
                          toString: () =>
                            | string
                            | number
                            | Date
                            | dayjs.Dayjs
                            | null
                            | undefined;
                        };
                        registrations: number;
                        image: string | undefined;
                        title:
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
                          | undefined;
                      },
                      index: Key | null | undefined
                    ) => {
                      const eventDate = event.date
                        ? dayjs(event.date.toString()).format("DD MMM, YYYY")
                        : "TBA";
                      const eventTime = event.starttime
                        ? dayjs(event.starttime.toString()).format("hh:mm A")
                        : "TBA";
                      const totalParticipants = event.registrations || 0;
                      return (
                        <div
                          key={index}
                          className="rounded-xl shadow-lg bg-white/60 backdrop-blur-md hover:shadow-xl transition-shadow border border-white/30"
                        >
                          <img
                            src={event.image}
                            alt="Event"
                            className="w-full h-48 object-cover rounded-t-xl"
                          />
                          <div className="p-4">
                            <p className="text-lg font-semibold">
                              {event.title}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-600">
                                {eventDate} | {eventTime}
                              </p>
                              <p className="flex items-center gap-1 text-xs text-white bg-blue-300 px-2 py-0.5 rounded-full">
                                <UsersRound style={{color:"white"}} className="text-white w-4 h-4" />
                                {totalParticipants}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>

            {/* Calendar (25%) */}
            <div className="flex justify-center items-center">
              <div className="backdrop-blur-lg shadow-md border border-white/30 rounded-xl w-full">
                <Calendar />
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-md border border-white/30 mt-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">Upcoming Events</p>
              <Link
                to="/events"
                className="text-blue-600 flex items-center gap-1 hover:underline"
              >
                View All <ChevronRight size={18} />
              </Link>
            </div>

            {/* Upcoming Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.upcomingEvents?.map(
                (
                  event: {
                    date: {
                      toString: () =>
                        | string
                        | number
                        | Date
                        | dayjs.Dayjs
                        | null
                        | undefined;
                    };
                    starttime: {
                      toString: () =>
                        | string
                        | number
                        | Date
                        | dayjs.Dayjs
                        | null
                        | undefined;
                    };
                    registrations: number;
                    image: string | undefined;
                    title: any;
                  },
                  index: Key | null | undefined
                ) => {
                  const eventDate = event.date
                    ? dayjs(event.date.toString()).format("DD MMM, YYYY")
                    : "TBA";
                  const eventTime = event.starttime
                    ? dayjs(event.starttime.toString()).format("hh:mm A")
                    : "TBA";
                  const totalParticipants = event.registrations || 0;

                  return (
                    <div
                      key={index}
                      className="rounded-xl shadow-lg bg-white/60 backdrop-blur-md hover:shadow-2xl transition-shadow border border-white/30 overflow-hidden"
                    >
                      {event.image && (
                        <img
                          src={event.image}
                          alt="Event"
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                      )}

                      <div className="p-4 flex flex-col space-y-2">
                        <p className="text-lg font-semibold text-gray-900">
                          {event.title || "Untitled Event"}
                        </p>

                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>
                            {eventDate} | {eventTime}
                          </span>
                          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                            total participants {totalParticipants}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

function StatCard({
  icon,
  title,
  subtitle,
}: {
  icon: JSX.Element;
  title: any;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-2xl font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default Home;
