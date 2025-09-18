import { io } from "socket.io-client";

// Replace with your backend URL
const SOCKET_URL =  "https://api.latexwriter.com";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // we connect manually after project load
});
