import "./RoomList.css";
import { useEffect, useState } from "react";
import { socket } from "../../connections.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import RoomListItem from "./RoomListItem";

function RoomList({ room, setRoom }) {
  // Authentication State
  const { user } = useAuth0();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const createRoom = () => {
    if (user.name !== "" && room !== "") {
      socket.emit(
        "createRoom",
        {
          username: user.name,
          room,
        },
        () => navigate(`/rooms/${room}/${user.name}`, { replace: true })
      );
    }
  };

  const joinRoom = () => {
    if (user.name !== "" && room !== "") {
      socket.emit("joinRoom", { username: user.name, room }, () =>
        navigate(`/rooms/${room}/${user.name}`, { replace: true })
      );
    }
  };

  useEffect(() => {
    // Room Information Update from server
    socket.on("allRooms", ({ rooms }) => {
      setRooms(rooms);
    });
    socket.emit("authenticated");
    // Room already exists
    socket.on("roomExists", () => {
      alert("Room with this name already exists! Try another name");
    });
    // Room doesn't exist
    socket.on("roomDoesNotExist", () => {
      alert("Room doesn't exist! Create a room first");
    });
    // Player already exists
    socket.on("playerExists", () => {
      alert("You are already in this room");
    });
    // Player not the owner
    socket.on("notOwner", () => {
      alert("You are not the owner of this room");
    });
    return () => {
      socket.off("allRooms");
      socket.off("roomExists");
      socket.off("roomDoesNotExist");
      socket.off("playerExists");
      socket.off("notOwner");
    };
  }, []);

  return (
    <>
      <div className="room-list-container">
        <div className="room-list-create">
          <input
            placeholder="Room Name"
            className="room-list-input"
            required
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button className="btn-room-list btn-simple" onClick={createRoom}>
            Create Room
          </button>
          <button className="btn-room-list btn-simple" onClick={joinRoom}>
            Join Room
          </button>
        </div>
        <div className="room-list">
          {rooms.map((roomsItem) => (
            <RoomListItem
              key={roomsItem.name}
              roomsItem={roomsItem}
              user={user}
              room={room}
              setRoom={setRoom}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default RoomList;
