'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;
const MINE_COUNT = 15;

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [flags, setFlags] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameWon, setGameWon] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Initialize board
  const createBoard = useCallback(() => {
    const newBoard: Cell[][] = Array(BOARD_HEIGHT).fill(null).map(() =>
      Array(BOARD_WIDTH).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const x = Math.floor(Math.random() * BOARD_WIDTH);
      const y = Math.floor(Math.random() * BOARD_HEIGHT);
      if (!newBoard[y][x].isMine) {
        newBoard[y][x].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (newBoard[y][x].isMine) continue;
        let count = 0;
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
          for (let xOffset = -1; xOffset <= 1; xOffset++) {
            const newY = y + yOffset;
            const newX = x + xOffset;
            if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH && newBoard[newY][newX].isMine) {
              count++;
            }
          }
        }
        newBoard[y][x].adjacentMines = count;
      }
    }
    setBoard(newBoard);
    setFlags(0);
    setTimer(0);
    setGameOver(false);
    setGameWon(false);
    setIsTimerRunning(false);
  }, []);

  useEffect(() => {
    createBoard();
  }, [createBoard]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !gameOver) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameOver]);

  const handleCellClick = (y: number, x: number) => {
    if (gameOver || board[y][x].isRevealed || board[y][x].isFlagged) return;

    if (!isTimerRunning) setIsTimerRunning(true);

    const newBoard = [...board.map(row => [...row])];
    const cell = { ...newBoard[y][x] }; // Copy cell
    newBoard[y][x] = cell;
    
    cell.isRevealed = true;

    if (cell.isMine) {
      setGameOver(true);
      setIsTimerRunning(false);
      // Reveal all mines
      newBoard.forEach((row, rI) => row.forEach((c, cI) => {
        if (c.isMine) {
            newBoard[rI][cI] = { ...c, isRevealed: true };
        }
      }));
      setBoard(newBoard);
      setTimeout(() => alert('ゲームオーバー！'), 100);
      return;
    }

    if (cell.adjacentMines === 0) {
      revealNeighbors(y, x, newBoard);
    }

    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const revealNeighbors = (y: number, x: number, currentBoard: Cell[][]) => {
     for (let yOffset = -1; yOffset <= 1; yOffset++) {
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
            if (yOffset === 0 && xOffset === 0) continue;
            const newY = y + yOffset;
            const newX = x + xOffset;

            if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
                const neighbor = currentBoard[newY][newX];
                if (!neighbor.isRevealed && !neighbor.isFlagged) {
                   // Mutating currentBoard (which is a copy) is fine here as long as we are careful
                   // Need to shallow copy the neighbor row if strictly immutable, but currentBoard is already a deep-ish copy from handleCellClick
                   // Actually handleCellClick only copied the top array and the clicked row?
                   // No, `[...board.map(row => [...row])]` is a deep copy of the 2D array structure (objects are still shared? No, objects are shared!).
                   // Wait, `row => [...row]` copies the rows. The cells inside are objects. They are SHARED if I don't copy them.
                   // My `createBoard` creates objects.
                   // `[...board.map(row => [...row])]` creates new row arrays, but the elements are references to the SAME cell objects.
                   // So modifying `neighbor.isRevealed` DOES modify the state directly if I am not careful.
                   // React strict mode might complain or it might work but is not pure.
                   // I should copy the cell before modifying.
                   
                   // To fix this properly:
                   const newNeighbor = { ...neighbor, isRevealed: true };
                   currentBoard[newY][newX] = newNeighbor;
                   
                   if (newNeighbor.adjacentMines === 0) {
                       revealNeighbors(newY, newX, currentBoard);
                   }
                }
            }
        }
    }
  };
  
  // Re-verify the deep copy logic.
  // Ideally, I should simple clone the whole state or use Immer, but here simple clone is okay.
  // If I do `const newBoard = board.map(row => row.map(cell => ({...cell})));` it is a true deep copy.
  // Then I can mutate `newBoard` freely.
  
  const safeHandleCellClick = (y: number, x: number) => {
    if (gameOver || board[y][x].isRevealed || board[y][x].isFlagged) return;
    if (!isTimerRunning) setIsTimerRunning(true);

    const newBoard = board.map(row => row.map(cell => ({...cell})));
    const cell = newBoard[y][x];
    
    cell.isRevealed = true;

    if (cell.isMine) {
      setGameOver(true);
      setIsTimerRunning(false);
      newBoard.forEach(row => row.forEach(c => {
        if (c.isMine) c.isRevealed = true;
      }));
      setBoard(newBoard);
      setTimeout(() => alert('ゲームオーバー！'), 100);
      return;
    }
    
    if (cell.adjacentMines === 0) {
        // Recursive reveal on the newBoard
        const recursiveReveal = (rY: number, rX: number) => {
            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                for (let xOffset = -1; xOffset <= 1; xOffset++) {
                    if (yOffset === 0 && xOffset === 0) continue;
                    const nY = rY + yOffset;
                    const nX = rX + xOffset;
                    if (nY >= 0 && nY < BOARD_HEIGHT && nX >= 0 && nX < BOARD_WIDTH) {
                        const neighbor = newBoard[nY][nX];
                        if (!neighbor.isRevealed && !neighbor.isFlagged) {
                            neighbor.isRevealed = true;
                            if (neighbor.adjacentMines === 0) {
                                recursiveReveal(nY, nX);
                            }
                        }
                    }
                }
            }
        };
        recursiveReveal(y, x);
    }
    
    setBoard(newBoard);
    checkWinCondition(newBoard);
  };


  const handleRightClick = (e: React.MouseEvent, y: number, x: number) => {
    e.preventDefault();
    if (gameOver || board[y][x].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({...cell})));
    const cell = newBoard[y][x];

    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlags(prev => prev - 1);
    } else {
      if (flags < MINE_COUNT) {
        cell.isFlagged = true;
        setFlags(prev => prev + 1);
      }
    }
    setBoard(newBoard);
  };

  const checkWinCondition = (currentBoard: Cell[][]) => {
    let revealedCount = 0;
    currentBoard.forEach(row => row.forEach(cell => {
      if (cell.isRevealed) revealedCount++;
    }));

    if (revealedCount === (BOARD_WIDTH * BOARD_HEIGHT) - MINE_COUNT) {
      setGameOver(true);
      setGameWon(true);
      setIsTimerRunning(false);
      
       const newBoard = currentBoard.map(row => row.map(cell => ({...cell})));
       newBoard.forEach(row => row.forEach(c => {
         if (c.isMine) c.isFlagged = true;
       }));
       setBoard(newBoard);

      setTimeout(() => alert('おめでとうございます！あなたの勝ちです！'), 100);
    }
  };
  
  const getNumberColor = (number: number) => {
        switch (number) {
            case 1: return '#0000ff';
            case 2: return '#008000';
            case 3: return '#ff0000';
            case 4: return '#000080';
            case 5: return '#800000';
            case 6: return '#008080';
            case 7: return '#000000';
            case 8: return '#808080';
            default: return '#000000';
        }
    };

  return (
    <>
      <header>
        <h1>マインスイーパー</h1>
      </header>

      <main className="container">
        <div className="game-info">
            <span id="flag-count">🚩 {MINE_COUNT - flags}</span>
            <button id="reset-button" onClick={createBoard}>リセット</button>
            <span id="timer">{timer}</span>
        </div>
        <div id="minesweeper-board" className="board" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 25px)` }}>
            {board.map((row, y) => row.map((cell, x) => (
                <div
                    key={`${y}-${x}`}
                    className={`cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isFlagged ? 'flagged' : ''} ${cell.isMine && cell.isRevealed ? 'mine' : ''}`}
                    style={{ color: cell.isRevealed && cell.adjacentMines > 0 ? getNumberColor(cell.adjacentMines) : undefined }}
                    onClick={() => safeHandleCellClick(y, x)}
                    onContextMenu={(e) => handleRightClick(e, y, x)}
                >
                    {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 ? cell.adjacentMines : ''}
                </div>
            )))}
        </div>
        <Link href="/" className="back-link">トップへ戻る</Link>
      </main>
    </>
  );
}
