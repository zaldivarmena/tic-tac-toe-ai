import React, { useState, useEffect } from 'react';
import styles from './TicTacToeStyles';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('multiplayer');
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });
  const [gameStatus, setGameStatus] = useState('Next player: X');
  const [winningLine, setWinningLine] = useState([]);

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  const calculateWinner = (squares) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    
    if (squares.every(square => square !== null)) {
      return { winner: 'tie', line: [] };
    }
    
    return null;
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('Next player: X');
    setWinningLine([]);
  };

  const resetGame = () => {
    resetBoard();
    setScores({ X: 0, O: 0, ties: 0 });
  };

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return; // Simplified game end check
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    const result = calculateWinner(newBoard);
    
    if (result) {
      handleGameEnd(result);
    } else {
      setIsXNext(!isXNext);
      setGameStatus(`Next player: ${isXNext ? 'O' : 'X'}`); // Fixed player toggle
    }

    // Trigger computer move if in computer mode and it's O's turn
    if (gameMode === 'computer' && isXNext) {
      setTimeout(computerMove, 500);
    }
  };

  const handleGameEnd = (result) => {
    if (result.winner === 'tie') {
      setGameStatus("It's a tie!");
      setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
    } else {
      setGameStatus(`Player ${result.winner} wins!`);
      setScores(prev => ({ 
        ...prev, 
        [result.winner]: prev[result.winner] + 1 
      }));
      setWinningLine(result.line);
    }
  };

  const computerMove = () => {
    const currentResult = calculateWinner(board);
    if (currentResult || board.every(square => square !== null)) return;
    
    const newBoard = [...board];
    let moveIndex = -1;
    
    // Find winning move for O
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const countO = [a, b, c].filter(idx => newBoard[idx] === 'O').length;
      const countEmpty = [a, b, c].filter(idx => newBoard[idx] === null).length;
      if (countO === 2 && countEmpty === 1) {
        moveIndex = [a, b, c].find(idx => newBoard[idx] === null);
        break;
      }
    }
    
    // Block X's winning move
    if (moveIndex === -1) {
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        const countX = [a, b, c].filter(idx => newBoard[idx] === 'X').length;
        const countEmpty = [a, b, c].filter(idx => newBoard[idx] === null).length;
        if (countX === 2 && countEmpty === 1) {
          moveIndex = [a, b, c].find(idx => newBoard[idx] === null);
          break;
        }
      }
    }
    
    // Take center or random available square
    if (moveIndex === -1) {
      moveIndex = newBoard[4] === null ? 4 : 
        newBoard.reduce((acc, square, idx) => 
          square === null ? [...acc, idx] : acc, []
        )[Math.floor(Math.random() * newBoard.filter(s => s === null).length)];
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

  // Removed useEffect as computer move is now triggered from handleClick

  const renderSquare = (index) => {
    const isHighlighted = winningLine.includes(index);
    const squareStyle = {
      ...styles.square,
      ...(isHighlighted ? styles.highlighted : {}),
      color: board[index] === 'X' ? '#4269f5' : (board[index] === 'O' ? '#f44336' : 'black')
    };

    return (
      <button 
        style={squareStyle}
        onClick={() => handleClick(index)}
        disabled={!!board[index] || !!calculateWinner(board)} // Disable when square is filled or game is over
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Tic Tac Toe</h1>
      
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
      
      <div style={styles.status}>
        {gameStatus}
      </div>
      
      <div style={styles.board}>
        {Array(9).fill(null).map((_, i) => (
          <div key={i}>{renderSquare(i)}</div> // Added key prop for list items
        ))}
      </div>
      
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