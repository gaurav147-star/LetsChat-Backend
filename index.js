const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/message");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
dotenv.config();
app.use(cors());
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error ", err);
  });



app.use("/api/user", userRoutes)
app.use("/api/message", messageRoutes)

app.listen(port, () => {
  console.log("Server running on port", port);
});


const server = http.createServer(app);
const io = socketIo(server);


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (formData) => {

    // Handle form data, e.g., save file
    // fs.writeFile('file.txt', formData.get('text'));
    io.emit('message', formData); // Broadcast message to all clients
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});