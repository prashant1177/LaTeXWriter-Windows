import { io } from "socket.io-client";

// Replace with your backend URL
const SOCKET_URL =  "https://api.latexwriter.com";
// const SOCKET_URL =  "http://localhost:8080";

export const socket = io(SOCKET_URL, {
  autoConnect: true, // we connect manually after project load
  reconnection: true, // enable automatic reconnection
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});