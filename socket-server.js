const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT || 3001;
const CLIENT_ORIGIN = process.env.SOCKET_ORIGIN || "http://localhost:3000";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("ping", () => {
    socket.emit("pong", { at: new Date().toISOString() });
  });

  socket.on("entity:changed", (payload) => {
    const normalized = {
      ...payload,
      at: payload?.at || new Date().toISOString(),
    };

    console.log("entity:changed", normalized);
    io.emit("entity:changed", normalized);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
  console.log(`Allowed origin: ${CLIENT_ORIGIN}`);
});
