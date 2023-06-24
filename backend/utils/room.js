import { RoomRepo } from "../app.js";

export const VALUES = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "11",
  12: "12",
  13: "13",
  14: "14",
};

export const SUIT_ICONS = {
  0: "clubs",
  1: "spades",
  2: "diamonds",
  3: "hearts",
};

export default class RoomUtils {
  static async checkRoom(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      return true;
    }
    return false;
  }

  static async createRoom(roomName, username, socketId) {
    // ---------- For Redis ----------
    const room = RoomRepo.createEntity();

    room.entityId = roomName;
    room.name = roomName;
    room.owner = username;
    room.ownerIn = true;
    room.total_player = 1;
    room.players = [username];
    room.players_id = [socketId];
    room.player_balance = ["1000"];
    room.player_moves = [""];
    let count = Math.random() * 100;
    room.player_card_value = [VALUES[(Math.floor(count) % 13) + 2]];
    room.player_card_suit = [SUIT_ICONS[Math.floor(count) % 4]];
    room.ante = 50;
    room.pot = 0;
    room.gameStarted = false;
    room.status = "Waiting";
    room.callValue = room.ante;
    room.date = new Date();

    await RoomRepo.save(room);
  }

  static async deleteRoom(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      await RoomRepo.remove(roomName);
    }
  }

  static async addPlayerToRoom(roomName, username, socketId) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room.owner === username && !room.ownerIn) {
      room.total_player += 1;
      room.players_id.push(socketId);
      room.players.push(username);
      room.player_balance.push("1000");
      room.player_moves.push("");
      let count = Math.random() * 100;
      room.player_card_value.push(VALUES[(Math.floor(count) % 13) + 2]);
      room.player_card_suit.push(SUIT_ICONS[Math.floor(count) % 4]);
      room.ownerIn = true;
      await RoomRepo.save(room);
    } else if (room.owner !== username) {
      room.total_player += 1;
      room.players.push(username);
      room.players_id.push(socketId);
      room.player_balance.push("1000");
      room.player_moves.push("");
      let count = Math.random() * 100;
      room.player_card_value.push(VALUES[(Math.floor(count) % 13) + 2]);
      room.player_card_suit.push(SUIT_ICONS[Math.floor(count) % 4]);
      await RoomRepo.save(room);
    }
  }
  static async removePlayerFromRoom(roomName, username, socketId) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room.owner === username && room.ownerIn) {
      const index = room.players.indexOf(username);
      room.total_player -= 1;
      room.players_id = room.players_id.filter(
        (playerId) => playerId !== socketId
      );
      room.players = room.players.filter((player) => player !== username);
      room.player_balance = room.player_balance.splice(index, 1);
      room.player_moves = room.player_moves.splice(index, 1);
      if (room.player_card_value && room.player_card_suit) {
        room.player_card_value = room.player_card_value.splice(index, 1);
        room.player_card_suit = room.player_card_suit.splice(index, 1);
      }
      room.ownerIn = false;
      await RoomRepo.save(room);
    } else if (room.owner !== username) {
      room.total_player -= 1;
      const index = room.players.indexOf(username);
      room.players = room.players.filter((player) => player !== username);
      room.players_id = room.players_id.filter(
        (playerId) => playerId !== socketId
      );
      room.player_balance = room.player_balance.splice(index, 1);
      room.player_moves = room.player_moves.splice(index, 1);
      if (room.player_card_value && room.player_card_suit) {
        room.player_card_value = room.player_card_value.splice(index, 1);
        room.player_card_suit = room.player_card_suit.splice(index, 1);
      }
      await RoomRepo.save(room);
    }
  }

  static async getRoom(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      return room;
    }
    return null;
  }

  static async getAllRooms() {
    // ---------- For Redis ----------
    const rooms = await RoomRepo.search().returnAll();
    if (rooms) {
      return rooms;
    }
    return [];
  }

  static async getPlayersInRoom(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      const players = room.players;
      return players;
    }
    return [];
  }

  static async checkPlayerInRoom(roomName, username) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      const player = room.players.includes(username);
      if (player)
        if (room.owner === username) {
          return room.ownerIn;
        } else if (room.owner !== username) {
          return true;
        }
    }
    return false;
  }

  static async checkPlayerInAnyRoom(username) {
    // ---------- For Redis ----------
    const rooms = await RoomRepo.search().returnAll();
    const boolList = [false];
    if (rooms) {
      for (const room of rooms) {
        const player = room.players.includes(username);
        if (player) {
          if (room.owner === username) {
            boolList.push(room.ownerIn);
          } else if (room.owner !== username) {
            return true;
          }
        }
      }
    }
    return boolList.includes(true);
  }

  static async getRoomAndUserName(socketId) {
    // ---------- For Redis ----------
    const rooms = await RoomRepo.search().returnAll();
    if (rooms) {
      for (const room of rooms) {
        const player = room.players_id.includes(socketId);
        if (player) {
          const username = room.players[room.players_id.indexOf(socketId)];
          return { room: room.name, username: username };
        }
      }
    }
    return null;
  }

  static async ownerIn(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      return room.ownerIn;
    }
  }

  static async countPlayersInRoom(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      if (room.ownerIn) {
        return room.total_player - 1;
      }
      return room.total_player;
    }
  }
}
