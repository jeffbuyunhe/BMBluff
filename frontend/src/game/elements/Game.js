import {
  ANNOUNCE_CURRENT_TURN,
  ANNOUNCE_PLAYER_COUNT,
  ANNOUNCE_WAITING_TO_START,
  CANVAS_WIDTH,
  PLAYER_CHIP_COORDINATES,
  PLAYER_COORDINATES,
  POT_TEXT_X,
  POT_TEXT_Y,
} from "../constants";
import Button from "./Button";
import {
  BUTTON_CALL_X,
  BUTTON_FOLD_X,
  BUTTON_RAISE_X,
  BUTTON_Y,
  INPUT_X,
  POT_X,
  POT_Y,
} from "../constants";
import Slider from "./Slider";
import Input from "./Input";
import callMp3 from "../../assets/call.mp3"; //From 'joeyed' on pixabay.com
import raiseMp3 from "../../assets/raise.mp3"; //From 'Za-Games' on pixabay.com
import cardFlipMp3 from "../../assets/flipcard.mp3"; //From 'Splashdust' on pixabay.com
import Chips from "./Chips";
let btnCall, btnRaise, sliderRaise, inputRaise, btnRaiseConfirm, btnFold;
let callAudio, raiseAudio, cardFlipAudio;
export default class Game {
  constructor(ante, board, p5, socket, room, userName) {
    this.p5 = p5;
    this.socket = socket;
    this.room = room;
    this.userName = userName;
    this.gameStarted = false;
    this.announcement = "";
    this.cardPrompt = "";
    this.round = 1;
    this.board = board;
    this.pot = new Chips(POT_X, POT_Y, 0, false, p5);
    this.users = [];
    this.userQueue = [];
    this.ante = ante; //ante is the initial amount everyone puts into the pot at the start of the betting round
    this.callValue = ante; //callValue is the minimum amount user has to bet (equal to previous users bet)
    this.losers = [];
    this.roundEnd = false;
  }

  initGame(p5) {
    this.initSounds();
    this.board.initBoard();
    this.initStart(p5);
    this.generateInteractables(p5);
  }

  drawGame(p5) {
    //draw background
    p5.background(242);

    //draw board
    p5.imageMode(p5.CENTER);
    this.board.show(p5);

    p5.imageMode(p5.CORNER);
    for (let i = 0; i < this.users.length; i++) {
      //draw user UI
      if (!this.gameStarted) {
        if (this.userName === this.users[i].graphicname) {
          this.users[i].initHiddenUser(p5);
        } else {
          this.users[i].initStartUser(p5);
        }
      } else if (
        this.users[i].graphicname === this.userName &&
        !this.roundEnd
      ) {
        this.users[i].initHiddenUser(p5);
      } else if (this.roundEnd) {
        this.users[i].initShowdownUser(p5);
      } else {
        this.users[i].initUser(p5);
      }
      this.users[i].x = PLAYER_COORDINATES[i].x;
      this.users[i].y = PLAYER_COORDINATES[i].y;
      this.users[i].show(p5);

      //draw user's chips
      this.users[i].chips.x = PLAYER_CHIP_COORDINATES[i].x;
      this.users[i].chips.y = PLAYER_CHIP_COORDINATES[i].y;
      this.users[i].chips.show(p5);

      //draw turn indicator and round number
      p5.textFont("Outfit");
      p5.textAlign(p5.LEFT);
      p5.textSize(16);
      if (this.getCurrentUser() !== undefined && this.gameStarted) {
        p5.text(
          ANNOUNCE_CURRENT_TURN + this.getCurrentUser().graphicname,
          60,
          30
        );
        p5.textSize(24);
        p5.text("Round: " + this.round, 1420, 60);
        p5.textSize(16);
      } else {
        p5.text(ANNOUNCE_WAITING_TO_START, 60, 40);
        p5.text(ANNOUNCE_PLAYER_COUNT, 40, 60);
      }

      //draw round winners
      p5.text(this.announcement, 60, 120);

      //draw card prompt
      p5.textAlign(p5.CENTER);
      p5.textSize(24);
      p5.text(this.cardPrompt, CANVAS_WIDTH / 2 - 10, 340);
    }
    //draw buttons
    if (this.gameStarted) {
      this.updateInteractables(this.getCurrentUser());
      this.drawPot(p5);
    } else {
      this.socket.emit("getRoom", { room: this.room }, (roomObject) => {
        if (roomObject && roomObject.owner === this.userName) {
          this.drawStart();
        }
      });
    }
  }

  drawPot(p5) {
    p5.textFont("Outfit");
    p5.textSize(16);
    p5.textAlign(p5.CENTER);
    p5.text("Current Pot: " + this.pot.balance, POT_TEXT_X, POT_TEXT_Y);
    this.pot.show(p5);
  }

  initSounds() {
    callAudio = new Audio(callMp3);
    raiseAudio = new Audio(raiseMp3);
    cardFlipAudio = new Audio(cardFlipMp3);
  }

  initStart(p5) {
    this.btnStart = new Button(
      BUTTON_RAISE_X,
      BUTTON_Y,
      "Start Game"
    ).generateButton(p5);
    this.btnStart.mousePressed(() => {
      this.socket.emit("getRoom", { room: this.room }, (roomObject) => {
        if (roomObject && roomObject.owner === this.userName) {
          if (roomObject.players.length < 2) {
            return;
          }
          this.startGame();
          this.btnStart.attribute("disabled", "");
        }
      });
    });
  }

  generateInteractables(p5) {
    //create buttons seperately and set position
    btnCall = new Button(
      BUTTON_CALL_X,
      BUTTON_Y,
      "Call: " + this.ante
    ).generateButton(p5);
    btnCall.mousePressed(() => {
      this.onCall(this.users, this.callValue);
    });

    btnRaise = new Button(BUTTON_RAISE_X, BUTTON_Y, "Raise").generateButton(p5);
    btnRaise.mousePressed(() => {
      this.onRaise(this.callValue);
    });

    btnFold = new Button(BUTTON_FOLD_X, BUTTON_Y, "Fold").generateButton(p5);
    btnFold.mousePressed(() => {
      this.onFold(this.users);
    });

    inputRaise = new Input(
      INPUT_X,
      BUTTON_Y + 75,
      this.callValue + 1
    ).generateInput(p5);
    inputRaise.input(this.updateRaiseSliderValue);
    inputRaise.id("inputRaise");

    sliderRaise = new Slider(
      BUTTON_CALL_X,
      BUTTON_Y + 85,
      this.callValue + 1,
      this.callValue + 2
    ).generateSlider(p5);
    sliderRaise.input(this.updateRaiseInputValue);
    sliderRaise.id("sliderRaise");

    btnRaiseConfirm = new Button(1075, BUTTON_Y + 75, "Ok").generateMiniButton(
      p5
    );
    btnRaiseConfirm.mousePressed(() => {
      this.onRaiseConfirm(this.users);
    });
  }

  drawStart() {
    this.btnStart.show();
  }

  updateInteractables(user) {
    this.btnStart.hide();
    if (
      this.getCurrentUser() !== undefined &&
      this.getCurrentUser().graphicname === this.userName
    ) {
      //modify button text and options to be accurate to user's balance
      if (this.callValue >= user.balance) {
        btnCall.html("All In");
        btnRaise.hide();
      } else {
        btnRaise.show();
        btnCall.html("Call: " + this.callValue);
      }

      //set slider's max to be user balance
      document.getElementById("sliderRaise").min = this.callValue + 1;
      document.getElementById("sliderRaise").max = user.balance;

      //set input to only contain numbers between call value and user's balance
      document.getElementById("inputRaise").type = "number";
      document.getElementById("inputRaise").min = this.callValue + 1;
      document.getElementById("inputRaise").max = user.balance;

      if (this.isLoser()) {
        btnCall.hide();
        this.updateCurrentUser();
      } else {
        btnCall.show();
      }
      btnFold.show();
    } else {
      btnCall.hide();
      btnFold.hide();
      btnRaise.hide();
      inputRaise.hide();
      sliderRaise.hide();
      btnRaiseConfirm.hide();
    }
  }

  updateRaiseSliderValue() {
    //sets slider's value to equal the input field
    if (inputRaise.value().length === 0) {
      return;
    } else {
      sliderRaise.value(inputRaise.value());
    }
  }

  updateRaiseInputValue() {
    //sets input's value to equal the slider's value
    inputRaise.value(sliderRaise.value());
  }

  //game functions
  startGame() {
    // ----------------------- Socket calls for Game Logic ----------------------- //
    this.socket.emit("startGame", { room: this.room }, () => {
      this.payAnte();
    });
  }

  getCurrentUser() {
    return this.users[this.userQueue[this.currentUser]];
  }

  updateCurrentUser() {
    //start new round if user was last, otherwise go to next user's turn
    if (this.currentUser === this.userQueue.length - 1) {
      this.endRound();
    } else {
      // ----------------------- Socket calls for Game Logic ----------------------- //
      this.socket.emit("updateCurrentUser", { room: this.room });
    }
  }

  endRound() {
    // end round and reset values
    let userValues = [];
    for (let i = 0; i < this.users.length; i++) {
      userValues.push(this.users[i].card.value);
    }
    // ----------------------- Socket calls for Game Logic ----------------------- //
    this.socket.emit("endRound", { room: this.room, users: userValues }, () => {
      btnCall.attribute("disabled", "");
      btnFold.attribute("disabled", "");
      btnRaise.attribute("disabled", "");
      inputRaise.attribute("disabled", "");
      sliderRaise.attribute("disabled", "");
      btnRaiseConfirm.attribute("disabled", "");
      setTimeout(() => {
        this.scanCards();
      }, "3000");
    });
    callAudio.play();
  }

  scanCards() {
    // ----------------------- Socket calls for Game Logic ----------------------- //
    this.socket.emit("scanCards", { room: this.room }, () => {
      setTimeout(() => {
        this.nextRound();
      }, "10000");
    });
  }

  nextRound() {
    btnCall.removeAttribute("disabled");
    btnFold.removeAttribute("disabled");
    btnRaise.removeAttribute("disabled");
    inputRaise.removeAttribute("disabled");
    sliderRaise.removeAttribute("disabled");
    btnRaiseConfirm.removeAttribute("disabled");
    // ----------------------- Socket calls for Game Logic ----------------------- //
    this.socket.emit("checkWinner", { room: this.room }, (gameDetails) => {
      if (gameDetails.winnerIndex === -1 && gameDetails.losers.length > 0) {
        this.socket.emit("updateLosers", { room: this.room }, () => {
          this.socket.emit("nextRound", { room: this.room }, () => {
            this.payAnte();
          });
        });
      } else if (
        gameDetails.winnerIndex !== -1 &&
        gameDetails.losers.length > 0
      ) {
        this.socket.emit(
          "winnerFound",
          {
            room: this.room,
            winner: gameDetails.winnerIndex,
          },
          () => {
            this.startGame();
          }
        );
      } else {
        this.socket.emit("nextRound", { room: this.room }, () => {
          this.payAnte();
        });
      }
    });
  }

  onCall() {
    //decrease call value from user balance and add to pot
    // ----------------------- Socket calls for Game Logic ----------------------- //
    this.socket.emit("onCall", { room: this.room }, () => {
      callAudio.play();
      this.updateCurrentUser();
    });
  }

  onRaise(callValue) {
    //show/hide raise options
    if (document.getElementById("sliderRaise").style.display === "none") {
      inputRaise.show();
      sliderRaise.show();
      btnRaiseConfirm.show();
      document.getElementById("inputRaise").value = callValue + 1;
    } else {
      inputRaise.hide();
      sliderRaise.hide();
      btnRaiseConfirm.hide();
    }
  }

  onRaiseConfirm() {
    // hide raise options
    inputRaise.hide();
    sliderRaise.hide();
    btnRaiseConfirm.hide();

    raiseAudio.play();

    //get bet value and subtract from users balance
    let bet = sliderRaise.value();
    //add bet to pot and update call value to match
    // ----------------------- Socket calls for Game Logic ----------------------- //
    this.socket.emit("onRaiseConfirm", { room: this.room, bet: bet }, () => {
      this.updateCurrentUser();
    });
  }

  onFold() {
    //fold current users card and go to next user
    // ----------------------- Socket calls for Game Logic ----------------------- //
    this.socket.emit("onFold", { room: this.room }, () => {
      cardFlipAudio.play();
      this.updateCurrentUser();
    });
  }

  payAnte() {
    // ----------------------- Socket calls for Game Logic ----------------------- //
    this.socket.emit("payAnte", { room: this.room });
  }

  addUser(user) {
    //add user
    if (this.users.length < 6) {
      this.users.push(user);
    }
  }

  removeUser(username) {
    const index = this.users.findIndex((user) => user.graphicname === username);
    if (index > -1) {
      this.users[index].graphic.remove();
      this.users.splice(index, 1);
    }
  }

  isLoser() {
    return this.losers.includes(this.userQueue[this.currentUser]);
  }
}
