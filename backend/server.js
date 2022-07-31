const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const Daily = require('./utils/Daily')


dotenv.config({ path: "./config.env" }); //I think we have to config before

const app = require("./app");

Daily.resetTrials()

const whitelist = [
  "http://localhost:3000",
  "http://localhost:19006",
  "http://localhost:8081",
  "https://spectacular-granita-d9ed1d.netlify.app/"
];

var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true,
};

const server = http.createServer(app);
const io =  require("socket.io")(server, { cors: {
  origin: '*',
}});

let users = [];

const addUser = (userId, socketId) => {
  console.log(userId, socketId)
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("socket.id", socket.id);
  //take userId and socketId from user
  socket.on("hello", () => { 
    console.log("hello reached")
  })

  socket.on("addUser", (userId) => {
    addUser(userId.user, socket.id);
    console.log(userId.user, socket.id)
    // io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, timestamp }) => {
    const user = getUser(receiverId);
    console.log(receiverId, users, user)
    if (user) { 
      io.to(user.socketId).emit("getMessage", {
        timestamp: timestamp,
        text: text,
        sender: senderId,
      });
    } else { 
      console.log('user not logged in yet so no need for immediate communication.')
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

mongoose
  .connect(`${process.env.DATABASE}`)
  .then(() => {
    console.log("DB Connection Success");
  }).catch(err => { 
    // console.log(err)
  });


const port = process.env.PORT || 8081;
server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

module.exports = app;


// // HEROKU
// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION! Shutting down...");
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on("SIGTERM", () => {
//   console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
//   server.close(() => {
//     console.log("💥 Process terminated!");
//   });
// });
