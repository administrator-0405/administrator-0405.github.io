'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PixelButton from '@/components/PixelButton';
import BackToTop from '@/components/BackToTop';

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
  const [, setGameWon] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const createBoard = useCallback(() => {
    const newBoard: Cell[][] = Array(BOARD_HEIGHT).fill(null).map(() =>
      Array(BOARD_WIDTH).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const x = Math.floor(Math.random() * BOARD_WIDTH);
      const y = Math.floor(Math.random() * BOARD_HEIGHT);
      if (!newBoard[y][x].isMine) {
        newBoard[y][x].isMine = true;
        minesPlaced++;
      }
    }

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
      <Header />
      <main className="container">
        <h2 className="text-3xl text-center mb-10">マインスイーパー</h2>
        <div className="flex justify-between items-center max-w-[400px] mx-auto bg-[#222] p-3 border-4 border-white mb-5">
            <span>🚩 {MINE_COUNT - flags}</span>
            <PixelButton onClick={createBoard} className="text-sm px-2 py-1 m-0">リセット</PixelButton>
            <span>{timer}</span>
        </div>
        <div className="grid gap-[1px] bg-[#888] border-4 border-white w-fit mx-auto mb-5" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 25px)` }}>
            {board.map((row, y) => row.map((cell, x) => (
                <div
                    key={`${y}-${x}`}
                    className={`
                        w-[25px] h-[25px] flex justify-center items-center text-base cursor-pointer
                        ${cell.isRevealed ? 'bg-[#bbb] border border-[#999]' : 'bg-[#ccc] border-r-2 border-r-[#888] border-b-2 border-b-[#888] border-l-2 border-l-[#ddd] border-t-2 border-t-[#ddd]'}
                        ${cell.isMine && cell.isRevealed ? 'bg-red-600' : ''}
                        before:content-['']
                    `}
                    style={{ color: cell.isRevealed && cell.adjacentMines > 0 ? getNumberColor(cell.adjacentMines) : 'black' }}
                    onClick={() => safeHandleCellClick(y, x)}
                    onContextMenu={(e) => handleRightClick(e, y, x)}
                >
                    {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 ? cell.adjacentMines : (cell.isFlagged ? '🚩' : (cell.isRevealed && cell.isMine ? '💣' : ''))}
                </div>
            )))}
        </div>
        <BackToTop />
      </main>
      <Footer />
    </>
  );
}