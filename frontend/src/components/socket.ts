import { io } from "socket.io-client";
const LOCAL_URL = 'http://localhost:3001'
const LIVE_URL = 'https://realtime-canvas-game-production.up.railway.app'
const socket = io(LOCAL_URL);
// https://realtime-canvas-game-production.up.railway.app
//https://soft-druid-12dff0.netlify.app/
export default socket;
