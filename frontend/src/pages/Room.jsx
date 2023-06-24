import "./Room.css";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { peer, socket } from "../connections.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sketch from "../game/sketch.js";
import { useAuth0 } from "@auth0/auth0-react";
import Notification from "./components/Notification";

function Room({ room }) {
  // Authentication State
  const { user } = useAuth0();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const leaveRoom = () => {
    if (user.name !== "" && room !== "") {
      socket.emit("leaveRoom", { username: user.name, room });
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    socket.on("notification", (notification) => {
      setNotifications([notification, ...notifications]);
    });

    return () => {
      socket.off("notification");
      socket.off("roomPlayers");
      socket.off("userConnected");
      socket.off("userDisconnected");
      socket.off("gameStart");
      socket.off("payAnte");
      socket.off("getCurrentUser");
      socket.off("payoutUser");
      socket.off("nextRound");
      socket.off("updateCurrentUser");
      socket.off("onCall");
      socket.off("onRaiseConfirm");
      socket.off("endRound");
      socket.off("onFold");
      socket.off("getRoom");
      socket.off("checkWinner");
      socket.off("winnerFound");
      socket.off("updateCard");
      socket.off("updateLosers");
      socket.off("scanCards");
      peer.off("open");
    };
  }, []);

  return (
    <>
      {user != null && room != "" ? (
        <>
          <div className="room-container">
            <div>
              <div className="room-header-container">
                <div>
                  <div className="room-title">Room: {room}</div>
                  <div className="room-title">Username: {user.name}</div>
                </div>
                <button onClick={leaveRoom} className="btn-leave-room">
                  Leave Room
                </button>
              </div>
              <div className="notification-list">
                {notifications.map((notification) => (
                  <Notification notification={notification} />
                ))}
              </div>
            </div>
            <div id="game-canvas">
              <ReactP5Wrapper
                sketch={sketch}
                username={user.name}
                roomId={room}
              />
            </div>
          </div>
        </>
      ) : (
        navigate("/", { replace: true })
      )}
    </>
  );
}

export default Room;
