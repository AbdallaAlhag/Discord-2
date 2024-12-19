import { Hero, NavBar, ServerGrid } from "../Components/DiscoveryComponents";
import SideBar from "../Components/DiscoveryComponents/SideBar";
import ServerSidebar from "../Components/ServerSidebar";

export const DiscoverPage = () => {
  {
    return (
      <div className="flex h-screen">
        <ServerSidebar />
        <SideBar />
        <div className="flex flex-1 flex-col bg-[#36393f] ">
          <NavBar />
          <Hero />
          <ServerGrid />
        </div>
      </div>
    );
  }
};

export default DiscoverPage;
