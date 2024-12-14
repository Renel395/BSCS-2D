var board,
    game = new Chess();

/* Multiplayer Setup */

// Track the current player's turn
var currentPlayer = 'white';

// Function to handle the end of a player's move
var onDrop = function (source, target) {
    // Attempt to make the move
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Automatically promote to a queen if applicable
    });

    // If the move is illegal, revert it
    if (move === null) {
        return 'snapback';
    }

    // Update the board position and move history
    board.position(game.fen());
    renderMoveHistory(game.history());

    // Check if the game is over
    if (game.in_checkmate()) {
        alert(`${currentPlayer} wins by checkmate!`);
    } else if (game.in_draw()) {
        alert('The game is a draw!');
    } else if (game.in_stalemate()) {
        alert('The game is a stalemate!');
    } else if (game.in_threefold_repetition()) {
        alert('The game is a draw by threefold repetition!');
    }

    // Switch turns between players
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
};

// Function to render the move history
var renderMoveHistory = function (moves) {
    var historyList = document.getElementById("history-list");
    historyList.innerHTML = ""; // Clear existing moves
    for (var i = 0; i < moves.length; i += 2) {
        const moveItem = document.createElement("li");
        moveItem.className = "move";

        const moveNumber = Math.floor(i / 2) + 1;
        const whiteMove = moves[i];
        const blackMove = moves[i + 1] || ""; // Check if black has a move

        moveItem.innerHTML = `Move ${moveNumber}: <strong>White</strong>: ${whiteMove} <strong>Black</strong>: ${blackMove}`;
        historyList.appendChild(moveItem);
    }
};

// Function to ensure only the current player can move their pieces
var onDragStart = function (source, piece, position, orientation) {
    // Prevent dragging if the game is over
    if (game.game_over()) {
        return false;
    }

    // Prevent dragging if it's not the player's turn
    if (
        (currentPlayer === 'white' && piece.search(/^b/) !== -1) ||
        (currentPlayer === 'black' && piece.search(/^w/) !== -1)
    ) {
        return false;
    }
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop
};

board = ChessBoard('board', cfg);
