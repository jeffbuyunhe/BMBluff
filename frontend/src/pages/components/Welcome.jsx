import "./Welcome.css";
import { ParallaxBanner } from "react-scroll-parallax";
import { useAuth0 } from "@auth0/auth0-react";
import banner from "../../assets/poker-background.jpg"; //https://www.pexels.com/photo/cards-casino-chance-chip-269630/
const Welcome = () => {
  // Authentication State
  const { loginWithRedirect } = useAuth0();
  return (
    <>
      <ParallaxBanner
        layers={[
          { image: banner, speed: -20 },
          {
            speed: -10,
            children: (
              <div className="home-banner-text-container">
                <h1 className="home-banner-text">
                  Welcome to Blind Man's Bluff!
                </h1>
                <button
                  className="btn-sign-in"
                  onClick={() => loginWithRedirect()}
                >
                  Sign In / Sign Up
                </button>
              </div>
            ),
          },
        ]}
        className="home-banner"
      />
    </>
  );
};

export default Welcome;
