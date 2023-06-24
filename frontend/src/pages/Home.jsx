import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header.jsx";
import RoomList from "./components/RoomList.jsx";
import Welcome from "./components/Welcome";
import Rules from "./components/Rules";
function Home({ room, setRoom }) {
  // Authentication State
  const { isAuthenticated } = useAuth0();
  return (
    <>
      <Header />
      {isAuthenticated ? (
        <RoomList room={room} setRoom={setRoom} />
      ) : (
        <Welcome />
      )}
      <Rules />
    </>
  );
}

export default Home;
