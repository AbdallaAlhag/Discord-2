import { Hero, NavBar, ServerGrid } from "../Components/DiscoveryComponents";
import SideBar from "../Components/DiscoveryComponents/SideBar";
import ServerSidebar from "../Components/ServerSidebar";
import { useState, useEffect } from "react";

export const DiscoverPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="relative flex h-screen">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-[200] p-2 bg-gray-700 rounded-md ${
            showSidebar ? "ml-10" : ""
          }`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                showSidebar ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      )}

      {/* Sidebars Container - Increased z-index */}
      <div
        className={`
          ${isMobile ? "fixed left-0 top-0 h-full z-[150]" : "relative"}
          ${isMobile && !showSidebar ? "-translate-x-full" : "translate-x-0"}
          transition-transform duration-300 ease-in-out flex
        `}
      >
        <ServerSidebar />
        <SideBar />
      </div>

      {/* Main Content */}
      <div
        className={`
          flex-1 flex flex-col bg-[#36393f] 
          ${isMobile ? "w-full" : ""}
        `}
      >
        {/* Navbar - Lower z-index than sidebars */}
        <div className="sticky top-0 z-[100]">
          <NavBar />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Hero />
          <ServerGrid />
        </div>
      </div>

      {/* Mobile Overlay - Between sidebars and content */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[140]"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DiscoverPage;
