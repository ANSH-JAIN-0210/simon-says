import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const colors = ['red', 'blue', 'green', 'yellow'];
const sounds = {
  red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
};

function App() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [status, setStatus] = useState('Press Start to Play');
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('highScore')) || 0);

  const flashButton = (color) => {
    const button = document.getElementById(color);
    if (button) {
      button.classList.add('active');
      sounds[color].play();
      setTimeout(() => button.classList.remove('active'), 400);
    }
  };

  const playSequence = useCallback((seq) => {
    setStatus(`Level ${level}`);
    seq.forEach((color, index) => {
      setTimeout(() => flashButton(color), 800 * index);
    });
  }, [level]);

  const generateNextColor = () => colors[Math.floor(Math.random() * colors.length)];

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
      setStatus('❌ Wrong! Press Start to Play Again.');

      // Update high score if the current level is greater
      if (level > highScore) {
        setHighScore(level);
        localStorage.setItem('highScore', level.toString());
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
    setStatus('Game Starting...');
  };

  const handleClick = (color) => {
    if (!gameStarted) return;
    setUserSequence((prev) => [...prev, color]);
    flashButton(color);
  };

  return (
    <div className="container">
      <h1 className="title">Simon Says</h1>
      <h2 className="status">{status}</h2>
      <h3 className="high-score">🏆 High Score: {highScore}</h3>
      <div className="buttons">
        {colors.map((color) => (
          <div
            key={color}
            id={color}
            className={`button ${color}`}
            onClick={() => handleClick(color)}
          ></div>
        ))}
      </div>
      <button className="start-btn" onClick={startGame}>{gameStarted ? 'Restart' : 'Start'}</button>
    </div>
  );
}

export default App;