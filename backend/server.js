const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  
    socket.on("userTyping", ({ chatId, userId, isTyping }) => {
      socket.broadcast.to(chatId).emit("userTyping", {
        chatId,
        userId,
        isTyping,
      });
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
