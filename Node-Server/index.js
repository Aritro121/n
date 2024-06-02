const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

// Create an HTTP server
const server = http.createServer();

// Initialize Socket.io with CORS options
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to a specific domain for security
    methods: ["GET", "POST"]
  }
});

const users = {};

// Handle Socket.io connections
io.on("connection", (socket) => {
  // When a new user joins
  socket.on("new-user-joined", (names) => {
    console.log("New User", names);
    users[socket.id] = names;
    socket.broadcast.emit("user-joined", names);
  });

  // When a user sends a message
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      names: users[socket.id],
    });
  });

  // Handle user disconnect
  socket.on("disconnect", message => {
    socket.broadcast.emit("user-left", users[socket.id]);
    delete users[socket.id];
  });
});

// Start the server on port 8000
server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
