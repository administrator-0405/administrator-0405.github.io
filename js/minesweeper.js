document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('minesweeper-board');
    const flagCountElement = document.getElementById('flag-count');
    const timerElement = document.getElementById('timer');
    const resetButton = document.getElementById('reset-button');

    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 10;
    const MINE_COUNT = 15;

    let board = [];
    let flags = 0;
    let timer = 0;
    let timerInterval;
    let gameOver = false;
    let cellsRevealed = 0;

    function createBoard() {
        board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill().map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0
        })));

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < MINE_COUNT) {
            const x = Math.floor(Math.random() * BOARD_WIDTH);
            const y = Math.floor(Math.random() * BOARD_HEIGHT);
            if (!board[y][x].isMine) {
                board[y][x].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate adjacent mines
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (board[y][x].isMine) continue;
                let count = 0;
                for (let yOffset = -1; yOffset <= 1; yOffset++) {
                    for (let xOffset = -1; xOffset <= 1; xOffset++) {
                        const newY = y + yOffset;
                        const newX = x + xOffset;
                        if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH && board[newY][newX].isMine) {
                            count++;
                        }
                    }
                }
                board[y][x].adjacentMines = count;
            }
        }
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, 25px)`;

        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.y = y;
                cell.dataset.x = x;

                const cellData = board[y][x];

                if (cellData.isRevealed) {
                    cell.classList.add('revealed');
                    if (cellData.isMine) {
                        cell.classList.add('mine');
                    } else if (cellData.adjacentMines > 0) {
                        cell.textContent = cellData.adjacentMines;
                        cell.style.color = getNumberColor(cellData.adjacentMines);
                    }
                } else if (cellData.isFlagged) {
                    cell.classList.add('flagged');
                }

                cell.addEventListener('click', () => handleCellClick(y, x));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    handleRightClick(y, x);
                });

                boardElement.appendChild(cell);
            }
        }
        updateFlagCount();
    }
    
    function handleCellClick(y, x) {
        if (gameOver || board[y][x].isRevealed || board[y][x].isFlagged) {
            return;
        }

        if (timerInterval === undefined) {
            startTimer();
        }

        const cellData = board[y][x];
        cellData.isRevealed = true;
        cellsRevealed++;


        if (cellData.isMine) {
            endGame(false);
            return;
        }

        if (cellData.adjacentMines === 0) {
            revealNeighbors(y, x);
        }
        
        checkWinCondition();
        renderBoard();
    }

    function handleRightClick(y, x) {
        if (gameOver || board[y][x].isRevealed) return;
        
        const cellData = board[y][x];
        if (cellData.isFlagged) {
            cellData.isFlagged = false;
            flags--;
        } else {
            if (flags < MINE_COUNT) {
                cellData.isFlagged = true;
                flags++;
            }
        }
        renderBoard();
    }

    function revealNeighbors(y, x) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
                if (yOffset === 0 && xOffset === 0) continue;
                const newY = y + yOffset;
                const newX = x + xOffset;

                if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
                    if (!board[newY][newX].isRevealed && !board[newY][newX].isFlagged) {
                       board[newY][newX].isRevealed = true;
                       cellsRevealed++;
                       if (board[newY][newX].adjacentMines === 0) {
                           revealNeighbors(newY, newX);
                       }
                    }
                }
            }
        }
    }
    
    function checkWinCondition() {
        if (cellsRevealed === (BOARD_WIDTH * BOARD_HEIGHT) - MINE_COUNT) {
            endGame(true);
        }
    }
    
    function endGame(isWin) {
        gameOver = true;
        clearInterval(timerInterval);
        timerInterval = undefined;
        
        // Reveal all mines
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (board[y][x].isMine) {
                    board[y][x].isRevealed = true;
                }
            }
        }
        renderBoard();
        
        setTimeout(() => {
            if (isWin) {
                alert('おめでとうございます！あなたの勝ちです！');
            } else {
                alert('ゲームオーバー！');
            }
        }, 100);
    }
    
    function updateFlagCount() {
        flagCountElement.textContent = `🚩 ${MINE_COUNT - flags}`;
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            timer++;
            timerElement.textContent = timer;
        }, 1000);
    }

    function resetGame() {
        gameOver = false;
        flags = 0;
        cellsRevealed = 0;
        timer = 0;
        clearInterval(timerInterval);
        timerInterval = undefined;
        timerElement.textContent = '0';
        createBoard();
        renderBoard();
    }

    function getNumberColor(number) {
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
    }

    resetButton.addEventListener('click', resetGame);

    resetGame();
});
