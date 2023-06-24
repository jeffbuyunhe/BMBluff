import { RoomRepo } from "../app.js";

const ROOM_STATUS = {
  Waiting: "Waiting",
  InGame: "InGame",
};

export const SUIT_ICONS = {
  0: "clubs",
  1: "spades",
  2: "diamonds",
  3: "hearts",
};

const ICONS = {
  "♣": 0,
  "♠": 1,
  "♦": 2,
  "♥": 3,
};
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

const SUIT_VALUES = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const SUIT_VALUES_STORE = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  J: "11",
  Q: "12",
  K: "13",
  A: "14",
};

export default class GameUtils {
  static async startGame(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      room.currentUser = 0;
      room.userQueue = Array.from(Array(room.players.length).keys());
      room.gameStarted = true;
      room.round = 1;
      room.winner = "";
      room.losers = [];
      room.status = ROOM_STATUS.InGame;
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async payAnte(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      let minBet;
      for (let i = 0; i < room.players.length; i++) {
        minBet = Math.min(room.ante, parseInt(room.player_balance[i]));
        let temp = parseInt(room.player_balance[i]) - minBet;
        room.player_balance[i] = temp.toString();
        room.pot += minBet;
      }
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async getCurrentUser(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      return room;
    }
    return null;
  }

  static async updateCurrentUser(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      room.currentUser = room.currentUser + 1;
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async onCall(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      let index = room.userQueue[room.currentUser];
      let bet = Math.min(room.callValue, parseInt(room.player_balance[index]));
      let amount = parseInt(room.player_balance[index]) - bet;
      room.player_balance[index] = amount.toString();
      room.pot += bet;
      room.player_moves[index] = "Call";
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async onRaiseConfirm(roomName, bet) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      let index = room.userQueue[room.currentUser];
      let amount = parseInt(room.player_balance[index]) - bet;
      room.player_balance[index] = amount.toString();
      room.player_moves[index] = "Raise";
      room.userQueue = room.userQueue
        .slice(room.currentUser)
        .concat(room.userQueue.slice(0, room.currentUser));
      room.currentUser = 0;
      room.pot += bet;
      room.callValue = bet;
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async endRound(roomName, users) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      const playerValues = [];
      for (let i = 0; i < room.players.length; i++) {
        playerValues.push(SUIT_VALUES[users[i]]);
      }
      let max = -1;
      for (let index = 0; index < playerValues.length; index++) {
        if (playerValues[index] > max && room.player_moves[index] !== "Fold") {
          max = playerValues[index];
        }
      }
      const winners = [];
      if (max === -1) {
        winners.push(room.userQueue[room.userQueue.length - 1].toString());
      } else {
        for (let i = 0; i < playerValues.length; i++) {
          if (playerValues[i] === max) {
            winners.push(i.toString());
          }
        }
      }
      room.winnerIndex = winners;
      if (winners.length === 1) {
        let balance =
          parseInt(room.player_balance[winners[0]]) + parseInt(room.pot);
        room.player_balance[winners[0]] = balance.toString();
      } else {
        const splitPot = parseInt(room.pot / winners.length);
        for (let i = 0; i < winners.length; i++) {
          let balance =
            parseInt(room.player_balance[winners[i]]) + parseInt(splitPot);
          room.player_balance[winners[i]] = balance.toString();
        }
      }
      room.pot = 0;
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async nextRound(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      let nextTurn = room.round % room.players.length;
      let tempQueue = Array.from(Array(room.players.length).keys());
      room.userQueue = tempQueue
        .slice(nextTurn)
        .concat(tempQueue.slice(0, nextTurn));
      room.round += 1;
      room.currentUser = 0;
      room.callValue = room.ante;
      for (let index = 0; index < room.player_moves.length; index++) {
        room.player_moves[index] = "";
        // let count = Math.random() * 100;
        // room.player_card_value[index] = VALUES[(Math.floor(count) % 13) + 2];
        // room.player_card_suit[index] = SUIT_ICONS[Math.floor(count) % 4];
      }
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async winnerFound(roomName, winner) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      let winner_name = room.players[winner];
      room.status = ROOM_STATUS.Waiting;
      room.gameStarted = false;
      room.winnerIndex = [];
      room.round = 0;
      room.winner = winner_name;
      room.pot = 0;
      room.callValue = room.ante;

      for (let index = 0; index < room.player_moves.length; index++) {
        room.player_moves[index] = "";
        // let count = Math.random() * 100;
        // room.player_card_value[index] = VALUES[(Math.floor(count) % 13) + 2];
        // room.player_card_suit[index] = SUIT_ICONS[Math.floor(count) % 4];
        room.player_balance[index] = "1000";
      }

      await RoomRepo.save(room);
      return room;
    }
  }

  static async onFold(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      let index = room.userQueue[room.currentUser];
      room.player_moves[index] = "Fold";
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async checkWinner(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      let balance_list = [];
      for (let index = 0; index < room.player_balance.length; index++) {
        balance_list.push(parseInt(room.player_balance[index]));
      }
      let m = 0;
      let l = 0;
      let winnerIndex = -1;
      let losers = [];
      for (let j = 0; j < balance_list.length; j++) {
        if (balance_list[j] > 0) {
          winnerIndex = j;
          m++;
        } else {
          losers.push(j.toString());
          l++;
        }
      }
      room.losers = losers;
      await RoomRepo.save(room);
      if (m === 1 && l === room.players.length - 1) {
        return { winnerIndex: winnerIndex, losers: losers };
      } else {
        return { winnerIndex: -1, losers: losers };
      }
    }
  }

  static async updateCard(suit, value, username, roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      let index = room.players.indexOf(username);
      room.player_card_suit[index] = SUIT_ICONS[ICONS[suit]];
      room.player_card_value[index] = SUIT_VALUES_STORE[value];
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async updateLosers(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }

  static async scanCards(roomName) {
    // ---------- For Redis ----------
    const room = await RoomRepo.search().where("name").eq(roomName).first();
    if (room) {
      await RoomRepo.save(room);
      return room;
    }
    return null;
  }
}
