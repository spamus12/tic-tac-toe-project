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

        console.log(`Beginning assignment of marker '${marker}' at space (${row}, ${column}).`);

        const targetMarker = getMarkerAt(row, column);

        // If the space is occupied, then abort
        if (targetMarker !== '-') {
            console.log("That space is already taken!");
            return 1;
        }

        // If the marker is invalid, then abort
        if (marker !== 'x' && marker !== 'o') {
            console.log(`ERROR: Gameboard.assignSpace - Invalid marker '${marker}'`);
            return 2;
        }

        // Assign the element in the array to the new marker
        board[row][column] = marker;

        console.log("Assignment complete.");
        return 0;

    }


    /* Getter/setter methods */

    // Return the marker at the specified coordinate
    const getMarkerAt = (row, column) => board[row][column];

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

        // Getter/setter methods
        getMarkerAt,
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

    // Object definition
    return {
        marker, name,

        setName
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

    // Start a game
    function startGame(players) {

        // Set player objects first
        // If there aren't 2 players passed to this function, return 1
        if (!Array.isArray(players) || players.length !== 2) {
            console.log("ERROR: gameManager.startGame - Invalid number of players");
            return 1;
        }

        player1 = players[0];
        player2 = players[1];

        // Set the turn to 1 and alternate between players
        turn = 1;

        // Play some test games
        playRound();

    }


    // Have the current player make their play
    function takeTurn(row, column) {

        // Determine whose turn it is
        // Odd turns are player 1 and evens are player 2
        const currentPlayer = (turn % 2 === 1) ? player1 : player2;
        const currentMarker = currentPlayer.marker;

        gameBoard.assignSpace(row, column, currentMarker);
        turn++;

    }


    // A function to simulate a game round
    function playRound() {

        // Example gameplay
        takeTurn(0, 1);
        takeTurn(1, 1);
        takeTurn(0, 0);
        takeTurn(0, 2);
        takeTurn(1, 0);
        takeTurn(2, 0);

    }


    /* Getter/Setter Methods */
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    const getTurn = () => turn;


    // Object definition
    return {
        // Functional methods
        startGame,

        // Getter/Setter methods
        getPlayer1,
        getPlayer2,
        getTurn
    }

})();


const player1 = createPlayer('x');
player1.setName("Dom");

const player2 = createPlayer('o');
player2.setName("Daniel");

gameManager.startGame([player1, player2]);
console.log(gameBoard.getBoardString());
