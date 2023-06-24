import { io } from "socket.io-client";
import { Peer } from "peerjs";

export const socket = io(import.meta.env.VITE_BACKEND_URL);
export const peer = new Peer();
