import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  
  
  function handleClick(i) {
    // Make sure not overwriting any existing values, or play if the game is won
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares); // Tell Game to update
  }
  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Create board programmatically
  // 3 rows, 3 columns
  const rows = [0, 1, 2];
  const cols = [0, 1, 2];

  return (
    <>
      <div className="status">{status}</div>
      {
        rows.map((rowIndex) => (
        <div key={`row-${rowIndex}`} className="board-row">
          {cols.map((colIndex) => {
            // calculate the number of the cell
            const cellNumber = rowIndex * cols.length + colIndex;
            return (
            <Square key={`cell-${rowIndex}-${colIndex}`}  value={squares[cellNumber]} onSquareClick={() => handleClick(cellNumber)} />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  // single array with array of 9 nulls, that's what the brackets are
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); 
  const xIsNext = currentMove % 2 === 0; // If current move is even, then X is next
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares) {
    // Use currentMove + 1 since the end of .slice is not included
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // squares is the current element in the iteration, move is the index of that element
  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = 'You are at move #' + move;
    }
    else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    if (move === currentMove) {
      return (
        <li key={move}>
          {description}
        </li>
      );
    } else {
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
          );
    }
  
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <label htmlFor="sort-moves">Sort Moves in Descending Order</label>
        <input id="sort-moves" type="checkbox" />
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const possibleWinningCases = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Go through all possible cases and check that the same player has all the spaces
  for (let i = 0; i < possibleWinningCases.length; i++) {
    const [a, b, c] = possibleWinningCases[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}