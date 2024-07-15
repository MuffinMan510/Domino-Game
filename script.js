document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const gameBoard = document.getElementById('game-board');
    const playerHand = document.getElementById('player-hand');
    const footer = document.getElementById('footer');
    const startGameButton = document.getElementById('start-game-button');
    const drawTileButton = document.getElementById('draw-tile-button');
    const endTurnButton = document.getElementById('end-turn-button');
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');
    const gameModeSelect = document.getElementById('game-mode-select');
    const scoreGoalSelect = document.getElementById('score-goal-select');
    const dominoesContainer = document.getElementById('dominoes-container');
    const playerScoreDisplay = document.getElementById('player-score');
    const cpuScoreDisplay = document.getElementById('cpu-score');

    let dominoes = [];
    let playerHandTiles = [];
    let cpuHandTiles = [];
    let boardTiles = [];
    let gameStarted = false;
    let currentMode = '';
    let scoreGoal = 100;
    let playerTurn = true; // Assume player starts
    let playerScore = 0;
    let cpuScore = 0;

    // Initialize the game with a standard set of dominoes
    function initializeDominoes() {
        dominoes = [];
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                dominoes.push([i, j]);
            }
        }
        dominoes = shuffleArray(dominoes);
    }

    // Shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Draw a tile for the player or CPU
    function drawTile(hand) {
        if (dominoes.length > 0) {
            const tile = dominoes.pop();
            hand.push(tile);
            renderHand();
        }
    }

    // Render the player's hand of dominoes
    function renderHand() {
        playerHand.innerHTML = '';
        playerHandTiles.forEach(tile => {
            const dominoElement = document.createElement('div');
            dominoElement.className = 'domino';
            const [side1, side2] = tile;
            dominoElement.innerHTML = `
                <div class="side top">${side1}</div>
                <div class="divider"></div>
                <div class="side bottom">${side2}</div>
            `;
            playerHand.appendChild(dominoElement);
        });
    }

    // Render the game board
    function renderBoard() {
        dominoesContainer.innerHTML = '';
        boardTiles.forEach(tile => {
            const dominoElement = document.createElement('div');
            dominoElement.className = 'domino';
            const [side1, side2] = tile;
            dominoElement.innerHTML = `
                <div class="side top">${side1}</div>
                <div class="divider"></div>
                <div class="side bottom">${side2}</div>
            `;
            dominoesContainer.appendChild(dominoElement);
        });
    }

    // Update the score display
    function updateScore() {
        playerScoreDisplay.textContent = `Player Score: ${playerScore}`;
        cpuScoreDisplay.textContent = `CPU Score: ${cpuScore}`;
    }

    // Check if the game is over and update scores
    function checkGameOver() {
        if (dominoes.length === 0) {
            let message = '';
            if (playerHandTiles.length === 0) {
                message = 'You win!';
                playerScore += 10; // Example scoring, adjust as needed
            } else if (cpuHandTiles.length === 0) {
                message = 'CPU wins!';
                cpuScore += 10; // Example scoring, adjust as needed
            } else {
                message = 'It\'s a tie!';
            }
            updateScore();
            if (playerScore >= scoreGoal) {
                message = 'Congratulations! You won the game!';
            } else if (cpuScore >= scoreGoal) {
                message = 'CPU won the game! Better luck next time!';
            }
            if (message) {
                alert(message);
                resetGame();
            }
        }
    }

    // Reset the game to the initial state
    function resetGame() {
        gameStarted = false;
        gameBoard.classList.add('hidden');
        playerHand.classList.add('hidden');
        footer.classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        gameModeSelect.value = '';
        scoreGoalSelect.value = 100;
        playerScore = 0;
        cpuScore = 0;
        playerScoreDisplay.textContent = `Player Score: ${playerScore}`;
        cpuScoreDisplay.textContent = `CPU Score: ${cpuScore}`;
        // Clear the arrays and DOM elements
        playerHandTiles = [];
        cpuHandTiles = [];
        boardTiles = [];
        dominoesContainer.innerHTML = '';
        playerHand.innerHTML = '';
    }

    // Handle the start game action
    function startGame() {
        if (!gameStarted && gameModeSelect.value) {
            currentMode = gameModeSelect.value;
            scoreGoal = parseInt(scoreGoalSelect.value, 10);
            gameStarted = true;
            gameBoard.classList.remove('hidden');
            playerHand.classList.remove('hidden');
            footer.classList.remove('hidden');
            document.getElementById('main-menu').classList.add('hidden');
            initializeDominoes();
            playerHandTiles = [];
            cpuHandTiles = [];
            boardTiles = [];

            // Draw initial tiles for the player and CPU
            for (let i = 0; i < 7; i++) {
                drawTile(playerHandTiles);
            }
            for (let i = 0; i < 7; i++) {
                drawTile(cpuHandTiles);
            }
            // Start the game by rendering the initial hand and setting up the board
            renderHand();
            renderBoard();

            // Initial draw for CPU if 1vPC mode
            if (currentMode === '1vPC') {
                cpuMove();
            }
        }
    }

    // CPU move logic for 1vPC mode
    function cpuMove() {
        if (gameStarted && !playerTurn) {
            // Simple CPU logic: just draw a tile and make a random move
            drawTile(cpuHandTiles);
            playerTurn = !playerTurn;
            // Add logic for CPU to play a tile
            // Example: if (cpuHandTiles.length > 0) { /* make a move */ }

            // Check if the game is over
            checkGameOver();
        }
    }

    // Handle the draw tile button click
    drawTileButton.addEventListener('click', () => {
        if (gameStarted && playerTurn) {
            drawTile(playerHandTiles);
            playerTurn = false;
            if (currentMode === '1vPC') {
                cpuMove();
            } else {
                playerTurn = !playerTurn;
            }
        }
    });

    // Handle the end turn button click
    endTurnButton.addEventListener('click', () => {
        if (gameStarted && playerTurn) {
            playerTurn = false;
            if (currentMode === '1vPC') {
                cpuMove();
            } else {
                playerTurn = !playerTurn;
            }
        }
    });

    // Handle the chat send button click
    sendChatButton.addEventListener('click', () => {
        if (chatInput.value.trim()) {
            console.log('Chat message:', chatInput.value);
            chatInput.value = '';
        }
    });

    // Event listener for the start game button
    startGameButton.addEventListener('click', startGame);

    // Update the DOM elements based on the game state
    function updateDOM() {
        // Add any additional UI updates here
    }

    // Initialize the game state and UI
    function init() {
        // Add any initial setup here
        updateDOM();
    }

    init(); // Call the init function to set up the game

    // Update the game state and UI when the game is running
    function gameLoop() {
        if (gameStarted) {
            // Update game state
            checkGameOver();
            // Render game state
            renderHand();
            renderBoard();
        }
    }

    // Call gameLoop periodically for updates (e.g., every second)
    setInterval(gameLoop, 1000);

});
// Render a domino tile with pips
function renderDomino(tile, container) {
    const [side1, side2] = tile;
    const dominoElement = document.createElement('div');
    dominoElement.className = 'domino';

    const topContainer = document.createElement('div');
    topContainer.className = 'top';
    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'bottom';

    // Define pips based on the number on each side
    topContainer.appendChild(createPipContainer(side1));
    bottomContainer.appendChild(createPipContainer(side2));

    dominoElement.appendChild(topContainer);
    dominoElement.appendChild(bottomContainer);
    container.appendChild(dominoElement);
}

// Create a pip container based on the number
function createPipContainer(num) {
    const pipContainer = document.createElement('div');
    pipContainer.className = 'pip-container';

    const pips = [];
    if (num === 1) {
        pips.push(createPip());
    } else if (num === 2) {
        pips.push(createPip(), createPip());
    } else if (num === 3) {
        pips.push(createPip(), createPip(), createPip());
    } else if (num === 4) {
        pips.push(createPip(), createPip(), createPip(), createPip());
    } else if (num === 5) {
        pips.push(createPip(), createPip(), createPip(), createPip(), createPip());
    } else if (num === 6) {
        for (let i = 0; i < 6; i++) {
            pips.push(createPip());
        }
    }

    pips.forEach(pip => pipContainer.appendChild(pip));
    return pipContainer;
}

// Create a single pip element
function createPip() {
    const pip = document.createElement('div');
    pip.className = 'pip';
    return pip;
}
