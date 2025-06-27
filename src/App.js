import React, { useState, useEffect, useCallback } from "react";

const colors = ["red", "blue", "green", "yellow"];
const sounds = {
  red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
};

function App() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [status, setStatus] = useState("Press Start to Play");
  const [highScore, setHighScore] = useState(0);
  const [activeButton, setActiveButton] = useState(null);

  const flashButton = (color) => {
    setActiveButton(color);
    sounds[color].play().catch(() => {}); // Handle audio errors gracefully
    setTimeout(() => setActiveButton(null), 400);
  };

  const playSequence = useCallback(
    (seq) => {
      setStatus(`Level ${level}`);
      seq.forEach((color, index) => {
        setTimeout(() => flashButton(color), 800 * index);
      });
    },
    [level]
  );

  const generateNextColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    setLevel(newLevel);
    const newSequence = [...sequence, generateNextColor()];
    setSequence(newSequence);
    setUserSequence([]);
    setTimeout(() => playSequence(newSequence), 600);
  }, [level, sequence, playSequence]);

  const checkSequence = useCallback(() => {
    const currentIndex = userSequence.length - 1;

    if (userSequence[currentIndex] !== sequence[currentIndex]) {
      setStatus("❌ Wrong! Press Start to Play Again.");

      if (level > highScore) {
        setHighScore(level);
      }

      setGameStarted(false);
      return;
    }

    if (userSequence.length === sequence.length) {
      setTimeout(() => nextLevel(), 1000);
    }
  }, [userSequence, sequence, level, highScore, nextLevel]);

  useEffect(() => {
    if (gameStarted && level === 0) nextLevel();
  }, [gameStarted, level, nextLevel]);

  useEffect(() => {
    if (userSequence.length) checkSequence();
  }, [userSequence, checkSequence]);

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setLevel(0);
    setGameStarted(true);
    setStatus("Game Starting...");
  };

  const handleClick = (color) => {
    if (!gameStarted) return;
    setUserSequence((prev) => [...prev, color]);
    flashButton(color);
  };

  const buttonStyle = {
    width: "100%",
    aspectRatio: "1",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
    transform: activeButton ? "scale(1.1)" : "scale(1)",
    boxShadow: activeButton ? "0 0 20px rgba(255, 255, 255, 0.8)" : "none",
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #1e1e2f;
          color: #f5f5f5;
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .container {
          text-align: center;
          background-color: #2a2a3d;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 500px;
        }

        .title {
          font-size: clamp(2rem, 5vw, 2.5rem);
          margin-bottom: 0.5rem;
          animation: fadeInDown 1s ease;
        }

        .status, .high-score {
          margin: 0.5rem 0;
          font-size: clamp(1rem, 3vw, 1.2rem);
        }

        .status {
          color: #6b7af5;
          font-weight: 500;
        }

        .high-score {
          color: #ffd700;
        }

        .buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(0.75rem, 3vw, 1.5rem);
          margin: 2rem auto;
          max-width: 300px;
          width: 100%;
        }

        .button {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .button:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }

        .button:active {
          transform: scale(0.98);
        }

        .button.active {
          transform: scale(1.1) !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }

        .red { background-color: #ff4d4d; }
        .blue { background-color: #4d79ff; }
        .green { background-color: #4dff88; }
        .yellow { background-color: #ffeb4d; }

        .start-btn {
          background-color: #4d79ff;
          color: white;
          border: none;
          padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1.2rem, 4vw, 1.5rem);
          border-radius: 10px;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .start-btn:hover {
          background-color: #3a5dcc;
          transform: scale(1.05);
        }

        .start-btn:active {
          transform: scale(0.95);
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Small screens */
        @media (max-width: 480px) {
          .container {
            padding: 1.5rem;
            margin: 0.5rem;
          }

          .buttons {
            max-width: 250px;
            gap: 0.75rem;
          }

          .title {
            margin-bottom: 1rem;
          }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .container {
            padding: 1rem;
          }

          .buttons {
            max-width: 220px;
            gap: 0.5rem;
          }
        }

        /* Large screens */
        @media (min-width: 768px) {
          .container {
            padding: 2.5rem;
          }

          .buttons {
            max-width: 350px;
            gap: 2rem;
          }
        }

        /* Extra large screens */
        @media (min-width: 1024px) {
          .container {
            padding: 3rem;
          }

          .buttons {
            max-width: 400px;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="title">Simon Says</h1>
        <h2 className="status">{status}</h2>
        <h3 className="high-score">🏆 High Score: {highScore}</h3>

        <div className="buttons">
          {colors.map((color) => (
            <div
              key={color}
              className={`button ${color} ${
                activeButton === color ? "active" : ""
              }`}
              onClick={() => handleClick(color)}
            />
          ))}
        </div>

        <button className="start-btn" onClick={startGame}>
          {gameStarted ? "Restart" : "Start"}
        </button>
      </div>
    </>
  );
}

export default App;
