import SettingsButton from "../Profile/SettingsButton";
import { useAuth } from "@/AuthContext";
import defaultAvatar from "/default-avatar.svg";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Import required CSS
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface CurrentUser {
  id: string;
  username: string;
  avatarUrl: null | string;
}

export default function SideBar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        setUser(response.data.user);
        // console.log("user: ", response.data.user);
      } catch (err) {
        console.error("Error fetching user ", err);
      }
    };
    fetchUser();
  });
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      <p className="text-xl font-bold text-[#dbdee1] px-4 py-4">Discover</p>

      <hr className="border-t border-[#27292d] my-2" />

      <div className="flex-1 overflow-y-auto space-y-2 pt-2">
        <div className="px-2">
          <button className="w-full flex items-center px-2 py-2 text-[#dcddde] bg-[#42464D] rounded group">
            <span className="text-lg font-semibold">Servers</span>
          </button>
        </div>
      </div>

      <div className="h-14 bg-[#232428] px-2 flex items-center mt-auto gap-1">
        <img
          src={user?.avatarUrl || defaultAvatar}
          className="w-8 h-8 rounded-full mr-2"
          alt="User Avatar"
        />
        {/* <div className="w-8 h-8 rounded-full bg-[#36393f] mr-2 relative">
          <StatusIndicator status="online" />
        </div> */}
        <div className="flex-1">
          <div className="text-white text-sm font-medium">{user?.username}</div>
          <div className="text-[#b9bbbe] text-xs">
            #{user?.id?.slice(0, 8)}
          </div>
        </div>
        <FontAwesomeIcon
          icon={faMicrophone}
          size="lg"
          className="p-2 hover:bg-[#383a40] cursor-pointer rounded-sm"
          style={{ color: "#959ba7" }}
          data-tooltip-id={`tooltip-mic`}
          data-tooltip-content={"Turn on Microphone"}
        />
        <Tooltip
          id="tooltip-mic"
          place="top"
          className="z-10 "
          style={{
            backgroundColor: "black",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        />
        <FontAwesomeIcon
          icon={faHeadphones}
          size="lg"
          className="p-2 hover:bg-[#383a40]  cursor-pointer rounded-sm"
          style={{ color: "#959ba7" }}
          data-tooltip-id={`tooltip-headphones`}
          data-tooltip-content={"Deafen"}
        />
        <Tooltip
          id="tooltip-headphones"
          place="top"
          className="z-10 "
          style={{
            backgroundColor: "black",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        />

        <div
          className="hover:bg-[#383a40] rounded-sm"
          data-tooltip-id={`tooltip-settings`}
          data-tooltip-content={"User Settings"}
        >
          <SettingsButton className="hover:animate-spin  p-2 " />
          <Tooltip
            id="tooltip-settings"
            place="top"
            className="z-10 "
            style={{
              backgroundColor: "black",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
