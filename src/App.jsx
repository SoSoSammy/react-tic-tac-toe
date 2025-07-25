import { useState } from 'react';

function Square({ value, winnerClass, onSquareClick }) {
  return (
    <button className={"square" + winnerClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [squareWinnerClasses, setSquareWinnerClasses] = useState(Array(9).fill(''));
  
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
        // Highlight the squares the caused the win
        squareWinnerClasses[a] = ' winner-square';
        squareWinnerClasses[b] = ' winner-square';
        squareWinnerClasses[c] = ' winner-square';
        return squares[a];
      }
    }

    return null;
  }

  function resetSquareWinnerClasses() {
    for (let i = 0; i < squareWinnerClasses.length; i++) {
      squareWinnerClasses[i] = '';
    }
  }

  function allSquaresFilledIn() {
    for (let i = 0; i < squares.length; i++) {
      // If there is a square not filled in yet
      if (squares[i] == null) {
        return false;
      }
    }
    return true;
  }
  
  const winner = calculateWinner(squares);
  const gameEnded = allSquaresFilledIn();

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (gameEnded) {
    status = 'There was a draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    resetSquareWinnerClasses();
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
            // calculate the number of the cell (from 0 to 9)
            const cellNumber = rowIndex * cols.length + colIndex;
            return (
            <Square key={`cell-${rowIndex}-${colIndex}`}  value={squares[cellNumber]} winnerClass={squareWinnerClasses[cellNumber]} onSquareClick={() => handleClick(cellNumber)} />
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
  const [historyIsDescending, setHistoryIsDescending] = useState(false);
  
  function handlePlay(nextSquares) {
    // Use currentMove + 1 since the end of .slice is not included
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortMoves() {
    setHistoryIsDescending(!historyIsDescending);
  }


  const historyToRender = historyIsDescending ? history.toReversed() : history;

  // squares is the current element in the iteration, move is the index of that element
  const moves = historyToRender.map((squares, move) => {
    // find the original move index in unsorted history and use it for rendering and functionality
    const originalMoveNumber = history.findIndex(s => s === squares);
    let description;
    if (originalMoveNumber === currentMove) {
      description = 'You are at move #' + originalMoveNumber;
    }
    else if (originalMoveNumber > 0) {
      description = 'Go to move #' + originalMoveNumber;
    } else {
      description = 'Go to game start';
    }

    if (originalMoveNumber === currentMove) {
      return (
        <li key={originalMoveNumber}>
          {description}
        </li>
      );
    } else {
        return (
          <li key={originalMoveNumber}>
            <button onClick={() => jumpTo(originalMoveNumber)}>{description}</button>
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
        <input id="sort-moves" type="checkbox" onClick={sortMoves} />
        <ol>{moves}</ol>
      </div>
    </div>
  );
}