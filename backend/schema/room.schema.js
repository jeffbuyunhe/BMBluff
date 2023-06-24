import { Entity, Schema } from "redis-om";

class Room extends Entity {
  toJSON() {
    return {
      name: this.name,
      owner: this.owner,
      ownerIn: this.ownerIn,
      total_player: this.total_player,
      players: this.players,
      players_id: this.players_id,
      status: this.status,
      date: this.date,
      gameStarted: this.gameStarted,
      player_balance: this.player_balance,
      pot: this.pot,
      ante: this.ante,
      startingBalance: this.startingBalance,
      callValue: this.callValue,
      currentUser: this.currentUser,
      userQueue: this.userQueue,
      player_moves: this.player_moves,
      player_card_value: this.player_card_value,
      player_card_suit: this.player_card_suit,
      winnerIndex: this.winnerIndex,
      round: this.round,
      winner: this.winner,
      losers: this.losers,
    };
  }
}

export const roomSchema = new Schema(
  Room,
  {
    name: {
      type: "string",
      required: true,
      unique: true,
    },
    owner: {
      type: "string",
      required: true,
    },
    ownerIn: {
      type: "boolean",
      required: true,
    },
    total_player: {
      type: "number",
      required: true,
    },
    players: {
      type: "string[]",
      required: true,
    },
    players_id: {
      type: "string[]",
      required: true,
    },
    status: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      required: true,
    },
    gameStarted: {
      type: "boolean",
      required: false,
      default: false,
    },
    player_balance: {
      type: "string[]",
      required: true,
    },
    pot: {
      type: "number",
      required: false,
      default: 0,
    },
    ante: {
      type: "number",
      required: false,
      default: 50,
    },
    startingBalance: {
      type: "number",
      required: false,
      default: 1000,
    },
    callValue: {
      type: "number",
      required: false,
    },
    currentUser: {
      type: "number",
      required: false,
    },
    userQueue: {
      type: "string[]",
      required: false,
      default: [],
    },
    player_moves: {
      type: "string[]",
      required: false,
    },
    player_card_value: {
      type: "string[]",
      required: false,
    },
    player_card_suit: {
      type: "string[]",
      required: false,
    },
    winnerIndex: {
      type: "string[]",
      required: false,
    },
    round: {
      type: "number",
      required: false,
      default: 0,
    },
    winner: {
      type: "string",
      required: false,
    },
    losers: {
      type: "string[]",
      required: false,
    },
  },
  {
    dataStructure: "JSON",
  }
);
