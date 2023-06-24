import "./Rules.css";
const Rules = () => {
  return (
    <div className="rules-container">
      <h1 className="rules-title">Rules</h1>
      <div className="rules-grid-container rules-container">
        <div className="rules-container">
          <h2 className="rules-subtitle">Show Your Card</h2>
          <div className="rules-image" id="card-image"></div>
          <p className="rules-paragraph">
            Once the round begins, hold the card up to your camera, and wait for
            the game to confirm your card.
          </p>
        </div>
        <div className="rules-container">
          <h2 className="rules-subtitle">Place Your Bets</h2>
          <div className="rules-image" id="bet-image"></div>
          <p className="rules-paragraph">
            The ante is deducted and added to the pot. Betting goes clockwise,
            each player can call, raise, or fold.
          </p>
        </div>
        <div className="rules-container">
          <h2 className="rules-subtitle">Pay the Winner</h2>
          <div className="rules-image" id="winner-image"></div>
          <p className="rules-paragraph">
            Everyone's cards are revealed. Pot is split to highest value cards,
            aces are high. The rounds repeat until all but one user goes
            bankrupt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rules;
