import React, { ReactNode, useState } from "react";
import Nav from "../components/Nav.tsx";
import Footer from "../components/Footer.tsx";
import "../css/MainLayout.css";
import EventSidebar from "../components/EventSidebar.tsx";

interface EventLayoutprops {
  children: ReactNode;
}

const EventLayout: React.FC<EventLayoutprops> = ({ children }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Nav toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 gap-3">
        <div className="m-2 ml-4">
          <EventSidebar isExpanded={isSidebarExpanded} />
        </div>

        <main className="my-layout-main">{children}</main>
      </div>

      <Footer />
    </div>
  );
};

export default EventLayout;
