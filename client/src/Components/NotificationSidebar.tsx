// src/components/NotificationSidebar.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

interface Notification {
  message: {
    content: string;
    createdAt: Date;
    id: number;
    // this is who we is seeing it
    recipientId: number;
    recipientUsername: string;
    // sender id and user is who sent it
    senderId: number;
    user: {
      avatarUrl: string;
      username: string;
    };
  };
  unreadCount: number;
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const NotificationSidebar: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { userId } = useAuth();
  const navigate = useNavigate();
  //   useEffect(() => {
  //     console.log("notifications: ", notifications);
  //   });
  useEffect(() => {
    const socket = io(VITE_API_BASE_URL, {
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Listen for private message notifications
    socket.on("private-message-notification", (notification: Notification) => {
      const existingNotificationIndex = notifications.findIndex(
        (n) => n.message.senderId === notification.message.senderId
      );

      if (existingNotificationIndex === -1) {
        setNotifications((prev) => [...prev, notification]);
      } else {
        setNotifications((prev) =>
          prev.map((n, i) =>
            i === existingNotificationIndex
              ? { ...n, unreadCount: notification.unreadCount }
              : n
          )
        );
      }
    });

    // Cleanup function
    return () => {
      socket?.off("private-message-notification");
      socket?.disconnect();
    };
  }, [notifications, userId]); // Dependency array

  const handleNotificationClick = async (notification: Notification) => {
    // Mark message as read
    // await markMessageAsRead(notification.message.id);

    // Remove this specific notification
    setNotifications((prev) =>
      prev.filter((n) => n.message.id !== notification.message.id)
    );

    navigate(`/@me/${notification.message.senderId}`);
  };

  return (
    //     <div className="notification-sidebar">
    //       {notifications.map((notification) => (
    //         <div
    //           key={notification.message.id}
    //           onClick={() => handleNotificationClick(notification)}
    //           className="notification-item"
    //         >
    //           <img
    //             src={notification.message.user.profilePicture}
    //             alt={notification.message.user.username}
    //           />
    //           <div>
    //             <strong>{notification.message.user.username}</strong>
    //             <p>{notification.message.content}</p>
    //             {notification.unreadCount > 1 && (
    //               <span className="unread-count">
    //                 {notification.unreadCount} new messages
    //               </span>
    //             )}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   );

    // <div>
    //   {notifications.map((notification) => (
    //     // <div
    //     //   key={notification.message.id}
    //     //   onClick={() => handleNotificationClick(notification)}
    //     //   className="notification-item"
    //     // >
    //     <div className="group relative">
    //       <div className="relative">
    //         <div className="absolute -left-3 top-1/2 -translate-y-1/2 group-hover:h-5 h-5 w-1 bg-white rounded-r transition-all duration-200 opacity-0 group-hover:opacity-100">
    //           <div
    //             // className="relative w-8 h-8 rounded-[24px]"
    //             className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer"
    //             data-tooltip-id={`sender`} // Link element to tooltip
    //             data-tooltip-content={notification.message.user.username}
    //             onClick={() => handleNotificationClick(notification)}
    //           >
    //             <img
    //               className="w-12 h-12 rounded-full"
    //               src={notification.message.user.avatarUrl}
    //               alt={notification.message.user.username}
    //             />
    //             {notification.unreadCount > 0 && (
    //               <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#dd3447] rounded-full  z-10">
    //                 <p className="text-[13px]  font-bold text-[#fbfffe] flex items-center justify-center">
    //                   {notification.unreadCount}
    //                 </p>
    //               </span>
    //             )}
    //             <Tooltip
    //               id={`tooltip-home`}
    //               place="right"
    //               className="z-10  ml-2.5"
    //               style={{
    //                 backgroundColor: "black",
    //                 color: "white",
    //                 fontWeight: "bold",
    //               }}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ))}
    // </div>

    <div className=" bg-[#1e1f22] flex items-center justify-center">
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.message.id}
            className="group relative"
            onClick={() => handleNotificationClick(notification)}
            data-tooltip-id={`sender`} // Link element to tooltip
            data-tooltip-content={notification.message.user.username}
          >
            {/* Server Pill Indicator */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2">
              <div className="h-5 w-1 bg-white rounded-r transition-all duration-200 opacity-0 group-hover:opacity-100" />
            </div>

            {/* Server Icon Button */}
            <div className="relative">
              <button
                className="w-12 h-12 bg-[#313338] rounded-[24px] group-hover:rounded-[16px] transition-all duration-200 flex items-center justify-center relative"
                title={notification.message.user.username}
              >
                <img
                  className="w-full h-full object-cover rounded-[24px] group-hover:rounded-[16px]"
                  src={notification.message.user.avatarUrl}
                  alt={notification.message.user.username}
                />

                {/* Unread Count Badge */}
                {notification.unreadCount > 0 && (
                  <div className="absolute -bottom-1 -right-1 min-w-5 h-5 bg-[#f23f43] rounded-full flex items-center justify-center px-1 z-10">
                    <span className="text-xs font-bold text-white">
                      {notification.unreadCount}
                    </span>
                  </div>
                )}
              </button>
            </div>
            <Tooltip
              id={`sender`}
              place="right"
              className="z-10  ml-2.5"
              style={{
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
