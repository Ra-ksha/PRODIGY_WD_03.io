const cells = document.querySelectorAll(".cell");
const result = document.querySelector("#result");
const restartButton = document.querySelector("#restart");
const playSinglePlayerButton = document.querySelector("#playSinglePlayer");
const playComputerButton = document.querySelector("#playComputer");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let isPlayingAgainstComputer = false;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartButton.addEventListener("click", restartGame);
    playSinglePlayerButton.addEventListener("click", startSinglePlayerGame);
    playComputerButton.addEventListener("click", startGameAgainstComputer);
    result.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    if (isPlayingAgainstComputer && running) {
        setTimeout(() => {
            makeComputerMove();
            checkWinner(); 
            currentPlayer = "X"; 
            result.textContent = `${currentPlayer}'s turn`;
        }, 500);
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    result.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const [cellA, cellB, cellC] = condition.map(index => options[index]);

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }

        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        result.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.includes("")) {
        result.textContent = "Draw!";
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    result.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => (cell.textContent = ""));
    running = true;

    if (isPlayingAgainstComputer && currentPlayer === "O") {
        setTimeout(() => {
            makeComputerMove();
            checkWinner(); 
            currentPlayer = "X"; 
            result.textContent = `${currentPlayer}'s turn`;
        }, 500);
    }
}

function startSinglePlayerGame() {
    isPlayingAgainstComputer = false;
    initializeGame();
}

function startGameAgainstComputer() {
    isPlayingAgainstComputer = true;
    initializeGame();
    setTimeout(() => {
        makeComputerMove();
        checkWinner();
        currentPlayer = "X"; 
        result.textContent = `${currentPlayer}'s turn`;
    }, 500);
}

function makeComputerMove() {
    const emptyCells = options.reduce((acc, value, index) => {
        if (value === "") {
            acc.push(index);
        }
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const computerMove = emptyCells[randomIndex];
        options[computerMove] = "O";
        document.querySelector(`[cellIndex="${computerMove}"]`).textContent = "O";
    }
}

