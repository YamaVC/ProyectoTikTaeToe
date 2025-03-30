const gameContainer = document.getElementById('gameContainer');
const message = document.getElementById('message');
const winSound = document.getElementById('winSound');
const errorSound = document.getElementById('errorSound');
const clickSound = document.getElementById('clickSound');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let gameMode = null; // 'player' o 'computer'

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function startGame(mode) {
  gameMode = mode;
  restartGame();
}

function createBoard() {
  gameContainer.innerHTML = '';
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.dataset.index = index;
    cellElement.addEventListener('click', () => handleCellClick(index));
    gameContainer.appendChild(cellElement);
  });
}

function handleCellClick(index) {
  if (board[index] !== '' || !isGameActive) {
    errorSound.play();
    showMessage(`Movimiento inválido. Pierdes tu turno.`);
    switchPlayer();
    if (gameMode === 'computer' && currentPlayer === 'O') {
      setTimeout(makeComputerMove, 1000); // La computadora juega después de perder el turno
    }
    return;
  }

  clickSound.play();
  board[index] = currentPlayer;
  const cell = document.querySelector(`[data-index="${index}"]`);
  cell.classList.add(currentPlayer);
  cell.textContent = currentPlayer;

  if (checkWin()) {
    winSound.play();
    showMessage(`${currentPlayer} ha ganado! 🎉`);
    isGameActive = false;
    return;
  }

  if (board.every(cell => cell !== '')) {
    showMessage('Empate! 😐');
    isGameActive = false;
    return;
  }

  switchPlayer();

  if (gameMode === 'computer' && currentPlayer === 'O') {
    setTimeout(makeComputerMove, 500);
  }
}

function checkWin() {
  return winningConditions.some(condition => {
    const [a, b, c] = condition;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function showMessage(text) {
  message.textContent = text;
  message.classList.add('show');
  setTimeout(() => message.classList.remove('show'), 3000);
}

function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameActive = true;
  createBoard();
}

function makeComputerMove() {
  let bestMove = findBestMove(board);
  if (bestMove !== -1) {
    handleCellClick(bestMove);
  }
}

function findBestMove(board) {
  // Prioridad 1: Ganar si es posible
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      if (checkWin()) {
        board[i] = ''; // Deshacer el movimiento temporal
        return i;
      }
      board[i] = ''; // Deshacer el movimiento temporal
    }
  }

  // Prioridad 2: Bloquear al jugador
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      if (checkWin()) {
        board[i] = ''; // Deshacer el movimiento temporal
        return i;
      }
      board[i] = ''; // Deshacer el movimiento temporal
    }
  }

  // Prioridad 3: Elegir un movimiento estratégico (centro, esquinas, bordes)
  const strategicMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // Centro, esquinas, bordes
  for (let move of strategicMoves) {
    if (board[move] === '') {
      return move;
    }
  }

  return -1; // No hay movimientos disponibles
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}