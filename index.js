window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('.reset');
    const announcer = document.querySelector('.announcer');

    // this is just the in-memory board state!
    let board = ['','','','','','','','',''];
    let currentPlayer = 'X'

    const tileIsOccupied = (index) => {
        if(board[index]!=""){
            return true
        }
        return false 
    }

    const updateBoard = (tile, index) => {

        // maybe just update the board in memory then send that to the front end? 
        // as opposed to updating both seperately

        if(!tileIsOccupied(index)){
            tile.innerText = currentPlayer
            board[index] = currentPlayer
            if(currentPlayer=='X'){
                currentPlayer='O'
            }
            else{
                currentPlayer='X'
            }
        }
        console.log(board)
    }

    const 

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => updateBoard(tile, index));
    })

    resetButton.addEventListener('click', () => resetBoard())

})