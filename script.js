document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const playerHand = document.getElementById('player-hand');
    const footer = document.getElementById('footer');
    const startGameButton = document.getElementById('start-game-button');
    const drawTileButton = document.getElementById('draw-tile-button');
    const endTurnButton = document.getElementById('end-turn-button');
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');
    const gameModeSelect = document.getElementById('game-mode-select');
    const dominoesContainer = document.getElementById('dominoes-container');

    let dominoes = [];
    let playerHandTiles = [];
    let cpuHandTiles = [];
    let boardTiles = [];
    let gameStarted = false;
    let currentMode = '';
    let playerTurn = true; // Assume player starts

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

    // Render a single domino
    function renderDomino(tile, isPlayerHand = false) {
        const [side1, side2] = tile;
        const dominoElement = document.createElement('div');
        dominoElement.className = 'domino';
        dominoElement.innerHTML = `
            <div class="side">${renderPips(side1)}</div>
            <div class="divider"></div>
            <div class="side">${renderPips(side2)}</div>
        `;

        if (isPlayerHand) {
            dominoElement.classList.add('player-hand-tile');
            dominoElement.onclick = () => {
                if (gameStarted && playerTurn) {
                    playTile(tile);
                }
            };
        }

        return dominoElement;
    }

    // Render pips for a domino side
    function renderPips(number) {
        let pips = '';
        for (let i = 0; i < number; i++) {
            pips += '<div class="pip"></div>';
        }
        return pips;
    }

    // Start the game
    function startGame() {
        currentMode = gameModeSelect.value;
        if (currentMode) {
            gameBoard.classList.remove('hidden');
            playerHand.classList.remove('hidden');
            footer.classList.remove('hidden');
            document.getElementById('main-menu').classList.add('hidden');

            // Clear previous game state
            dominoesContainer.innerHTML = '';
            playerHand.innerHTML = '';
            playerHandTiles = [];
            cpuHandTiles = [];
            boardTiles = [];
            gameStarted = true;
            playerTurn = true;

            // Initialize and shuffle dominoes
            initializeDominoes();

            // Deal tiles to players
            dealTiles();

            // Render player hand
            renderPlayerHand();
        }
    }

    // Deal tiles to players
    function dealTiles() {
        const tilesToDeal = currentMode === '1v1' ? 7 : 5;
        for (let i = 0; i < tilesToDeal; i++) {
            playerHandTiles.push(dominoes.pop());
            if (currentMode === '1vPC') {
                cpuHandTiles.push(dominoes.pop());
            }
        }
    }

    // Render player's hand
    function renderPlayerHand() {
        playerHand.innerHTML = '';
        playerHandTiles.forEach(tile => {
            playerHand.appendChild(renderDomino(tile, true));
        });
    }

    // Play a tile
    function playTile(tile) {
        if (isValidMove(tile)) {
            boardTiles.push(tile);
            playerHandTiles = playerHandTiles.filter(t => t !== tile);
            renderPlayerHand();
            renderBoard();
            playerTurn = false;
            if (currentMode === '1vPC') {
                cpuMove();
            } else {
                playerTurn = !playerTurn;
            }
        }
    }

    // Check if a move is valid
    function isValidMove(tile) {
        if (boardTiles.length === 0) {
            return true;
        }
        const [side1, side2] = tile;
        const [end1, end2] = boardTiles[boardTiles.length - 1];
        return side1 === end1 || side1 === end2 || side2 === end1 || side2 === end2;
    }

    // Render the game board
    function renderBoard() {
        dominoesContainer.innerHTML = '';
        boardTiles.forEach(tile => {
            dominoesContainer.appendChild(renderDomino(tile));
        });
    }

    // CPU makes a move
    function cpuMove() {
        setTimeout(() => {
            const tile = cpuHandTiles.find(isValidMove);
            if (tile) {
                boardTiles.push(tile);
                cpuHandTiles = cpuHandTiles.filter(t => t !== tile);
                renderBoard();
            } else {
                drawTile(cpuHandTiles);
            }
            playerTurn = true;
        }, 1000);
    }

    // Draw a tile
    function drawTile(hand) {
        if (dominoes.length > 0) {
            hand.push(dominoes.pop());
            if (hand === playerHandTiles) {
                renderPlayerHand();
            }
        }
    }

    // Event listeners
    startGameButton.addEventListener('click', startGame);
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
    sendChatButton.addEventListener('click', () => {
        alert(`Chat message: ${chatInput.value}`);
        chatInput.value = '';
    });
});
