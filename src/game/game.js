import React, { useState, useEffect } from 'react';
import './gameStyles.css';

const alphabet = ['A', 'B', 'C', 'D', 'E'];

const generateTile = () => {
  const size = Math.floor(Math.random() * 50 + 20);
  const color =  `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const letter = alphabet[Math.floor(Math.random() * 5)];
  return { size, color, letter };
};

const Game = () => {
    const [tiles, setTiles] = useState([]);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [numTilesAtBottom, setNumTilesAtBottom] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (!isPaused) {
          const newTile = generateTile();
          setTiles((prevTiles) => [...prevTiles, newTile]);
        }
      }, 250);
      return () => clearInterval(interval);
    }, [isPaused]);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (!isPaused) {
          const letter = event.key.toUpperCase();
          const tilesToRemove = tiles.filter(
            (tile) => tile.letter === letter && tile.top < window.innerHeight - 100
          );
  
          if (tilesToRemove.length > 0) {
            setTiles((prevTiles) =>
              prevTiles.filter((tile) => !tilesToRemove.includes(tile))
            );
            setScore((prevScore) => prevScore + tilesToRemove.length);
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPaused, tiles]);
  
    useEffect(() => {
      const numTiles = tiles.filter((tile) => tile.top >= window.innerHeight - 100).length;
      setNumTilesAtBottom(numTiles);
    }, [tiles]);
  
    useEffect(() => {
      if (numTilesAtBottom >= 20) {
        setGameOver(true);
        setIsPaused(true);
      }
    }, [numTilesAtBottom]);
  
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        setIsPaused((prevIsPaused) => !prevIsPaused);
      }
    };
  
    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleRestart = () => {
        setTiles([]);
        setScore(0);
        setIsPaused(false);
        setGameOver(false);
        setNumTilesAtBottom(0);
      };
      
  
    if (gameOver) {
        return (
          <div className='gameOverContainerStyle'>
            <div className='gameOverMessageStyle'>You missed 20 tiles, game over</div>S
            <button className='restartButtonStyle' onClick={handleRestart}>Restart</button>
          </div>
        );
      }
  
    return (
      <div className="rootElementStyle">
        {tiles.map((tile, index) => {
          const top = tile.top ?? -tile.size;
          const left = tile.left ?? Math.random() * (window.innerWidth - tile.size);
          if (top + tile.size >= window.innerHeight - 100) {
            tile.top = window.innerHeight - tile.size;
            tile.left = left;
          } else {
            tile.top = top + 5;
            tile.left = left;
          }
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: `${tile.top}px`,
                left: `${tile.left}px`,
                width: `${tile.size}px`,
                height: `${tile.size}px`,
                backgroundColor: tile.color,
              }}
            >
              <div className="tileLetterStyle">{tile.letter}</div>
            </div>
          );
        })}
        <div className="bottomDividerLineStyle" />
        <div className="scoreStyle ">Score: {score}</div>
      </div>
    );
  };
  
export default Game;
