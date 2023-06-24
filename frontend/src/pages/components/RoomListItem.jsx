import "./RoomListItem.css";
import { useEffect } from "react";
import { socket } from "../../connections.js";
import { useNavigate } from "react-router-dom";

const RoomListItem = ({ roomsItem, user, room, setRoom }) => {
  const navigate = useNavigate();
  const isWaiting = roomsItem.status === "Waiting";

  useEffect(() => {
    // Player already exists
    socket.on("playerExists", () => {
      alert("You are already in this room");
    });
    // Player not the owner
    socket.on("notOwner", () => {
      alert("You are not the owner of this room");
    });
    return () => {
      socket.off("playerExists");
      socket.off("notOwner");
    };
  }, []);

  const joinRoom = () => {
    //prevent conflicts from input field
    if (room !== roomsItem.name) {
      room = roomsItem.name;
    }
    if (user.name !== "" && room !== "") {
      socket.emit("joinRoom", { username: user.name, room }, () =>
        navigate(`/rooms/${room}/${user.name}`, { replace: true })
      );
    }
  };

  const deleteRoom = () => {
    //prevent conflicts from input field
    if (room !== roomsItem.name) {
      room = roomsItem.name;
    }
    if (user.name !== "" && room !== "") {
      socket.emit("deleteRoom", {
        username: user.name,
        room,
      });
    }
  };

  return (
    <>
      {isWaiting ? (
        <div className="room-list-item-container">
          <div className="room-list-name">
            {roomsItem.name}
            <button
              className="btn-room btn-simple"
              onClick={() => {
                setRoom(roomsItem.name);
                joinRoom();
              }}
            >
              Join
            </button>
            {user.name === roomsItem.owner ? (
              <button
                className="btn-room btn-simple"
                onClick={() => {
                  setRoom(roomsItem.name);
                  deleteRoom();
                }}
              >
                Delete
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className="room-list-owner">{roomsItem.owner}</div>
          <div className="room-list-players">{roomsItem.total_player}/6</div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default RoomListItem;
