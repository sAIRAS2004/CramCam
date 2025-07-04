/**
 * 💖 Project: CramCam - Study Together
 * ✨ Description: Backend server for an anime-style, Zoom-like video app tailored for virtual study groups.
 * 🧠 Author: Saira Shakeel
 * © 2025 Saira Shakeel. All rights reserved.
 */

const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const url = require("url");
const path = require("path");

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// 🌸 Set view engine
app.set("view engine", "ejs");

// 🌸 Serve static assets from /public (mapped to /static)
app.use("/public", express.static(path.join(__dirname, "static")));

// 🌸 PeerJS route
app.use("/peerjs", peerServer);

// 🌸 Landing page - the CramCam homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

// 🌸 Create new study room with unique ID
app.get("/join", (req, res) => {
  res.redirect(
    url.format({
      pathname: `/join/${uuidv4()}`,
      query: req.query,
    })
  );
});

// 🌸 Join an existing room by meeting ID
app.get("/joinold", (req, res) => {
  res.redirect(
    url.format({
      pathname: req.query.meeting_id,
      query: req.query,
    })
  );
});

// 🌸 Render the EJS room with session info
app.get("/join/:rooms", (req, res) => {
  res.render("room", { roomid: req.params.rooms, Myname: req.query.name });
});

// 🌸 Handle WebSocket (socket.io) connections
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, id, myname) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", id, myname);

    socket.on("messagesend", (message) => {
      console.log("[Chat]", message);
      io.to(roomId).emit("createMessage", message);
    });

    socket.on("tellName", (myname) => {
      console.log("[Name Shared]", myname);
      socket.to(roomId).broadcast.emit("AddName", myname);
    });

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", id);
    });
  });
});

// 🌸 Start the server on PORT 3030 or env-defined port
const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`🌸 CramCam Server is live on http://localhost:${PORT}`);
});
