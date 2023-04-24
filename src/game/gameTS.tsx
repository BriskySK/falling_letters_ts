import React, { useState, useEffect } from 'react';
import './gameStyles.css';

interface Tile {
  size: number;
  color: string;
  letter: string;
  top?: number;
  left?: number;
}

const alphabet: string[] = ['A', 'B', 'C', 'D', 'E'];

const generateTile = (): Tile => {
  const size: number = Math.floor(Math.random() * 50 + 20);
  const color: string = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const letter: string = alphabet[Math.floor(Math.random() * 5)];
  return { size, color, letter };
};

const GameTS= () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [numTilesAtBottom, setNumTilesAtBottom] = useState<number>(0);

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPaused) {
        const letter: string = event.key.toUpperCase();
        const tilesToRemove: Tile[] = tiles.filter(
          (tile) => tile.letter === letter && tile.top! < window.innerHeight - 100
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
    const numTiles: number = tiles.filter((tile) => tile.top! >= window.innerHeight - 100).length;
    setNumTilesAtBottom(numTiles);
  }, [tiles]);

  useEffect(() => {
    if (numTilesAtBottom >= 20) {
      setGameOver(true);
      setIsPaused(true);
    }
  }, [numTilesAtBottom]);

  const handleKeyDown = (event: KeyboardEvent) => {
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
        <div className='gameOverMessageStyle'>You missed 20 tiles, game over</div>
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


export default GameTS;
