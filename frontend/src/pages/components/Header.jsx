import "./Header.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { SUIT_ICONS } from "../../game/constants";
const Header = () => {
  const { isAuthenticated, logout, user } = useAuth0();
  const [suit, setSuit] = useState(
    SUIT_ICONS[Object.keys(SUIT_ICONS)[Math.floor(Math.random() * 4)]]
  );

  return (
    <div className="header-container">
      <p className="header-logo">BMBluff {suit}</p>
      {isAuthenticated ? (
        <>
          <p className="header-username">Welcome, {user.name}</p>
          <button className="btn-sign-out" onClick={logout}>
            Sign out
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
