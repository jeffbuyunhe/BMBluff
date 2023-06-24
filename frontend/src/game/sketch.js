import Card from "./elements/Card.js";
import Video from "./elements/Video.js";
import User from "./elements/User.js";
import Game from "./elements/Game.js";
import Board from "./elements/Board.js";
import { peer as myPeer, socket } from "../connections.js";
import {
  VALUES,
  SUIT_ICONS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  KEY_TO_CARD,
} from "./constants.js";

import { CARD_TO_CARD_SUITS, CARD_TO_CARD_VALUES } from "./constants.js";

import * as tf from "@tensorflow/tfjs";

function sketch(p5) {
  // track users for face calling
  let calls = {};
  let username = "";
  let roomId = "";
  let card, user, video, game, board;

  // Video
  let imageModelURL =
    "https://light-model.s3.us-east-2.amazonaws.com/model.json";
  let detectionModel;
  let videoElement;
  let label = "";

  // Get a prediction for the current video frame
  async function classifyVideo(htmlVideoElement) {
    let tensor = tf.expandDims(tf.browser.fromPixels(htmlVideoElement), 0);
    let result = await detectionModel.executeAsync(tensor);
    let score = result[0].dataSync();
    let cards = result[1].dataSync();
    let indexOfMaxValue = score.reduce(
      (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
      0
    );
    let random = Math.floor(Math.random() * 52) + 1;

    if (score[indexOfMaxValue] < 0.5) {
      game.cardPrompt =
        "You were given a random card due to low accuracy of the model";
      return KEY_TO_CARD[random];
    }
    game.cardPrompt =
      "Tensorflow detected your card with " +
      Math.round(score[indexOfMaxValue] * 100) +
      "% accuracy";
    return KEY_TO_CARD[cards[indexOfMaxValue]];
  }

  p5.setup = () => {
    // Get Room Name
    const room = window.location.pathname.split("/")[2];
    let username = window.location.pathname.split("/")[3];
    username = username.replace("%20", " ");

    p5.createCanvas(1600, 850);
    calls = {};
    board = new Board(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, p5);
    game = new Game(50, board, p5, socket, room, username);

    const addUser = (stream, username) => {
      socket.emit("getRoom", { room }, (roomObject) => {
        if (roomObject) {
          video = new Video(0, 0, stream, p5);
          card = new Card(0, 0, SUIT_ICONS["clubs"], VALUES[2], true, p5);
          user = new User(0, 0, username, card, video, p5);
          game.addUser(user);
        }
      });
    };

    const readCard = async () => {
      let cardDetails = await classifyVideo(videoElement.elt);
      if (cardDetails) {
        let card_value = CARD_TO_CARD_VALUES[cardDetails.slice(0, -1)];
        let card_suit = CARD_TO_CARD_SUITS[cardDetails.slice(-1)];

        socket.emit("updateCard", {
          suit: SUIT_ICONS[card_suit],
          value: VALUES[card_value],
          username,
          room,
        });
      }
    };

    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        video = new Video(0, 0, stream, p5);
        videoElement = video.mediaElement;
        videoElement.elt.muted = true;

        card = new Card(0, 0, SUIT_ICONS["clubs"], VALUES[2], true, p5);
        user = new User(0, 0, username, card, video, p5);
        game.addUser(user);

        tf.loadGraphModel(imageModelURL).then(async (model) => {
          detectionModel = model;
        });

        // when users exist prior to joining room
        myPeer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            if (!calls[call.peer]) {
              addUser(userVideoStream, call.metadata.username);
              calls[call.peer] = call;
            }
          });
        });

        socket.on(
          "userConnected",
          ({ peerId, username: connectedUsername }) => {
            const call = myPeer.call(peerId, stream, {
              metadata: { username },
            });
            // when another users join after joining room
            call.on("stream", (userVideoStream) => {
              if (!calls[peerId]) {
                addUser(userVideoStream, connectedUsername);
                calls[peerId] = call;
              }
            });
          }
        );

        socket.emit("joinVideo", {
          roomId,
          peerId: myPeer.id,
          username: username,
        });
      });
    socket.on("userDisconnected", ({ peerId, username }) => {
      if (calls[peerId]) {
        calls[peerId].close();
        delete calls[peerId];
      }
      game.removeUser(username);
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("startGame", ({ roomObject }) => {
      if (roomObject) {
        // Set User List
        let temp = game.users;
        game.users = [];
        for (let i = 0; i < roomObject.players.length; i++) {
          for (let j = 0; j < temp.length; j++) {
            if (temp[j].graphicname === roomObject.players[i]) {
              game.users.push(temp[j]);
              break;
            }
          }
        }
        let time = 8;
        const countdown = setInterval(() => {
          game.cardPrompt =
            "Starting new round, analyzing cards in " + time + " seconds.";
          if (time === 0) {
            clearInterval(countdown);
            readCard();
            game.cardPrompt = "";

            //set current user to be first user in userQueue, set turn order
            game.currentUser = roomObject.currentUser;
            let userQueueInt = [];
            for (let i = 0; i < roomObject.userQueue.length; i++) {
              userQueueInt.push(parseInt(roomObject.userQueue[i]));
            }
            game.losers = [];
            game.userQueue = userQueueInt;
            game.btnStart.hide();
            game.gameStarted = roomObject.gameStarted;
          } else {
            time--;
          }
        }, "1000");
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("payAnte", ({ roomObject }) => {
      if (roomObject) {
        //all users pay ante to add to pot
        for (let index = 0; index < roomObject.players.length; index++) {
          game.users[index].updateBalance(
            parseInt(roomObject.player_balance[index])
          );
        }
        game.pot.balance = roomObject.pot;
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("nextRound", ({ roomObject }) => {
      if (roomObject) {
        let userQueueInt = [];
        for (let i = 0; i < roomObject.userQueue.length; i++) {
          userQueueInt.push(parseInt(roomObject.userQueue[i]));
        }
        game.round = roomObject.round;
        game.userQueue = userQueueInt;
        game.currentUser = roomObject.currentUser;
        // game.payAnte();
        game.callValue = roomObject.ante;
        for (let index = 0; index < roomObject.player_moves.length; index++) {
          game.users[index].move = roomObject.player_moves[index];
        }
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("scanCards", async ({ roomObject }) => {
      //set a timeout here + countdown to give users time to raise their cards
      if (roomObject) {
        // Scan Cards
        game.roundEnd = false;
        let time = 8;
        const countdown = setInterval(() => {
          game.cardPrompt =
            "Starting new round, analyzing cards in " + time + " seconds.";
          if (time === 0) {
            clearInterval(countdown);
            readCard();
            game.cardPrompt = "";
          } else {
            time--;
          }
        }, "1000");
      }
    });

    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("updateCurrentUser", ({ roomObject }) => {
      if (roomObject) {
        game.currentUser = roomObject.currentUser;
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("onCall", ({ roomObject }) => {
      if (roomObject) {
        let index = roomObject.userQueue[roomObject.currentUser];
        game.users[index].move = roomObject.player_moves[index];
        game.users[index].updateBalance(
          parseInt(roomObject.player_balance[index])
        );
        game.pot.balance = roomObject.pot;
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("onRaiseConfirm", ({ roomObject }) => {
      if (roomObject) {
        let index = game.userQueue[game.currentUser];
        game.users[index].move = roomObject.player_moves[index];
        game.users[index].updateBalance(
          parseInt(roomObject.player_balance[index])
        );
        game.pot.balance = roomObject.pot;
        game.userQueue = roomObject.userQueue;
        game.callValue = roomObject.callValue;
        game.currentUser = roomObject.currentUser;
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("endRound", ({ roomObject }) => {
      game.roundEnd = true;
      if (roomObject) {
        game.pot.balance = roomObject.pot;
        if (roomObject.winnerIndex.length > 1) {
          for (let i = 0; i < roomObject.winnerIndex.length; i++) {
            game.users[parseInt(roomObject.winnerIndex[i])].updateBalance(
              parseInt(
                roomObject.player_balance[parseInt(roomObject.winnerIndex[i])]
              )
            );
          }
          let winnersAnnouncement = "";
          for (let i = 0; i < roomObject.winnerIndex.length; i++) {
            winnersAnnouncement +=
              game.users[parseInt(roomObject.winnerIndex[i])].graphicname +
              "\n";
          }
          game.announcement = "Last Round Winners: \n" + winnersAnnouncement;
        } else {
          game.users[parseInt(roomObject.winnerIndex[0])].updateBalance(
            parseInt(
              roomObject.player_balance[parseInt(roomObject.winnerIndex[0])]
            )
          );
          game.announcement =
            "Last Round Winner: \n" +
            game.users[parseInt(roomObject.winnerIndex[0])].graphicname;
        }
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("onFold", ({ roomObject }) => {
      if (roomObject) {
        let index = roomObject.userQueue[roomObject.currentUser];
        game.users[index].move = roomObject.player_moves[index];
        game.users[index].card.initFoldedCard();
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("winnerFound", ({ roomObject }) => {
      if (roomObject) {
        game.gameStarted = roomObject.gameStarted;
        game.pot.balance = roomObject.pot;
        game.callValue = roomObject.callValue;

        for (let index = 0; index < roomObject.player_moves.length; index++) {
          game.users[index].move = roomObject.player_moves[index];
          game.users[index].updateBalance(
            parseInt(roomObject.player_balance[index])
          );
        }

        alert("Winner is: " + roomObject.winner + ", starting new game...");
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("updateCard", ({ roomObject }) => {
      if (roomObject) {
        for (let index = 0; index < roomObject.players.length; index++) {
          game.users[index].card = new Card(
            0,
            0,
            SUIT_ICONS[roomObject.player_card_suit[index]],
            VALUES[parseInt(roomObject.player_card_value[index])],
            false,
            p5
          );
          game.users[index].card.initCard();
        }
      }
    });
    // ----------------------- Socket calls for Game Logic ----------------------- //
    socket.on("updateLosers", ({ roomObject }) => {
      if (roomObject) {
        let tempLosers = [];
        for (let index = 0; index < roomObject.losers.length; index++) {
          tempLosers.push(parseInt(roomObject.losers[index]));
        }
        game.losers = tempLosers;
      }
    });

    game.initGame(p5);
  };

  p5.updateWithProps = (newProps) => {
    username = newProps.username;
    roomId = newProps.roomId;
  };

  p5.draw = () => {
    game.drawGame(p5);
  };
}

export default sketch;
