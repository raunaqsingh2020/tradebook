import io from "socket.io-client";
const socket = io("https://textbookbackend.herokuapp.com/", { transport: ["websocket"], upgrade: false });

module.exports = socket