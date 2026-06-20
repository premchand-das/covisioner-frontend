"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?._id) return;

    // connect socket once
    if (!socket.connected) {
      socket.connect();
    }

    // register user
    socket.emit("register", user._id);

    // listeners
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      socket.emit("register", user._id);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    const handleNotification = (notification: any) => {
      console.log("New notification:", notification);

      // later replace with toast
      alert(notification.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
    };
  }, [user?._id]);

  return <>{children}</>;
}