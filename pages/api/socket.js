import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      io.emit("users", io.engine.clientsCount);
      socket.on("message-sent", (msg) => {
        msg.timestamp = new Date().getTime();
        io.emit("new-message", msg);
      });
      socket.on("disconnect", (reason) => {
        io.emit("users", io.engine.clientsCount);
      });
    });
  }
  res.end();
};

export default SocketHandler;
