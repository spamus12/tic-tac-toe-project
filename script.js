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
            console.log(`Error: Invalid marker '${marker}'`);
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
            for (let column of board[row]) boardString += column;
            boardString += '\n';
        }
        return boardString;
    }

})();
