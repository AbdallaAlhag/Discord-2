import {
  ServerSidebar,
  FriendsNavBar,
  FriendsList,
  ActiveNow,
  FriendSidebar,
} from "../Components";
function HomePage() {
  return (
    <div className="flex h-screen">
      <ServerSidebar />
      <FriendSidebar />
      <div className="flex-1 bg-[#36393f] flex flex-col">
        <FriendsNavBar />
        <FriendsList />
      </div>
      <ActiveNow />
    </div>
  );
}

export default HomePage;
