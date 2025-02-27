// TicTacToe.js
import React, { useState, useEffect } from 'react';
import styles from './TicTacToeStyles';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('multiplayer'); // 'multiplayer' or 'computer'
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });
  const [gameStatus, setGameStatus] = useState('Next player: X');
  const [winningLine, setWinningLine] = useState([]);

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  // Calculate winner
  const calculateWinner = (squares) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    
    // Check for tie
    if (squares.every(square => square !== null)) {
      return { winner: 'tie', line: [] };
    }
    
    return null;
  };

  // Reset board
  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('Next player: X');
    setWinningLine([]);
  };

  // Reset game including scores
  const resetGame = () => {
    resetBoard();
    setScores({ X: 0, O: 0, ties: 0 });
  };

  // Handle clicks on squares
  const handleClick = (index) => {
    // Don't allow clicking on filled squares or after game ends
    if (board[index] || winningLine.length > 0) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const result = calculateWinner(newBoard);
    if (result) {
      handleGameEnd(result);
    } else {
      setIsXNext(!isXNext);
      setGameStatus(`Next player: ${!isXNext ? 'X' : 'O'}`);
    }
  };

  // Handle game end
  const handleGameEnd = (result) => {
    if (result.winner === 'tie') {
      setGameStatus('Game ended in a tie!');
      setScores({ ...scores, ties: scores.ties + 1 });
    } else {
      setGameStatus(`Player ${result.winner} wins!`);
      setScores({ 
        ...scores, 
        [result.winner]: scores[result.winner] + 1 
      });
      setWinningLine(result.line);
    }
  };

  // Computer move
  const computerMove = () => {
    if (winningLine.length > 0 || board.every(square => square !== null)) return;
    
    const newBoard = [...board];
    let moveIndex = -1;
    
    // Try to find winning move
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (newBoard[a] === 'O' && newBoard[b] === 'O' && newBoard[c] === null) {
        moveIndex = c;
        break;
      }
      if (newBoard[a] === 'O' && newBoard[c] === 'O' && newBoard[b] === null) {
        moveIndex = b;
        break;
      }
      if (newBoard[b] === 'O' && newBoard[c] === 'O' && newBoard[a] === null) {
        moveIndex = a;
        break;
      }
    }
    
    // Try to block player
    if (moveIndex === -1) {
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (newBoard[a] === 'X' && newBoard[b] === 'X' && newBoard[c] === null) {
          moveIndex = c;
          break;
        }
        if (newBoard[a] === 'X' && newBoard[c] === 'X' && newBoard[b] === null) {
          moveIndex = b;
          break;
        }
        if (newBoard[b] === 'X' && newBoard[c] === 'X' && newBoard[a] === null) {
          moveIndex = a;
          break;
        }
      }
    }
    
    // Take center if available
    if (moveIndex === -1 && newBoard[4] === null) {
      moveIndex = 4;
    }
    
    // Take any available square
    if (moveIndex === -1) {
      const availableSquares = newBoard
        .map((square, idx) => square === null ? idx : null)
        .filter(idx => idx !== null);
      
      if (availableSquares.length > 0) {
        moveIndex = availableSquares[Math.floor(Math.random() * availableSquares.length)];
      }
    }
    
    if (moveIndex !== -1) {
      newBoard[moveIndex] = 'O';
      setBoard(newBoard);
      
      const result = calculateWinner(newBoard);
      if (result) {
        handleGameEnd(result);
      } else {
        setIsXNext(true);
        setGameStatus('Next player: X');
      }
    }
  };

  // Computer's turn effect
  useEffect(() => {
    if (gameMode === 'computer' && !isXNext && winningLine.length === 0) {
      const timer = setTimeout(() => {
        computerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, board]);

  // Render a square
  const renderSquare = (index) => {
    const isHighlighted = winningLine.includes(index);
    const squareStyle = {
      ...styles.square,
      ...(isHighlighted ? styles.highlighted : {}),
      color: board[index] === 'X' ? '#4269f5' : (board[index] === 'O' ? '#f44336' : 'black')
    };

    return (
      <button 
        key={index}
        style={squareStyle}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Tic Tac Toe</h1>
      
      {/* Game mode selector */}
      <div style={styles.controls}>
        <button 
          style={{
            ...styles.button, 
            ...(gameMode === 'multiplayer' ? styles.modeSelectorActive : styles.modeSelectorInactive)
          }}
          onClick={() => {
            setGameMode('multiplayer');
            resetBoard();
          }}
        >
          Multiplayer
        </button>
        <button 
          style={{
            ...styles.button, 
            ...(gameMode === 'computer' ? styles.modeSelectorActive : styles.modeSelectorInactive)
          }}
          onClick={() => {
            setGameMode('computer');
            resetBoard();
          }}
        >
          vs Computer
        </button>
      </div>
      
      {/* Status */}
      <div style={styles.status}>
        {gameStatus}
      </div>
      
      {/* Board */}
      <div style={styles.board}>
        {Array(9).fill(null).map((_, i) => renderSquare(i))}
      </div>
      
      {/* Controls */}
      <div style={styles.controls}>
        <button 
          style={{...styles.button, ...styles.primaryButton}}
          onClick={resetBoard}
        >
          New Game
        </button>
        <button 
          style={{...styles.button, ...styles.secondaryButton}}
          onClick={resetGame}
        >
          Reset All
        </button>
      </div>
      
      {/* Scoreboard */}
      <div style={styles.scoreSection}>
        <h2 style={styles.scoreTitle}>Score</h2>
        <div style={styles.scoreBoard}>
          <div style={styles.scoreItem}>
            <span style={{...styles.playerX, fontWeight: 'bold'}}>X</span>
            <p style={styles.scoreValue}>{scores.X}</p>
          </div>
          <div style={styles.scoreItem}>
            <span style={{fontWeight: 'bold'}}>Ties</span>
            <p style={styles.scoreValue}>{scores.ties}</p>
          </div>
          <div style={styles.scoreItem}>
            <span style={{...styles.playerO, fontWeight: 'bold'}}>O</span>
            <p style={styles.scoreValue}>{scores.O}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;