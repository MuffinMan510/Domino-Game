document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const playerHand = document.getElementById('player-hand');
    const playerVisibleHand = document.getElementById('player-visible-hand');
    const opponentHand = document.getElementById('opponent-hand');
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
    const opponentBonesCount = document.getElementById('opponent-bones-count');

    let dominoes = [];
    let playerHandTiles = [];
    let cpuHandTiles = [];
    let boardTiles = [];
    let gameStarted = false;
    let currentMode = '';
    let scoreGoal = 100;
    let playerTurn = true;
    let playerScore = 0;
    let cpuScore = 0;

    function initializeDominoes() {
        dominoes = [];
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                dominoes.push([i, j]);
            }
        }
        shuffleArray(dominoes);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function drawTile() {
        if (dominoes.length === 0) return;

        return dominoes.pop();
    }

    function displayTiles() {
        playerVisibleHand.innerHTML = '';
        playerHandTiles.forEach(tile => {
            const dominoDiv = document.createElement('div');
            dominoDiv.className = 'domino';
            dominoDiv.innerHTML = `
                <div class="top">${tile[0] !== null ? `<div class="pip ${'pip' + tile[0]}"></div>` : ''}</div>
                <div class="bottom">${tile[1] !== null ? `<div class="pip ${'pip' + tile[1]}"></div>` : ''}</div>
            `;
            playerVisibleHand.appendChild(dominoDiv);
        });

        // Display the opponent’s face-down tiles
        opponentHand.innerHTML = '';
        cpuHandTiles.forEach(() => {
            const faceDownDiv = document.createElement('div');
            faceDownDiv.className = 'domino face-down';
            opponentHand.appendChild(faceDownDiv);
        });

        // Update the count of the opponent's tiles
        opponentBonesCount.textContent = cpuHandTiles.length;
    }

    function startGame() {
        initializeDominoes();
        playerHandTiles = [];
        cpuHandTiles = [];
        boardTiles = [];

        for (let i = 0; i < 7; i++) {
            playerHandTiles.push(drawTile());
            cpuHandTiles.push(drawTile());
        }

        currentMode = gameModeSelect.value;
        scoreGoal = parseInt(scoreGoalSelect.value);
        playerTurn = true;
        gameStarted = true;
        drawTileButton.style.display = 'block';
        endTurnButton.style.display = 'block';
        startGameButton.style.display = 'none';

        displayTiles();
    }

    function endTurn() {
        if (!gameStarted || !playerTurn) return;

        // TODO: Implement the logic for ending the turn
        playerTurn = false;

        // Dummy logic for the CPU's turn
        if (cpuHandTiles.length > 0) {
            const cpuTile = cpuHandTiles.shift();
            boardTiles.push(cpuTile);
        }

        playerTurn = true;
        updateScores();
    }

    function updateScores() {
        // TODO: Implement actual scoring logic
        playerScoreDisplay.textContent = `Player Score: ${playerScore}`;
        cpuScoreDisplay.textContent = `CPU Score: ${cpuScore}`;
    }

    function sendChat() {
        const message = chatInput.value;
        if (message.trim() !== '') {
            // Append the message to the chat-messages div
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `You: ${message}`;
            document.getElementById('chat-messages').appendChild(messageDiv);
            chatInput.value = '';
        }
    }

    function handleTileDraw() {
        if (playerTurn) {
            const newTile = drawTile();
            if (newTile) {
                playerHandTiles.push(newTile);
                displayTiles();
            }
        }
    }

    // Event Listeners
    startGameButton.addEventListener('click', startGame);
    drawTileButton.addEventListener('click', handleTileDraw);
    endTurnButton.addEventListener('click', endTurn);
    sendChatButton.addEventListener('click', sendChat);

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendChat();
        }
    });
});
