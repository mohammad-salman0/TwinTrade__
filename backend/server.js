require("dotenv").config();

const http = require("http");

const { Server } = require("socket.io");

const app = require("./src/app");

const connectDB = require("./src/config/db");

const aiRoutes = require("./src/routes/aiRoutes");

/*
====================================
 CONNECT DATABASE
====================================
*/

connectDB();

/*
====================================
 AI ROUTES
====================================
*/

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

/*
====================================
 CREATE HTTP SERVER
====================================
*/

const server = http.createServer(app);

/*
====================================
 SOCKET SERVER
====================================
*/

const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
// const io =
//  new Server(server, {

//   cors: {

//    origin:
//     "http://localhost:3000",

//    methods: [
//     "GET",
//     "POST",
//    ],

//   },

//  })

/*
====================================
 SOCKET CONNECTION
====================================
*/

io.on(
  "connection",

  (socket) => {
    console.log("User connected");

    socket.on(
      "disconnect",

      () => {
        console.log("User disconnected");
      },
    );
  },
);

/*
====================================
 SOCKET LIVE PRICES DISABLED
 FREE API LIMIT TOO LOW
====================================
*/

/*
====================================
 START SERVER
====================================
*/

server.listen(
  PORT,

  () => {
    console.log(`Server running on port ${PORT}`);
  },
);
