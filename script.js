// script.js


// Gameboard factory module
const gameBoard = (function() {

    /* Instance Variables */

    // Gameboard array
    const board = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ];


    /* Functional Methods */

    // Assign a space on the board
    // If the operation is successful, returns a 0
    function assignSpace(row, column, marker) {

        console.log(`Beginning assignment of marker '${marker}' at space (${row}, ${column})...`);

        // If the target is out of scope, then abort
        if (row > board.length || column > board[0].length || row < 0 || column < 0) {
            console.log(`ERROR: gameBoard.assignSpace - Invalid space (${row}, ${column})`);
            return 3;
        }

        const targetMarker = getMarkerAt(row, column);

        // If the space is occupied, then abort
        if (targetMarker !== '-') {
            console.log("That space is already taken!");
            return 1;
        }

        // If the marker is invalid, then abort
        if (marker !== 'x' && marker !== 'o') {
            console.log(`ERROR: gameBoard.assignSpace - Invalid marker '${marker}'`);
            return 2;
        }

        // Assign the element in the array to the new marker
        board[row][column] = marker;
        
        // Change the HTML element to match the marker
        const space = document.getElementById(row + "" + column);
        space.classList.add(marker);
        space.textContent = marker;

        console.log("Assignment complete.");
        return 0;

    }

    // Reset the board to its default state
    function resetBoard() {

        // Reset the board array
        const b = getBoardArray();
        for (let row = 0; row < b.length; row++) {
            for (let col = 0; col < b[row].length; col++) {
                b[row][col] = '-';
            }
        }
        console.log(getBoardString());

        // Reset the document elements
        const boardSpaces = document.querySelectorAll(".board-space");
        for (const space of boardSpaces) {
            space.textContent = "";
            space.classList = "board-space";
        }

    }


    /* Getter/setter methods */

    // Return the main board array,
    // only for use in this object
    const getBoardArray = () => board;


    // Return the marker at the specified coordinate
    const getMarkerAt = (row, column) => board[row][column];

    // Return the markers in a row as an array
    const getRow = (row) => board[row];

    // Return the markers in a column as an array
    const getColumn = (column) => [ board[0][column], board[1][column], board[2][column] ];

    // Return the board in a 3x3 grid string
    const getBoardString = () => {
        let boardString = "";
        for (let row = 0; row < board.length; row++) {
            for (let column of board[row]) boardString += column + ' ';
            boardString += '\n';
        }
        return boardString;
    }


    // Object definition
    return {
        // Functional methods
        assignSpace,
        resetBoard,

        // Getter/setter methods
        getMarkerAt,
        getRow,
        getColumn,
        getBoardString
    }

})();


// Player factory
function createPlayer(marker) {

    // If the marker is invalid, return null
    if (marker !== 'x' && marker !== 'o') {
        console.log(`ERROR: createPlayer - Invalid marker '${marker}'`);
        return null;
    }

    // Set the default player name
    let name = "Player " + marker;

    // Changes the player name
    const setName = (newName) => name = newName;

    // Return player info
    const getName = () => name;

    // Object definition
    return {
        marker,

        setName,

        getName
    }

}


// Game manager factory module
// The game manager governs turn order and who wins
const gameManager = (function() {

    /* Instance Variables */

    // The player objects
    let player1;
    let player2;

    // Keep track of turns
    let turn;


    /* Functional Methods */

    // Start the game
    function startGame(players) {

        console.log("Starting game.");
        gameOver = false;

        // Set player objects first
        // If there aren't 2 players passed to this function, return 1
        if (!Array.isArray(players) || players.length !== 2) {
            console.log("ERROR: gameManager.startGame - Invalid number of players");
            return 1;
        }

        player1 = players[0];
        console.log("Player 1: " + player1.getName());
        player2 = players[1];
        console.log("Player 2: " + player2.getName());

        // Set the turn to 1 and alternate between players
        turn = 1;
    }


    // Have the current player make their play
    function takeTurn(row, column) {

        // Determine whose turn it is
        // Odd turns are player 1 and evens are player 2
        const currentPlayer = (turn % 2 === 1) ? player1 : player2;
        const currentMarker = currentPlayer.marker;

        // If the assignment is successful, then increase the turn count
        // Otherwise, abort
        if (gameBoard.assignSpace(row, column, currentMarker) === 0) turn++;
        else {
            console.log(`Turn unsuccessful for player ${currentPlayer.getName()}.`);
            return;
        }

        // Check the board for lines and, if so, end the game
        const boardState = checkBoard();
        if (boardState !== 1) {
            console.log(`Game over! ${boardState.getName()} wins!`);
            displayGameOver(boardState);
            return;
        }

    }


    // Check the board for any lines and return the corresponding player
    // If none, return 1
    function checkBoard() {

        console.log("Checking board...");

        // First, check horizontal lines
        const rowLength = gameBoard.getRow(0).length;
        for (let row = 0; row < rowLength; row++) {

            // Get the row as an array
            const currentRow = gameBoard.getRow(row);

            // Compare the first marker in the row with the rest of the markers in the row
            // If the marker is blank, then skip this iteration
            if (currentRow[0] === '-') continue;

            if (currentRow[0] === currentRow[1] && currentRow[0] === currentRow[2]) {
                console.log(`Line found at row ${row}.`);
                const winningPlayer = getPlayerWithMarker(currentRow[0]);    
                return winningPlayer;
            }

        }

        // Secondly, check vertical lines
        const columnLength = gameBoard.getColumn(0).length;
        for (let col = 0; col < columnLength; col++) {

            // Get the column as an array
            const currentColumn = gameBoard.getColumn(col);

            // Compare the first marker in the row with the rest of the markers in the column
            // If the marker is blank, then skip this iteration
            if (currentColumn[0] === '-') continue;

            if (currentColumn[0] === currentColumn[1] && currentColumn[0] === currentColumn[2]) {
                console.log(`Line found at column ${col}.`);
                const winningPlayer = getPlayerWithMarker(currentColumn[0]);    
                return winningPlayer;
            }

        }

        // Finally, check diagonals
        const topRow = gameBoard.getRow(0);
        const middleRow = gameBoard.getRow(1);
        const bottomRow = gameBoard.getRow(2);

        // Since only 2 diagonals are possible, directly check for them
        const topDiagonal = topRow[0] !== '-' && topRow[0] === middleRow[1] && topRow[0] === bottomRow[2];
        const bottomDiagonal = bottomRow[0] !== '-' && bottomRow[0] === middleRow[1] && bottomRow[0] === topRow[2];

        if (topDiagonal || bottomDiagonal) {
            const finishText = (topDiagonal) ? `Line found in top diagonal.` : `Line found in bottom diagonal`;
            console.log(finishText);
            const winningPlayer = (topDiagonal) ? getPlayerWithMarker(topRow[0]) : getPlayerWithMarker(bottomRow[0]);
            return winningPlayer;
        }

        console.log("No winning players detected.");
        return 1;

    }


    // Reset all variables
    function resetGame() {
        player1, player2, turn = undefined;
    }


    /* Getter/Setter Methods */
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    const getTurn = () => turn;
    const getPlayerWithMarker = (marker) => {
        if (player1.marker === marker) return player1;
        else if (player2.marker === marker) return player2;
        else return 1;
    };


    // Object definition
    return {
        // Functional methods
        startGame,
        takeTurn,
        resetGame,

        // Getter/Setter methods
        getPlayer1,
        getPlayer2,
        getTurn,
        getPlayerWithMarker
    }

})();


// Bind the form submission to process the
// submitted names and start the game
const playerForm = document.getElementById("player-form");
playerForm.addEventListener("submit", function (event) {

    // Prevent default behavior
    event.preventDefault();

    // Assign values
    const player1name = document.getElementById("player1-name").value;
    const player2name = document.getElementById("player2-name").value;

    // Create players
    // Player 1 is 'x' and player 2 is 'o'
    const player1 = createPlayer('x');
    if (player1name !== "") player1.setName(player1name);
    const player2 = createPlayer('o');
    if (player2name !== "") player2.setName(player2name);

    // Finally, remove the form, remove the overlay,
    // and initialize the game
    playerForm.classList.toggle("hidden");
    document.getElementById("gameboard-overlay").classList.toggle("hidden");
    gameManager.startGame([player1, player2]);
});


// Hide the game over screen by default
const gameOverScreen = document.getElementById("gameover-overlay");
gameOverScreen.classList.toggle("hidden");

// Display the game over screen
function displayGameOver(player) {

    // First, display the winning the player
    const winningPlayer = gameOverScreen.querySelector(".winning-player");
    winningPlayer.textContent = player.getName() + " wins!";

    gameOverScreen.classList.toggle("hidden");
}


// Reset the game
function resetGame() {

    console.log("Resetting game.");
    gameBoard.resetBoard();
    gameManager.resetGame();
    playerForm.classList.toggle("hidden");
    document.getElementById("gameboard-overlay").classList.toggle("hidden");
    gameOverScreen.classList.toggle("hidden");

}

