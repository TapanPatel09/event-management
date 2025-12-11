import React, { ReactNode, useState } from "react";
import Nav from "../components/Nav.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Footer from "../components/Footer.tsx";
import "../css/MainLayout.css";

interface MyLayoutProps {
  children: ReactNode;
}

const MyLayout: React.FC<MyLayoutProps> = ({ children }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 gap-3">
        <Sidebar isExpanded={isSidebarExpanded} />

        <main className="my-layout-main flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default MyLayout;
