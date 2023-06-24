import RoomUtils from "./utils/room.js";
import NotificationUtils from "./utils/notification.js";
import GameUtils from "./utils/game.js";

import cors from "cors";

import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

import bodyParser from "body-parser";

import { Client } from "redis-om";

import { roomSchema } from "./schema/room.schema.js";

import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const client = new Client();
await client.open(process.env.REDIS_URI);

const roomRespository = client.fetchRepository(roomSchema);

export const RoomRepo = roomRespository;

const PORT = process.env.PORT || 3000;

export const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "POST,GET",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const botName = "Game";

// ----------------------- Functions for Room Logic ----------------------- //
async function leave(socket, username, room) {
  await RoomUtils.removePlayerFromRoom(room, username, socket.id);

  io.to(room).emit(
    "notification",
    NotificationUtils.formatNotification(
      botName,
      `${username} has left the game`
    )
  );

  // Send players and room information
  io.to(room).emit("roomPlayers", {
    room: room,
    players: await RoomUtils.getPlayersInRoom(room),
  });

  // Send players and room information
  io.emit("allRooms", {
    rooms: await RoomUtils.getAllRooms(),
  });

  socket.leave(room);
}

async function joinRoom(socket, username, room) {
  socket.join(room);
  // Welcome current player
  socket.emit(
    "notification",
    NotificationUtils.formatNotification(botName, "Welcome to Indian Poker!")
  );

  // Broadcast when a player connects
  socket.broadcast
    .to(room)
    .emit(
      "notification",
      NotificationUtils.formatNotification(
        botName,
        `${username} has joined the game`
      )
    );

  // Send players and room information
  io.to(room).emit("roomPlayers", {
    room: room,
    players: await RoomUtils.getPlayersInRoom(room),
  });

  // Send players and room information
  io.emit("allRooms", {
    rooms: await RoomUtils.getAllRooms(),
  });
}

// Run when client connects
io.on("connection", (socket) => {
  // ----------------------- Socket calls for Room Logic ----------------------- //
  socket.on("authenticated", async () => {
    // Send players and room information
    io.emit("allRooms", {
      rooms: await RoomUtils.getAllRooms(),
    });
  });
  // ----------------------- Socket calls for Room Logic ----------------------- //
  socket.on("deleteRoom", async ({ username, room }) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await RoomUtils.getRoom(room);
      const ownerIn = await RoomUtils.ownerIn(room);
      if (roomObject.owner === username) {
        await RoomUtils.deleteRoom(room);
        io.emit("allRooms", {
          rooms: await RoomUtils.getAllRooms(),
        });
        io.to(room).emit(
          "notification",
          NotificationUtils.formatNotification(
            botName,
            `Room deleted by owner: ${username}, and all players have been removed from the room`
          )
        );
      } else if (roomObject.owner === username && ownerIn) {
        socket.emit("playerExists");
      } else {
        socket.emit("notOwner");
      }
    } else {
      socket.emit("roomDoesNotExist");
    }
  });
  // ----------------------- Socket calls for Room Logic ----------------------- //
  socket.on("createRoom", async ({ username, room, peerId }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    const playerCheck = await RoomUtils.checkPlayerInAnyRoom(username);
    if (roomCheck) {
      socket.emit("roomExists");
    } else if (playerCheck) {
      socket.emit("playerExists");
    } else {
      await RoomUtils.createRoom(room, username, socket.id);
      joinRoom(socket, username, room, peerId);
      callback();
    }
  });
  // ----------------------- Socket calls for Room Logic ----------------------- //
  socket.on("joinRoom", async ({ username, room, peerId }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await RoomUtils.getRoom(room);
      if (roomObject.gameStarted) {
        socket.emit("gameStarted");
        return;
      } else {
        const playerCheck = await RoomUtils.checkPlayerInAnyRoom(username);
        if (playerCheck) {
          socket.emit("playerExists");
        } else {
          const maxPlayers = await RoomUtils.countPlayersInRoom(room);
          if (maxPlayers >= 5) {
            socket.emit("roomFull");
            return;
          }
          await RoomUtils.addPlayerToRoom(room, username, socket.id);

          joinRoom(socket, username, room, peerId);
          callback();
        }
      }
    } else {
      socket.emit("roomDoesNotExist");
    }
  });
  // ----------------------- Socket calls for Room Logic ----------------------- //
  socket.on("leaveRoom", async ({ username, room }) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    const playerInRoom = await RoomUtils.checkPlayerInRoom(room, username);
    if (roomCheck && playerInRoom) {
      leave(socket, username, room);
    }
  });
  // ----------------------- Socket calls for Room Logic ----------------------- //
  socket.on("disconnect", async () => {
    const playerDetails = await RoomUtils.getRoomAndUserName(socket.id);
    if (playerDetails !== null) {
      leave(socket, playerDetails.username, playerDetails.room);
    }
  });

  // ----------------------- Socket calls for Video Calling ----------------------- //
  socket.on("joinVideo", ({ roomId, peerId, username }) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("userConnected", { peerId, username });

    socket.on("leaveRoom", () => {
      socket.broadcast
        .to(roomId)
        .emit("userDisconnected", { peerId, username });
      socket.leave(roomId);
    });

    socket.on("disconnect", () => {
      socket.broadcast
        .to(roomId)
        .emit("userDisconnected", { peerId, username });
    });
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("getRoom", async ({ room }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await RoomUtils.getRoom(room);
      callback(roomObject);
    }
    callback(null);
  });

  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("startGame", async ({ room }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.startGame(room);
      if (roomObject) {
        io.to(room).emit("startGame", { roomObject });
        callback();
      }
    }
    io.to(room).emit("startGame", { roomObject: null });
    callback();
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("payAnte", async ({ room }) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.payAnte(room);
      if (roomObject) {
        io.to(room).emit("payAnte", { roomObject });
      }
    }
    io.to(room).emit("payAnte", { roomObject: null });
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("getCurrentUser", async ({ room }) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.getCurrentUser(room);
      if (roomObject) {
        io.to(room).emit("getCurrentUser", { roomObject });
      }
    }
    io.to(room).emit("getCurrentUser", { roomObject: null });
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("nextRound", async ({ room }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.nextRound(room);
      if (roomObject) {
        io.to(room).emit("nextRound", { roomObject });
        callback();
      }
    }
    io.to(room).emit("nextRound", { roomObject: null });
    callback();
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("updateCurrentUser", async ({ room }) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.updateCurrentUser(room);
      if (roomObject) {
        io.to(room).emit("updateCurrentUser", { roomObject });
      }
    }
    io.to(room).emit("updateCurrentUser", { roomObject: null });
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("onCall", async ({ room }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.onCall(room);
      if (roomObject) {
        io.to(room).emit("onCall", { roomObject });
        callback();
      }
    }
    io.to(room).emit("onCall", { roomObject: null });
    callback();
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("onRaiseConfirm", async ({ room, bet }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.onRaiseConfirm(room, bet);
      if (roomObject) {
        io.to(room).emit("onRaiseConfirm", { roomObject });
        callback();
      }
    }
    io.to(room).emit("onRaiseConfirm", { roomObject: null });
    callback();
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("endRound", async ({ room, users }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.endRound(room, users);
      if (roomObject) {
        io.to(room).emit("endRound", { roomObject });
        callback();
      }
    }
    io.to(room).emit("endRound", { roomObject: null });
    callback();
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("onFold", async ({ room }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.onFold(room);
      if (roomObject) {
        io.to(room).emit("onFold", { roomObject });
        callback();
      }
    }
    io.to(room).emit("onFold", { roomObject: null });
    callback();
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("winnerFound", async ({ room, winner }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.winnerFound(room, winner);
      if (roomObject) {
        io.to(room).emit("winnerFound", { roomObject });
        callback();
      }
    }
    io.to(room).emit("winnerFound", { roomObject: null });
    callback();
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("checkWinner", async ({ room }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const gameDetails = await GameUtils.checkWinner(room);
      callback(gameDetails);
    }
    callback({ winnerIndex: -1, losers: [] });
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("updateCard", async ({ suit, value, username, room }) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.updateCard(
        suit,
        value,
        username,
        room
      );
      if (roomObject) {
        io.to(room).emit("updateCard", { roomObject });
      }
    }
    io.to(room).emit("updateCard", { roomObject: null });
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("updateLosers", async ({ room }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.updateLosers(room);
      if (roomObject) {
        io.to(room).emit("updateLosers", { roomObject });
        callback();
      }
    }
    io.to(room).emit("updateLosers", { roomObject: null });
    callback();
  });
  // ----------------------- Socket calls for Game Logic ----------------------- //
  socket.on("scanCards", async ({ room }, callback) => {
    const roomCheck = await RoomUtils.checkRoom(room);
    if (roomCheck) {
      const roomObject = await GameUtils.scanCards(room);
      if (roomObject) {
        io.to(room).emit("scanCards", { roomObject });
        callback();
      }
    }
    io.to(room).emit("scanCards", { roomObject: null });
    callback();
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
