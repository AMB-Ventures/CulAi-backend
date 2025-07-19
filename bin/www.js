var app = require("../server");
var http = require("http");
const socketIo = require("socket.io");

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
var server = http.createServer(app);
var port = normalizePort(process.env.PORT || "4000");

app.set("port", port);

const io = socketIo(server, {
  path: "/socket",
  cors: {
    origins: [
      "https://console-culinks.vercel.app, http://localhost:3000",
      "https://console.cul-ai.com",
      "https://cul-ai-frontend.fly.dev",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST"],
  },
});

app.io = io;

io.on("connection", (socket) => {
  // socket.emit("hello", "world");
  console.log("A user connected");

  // socket.emit("order-placed", { orderId: 'aoiwefjaio'});

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port);
