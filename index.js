window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('.reset');
    const announcer = document.querySelector('.announcer');

    // this is just the in-memory board state!
    let board = ['','','','','','','','',''];
    let currentPlayer = 'X';
    let gameIsActive = true;


    const tileIsOccupied = (index) => {
        if(board[index]!=""){
            return true;
        }
        return false ;
    }

    const switchPlayer = () => {
        if(currentPlayer=='X'){
            currentPlayer='O';
        }
        else{
            currentPlayer='X';
        }
    }

    const horizontalWin = () => {
        for(let i = 0; i < 9; i+=3){
            if(board[i] != ""){
                if(board[i] == board[i+1] && board[i+1] == board[i+2]){
                    return true;
                }
            }
        }
        return false;
    }

    const verticalWin = () => {
        for(let i = 0; i < 3; i++){
            if(board[i] != ""){
                if(board[i] == board[i+3] && board[i+3] == board[i+6]){
                    return true;
                }
            }
        }
        return false;
    }
    
    const diagonalWin = () => {
        if(board[0] != ""){
            if(board[0] == board[4] && board[4] == board[8]){
                return true;
            }
        }
        if(board[2] != ""){
            if(board[2] == board[4] && board[4] == board[6]){
                return true;
            }
        }
        return false;
    }

    const checkWin = () => {
        if(horizontalWin() || verticalWin() || diagonalWin()){
            return true;
        }
        return false;
    }

    const setWinner = () => {
        announcer.innerHTML = 'Player ' + currentPlayer + ' wins! <br><br>'
        announcer.classList.remove('hide')
    }

    const updateBoard = (tile, index) => {
        if(gameIsActive){
            if(!tileIsOccupied(index)){
                tile.innerText = currentPlayer;
                board[index] = currentPlayer;
                if(checkWin()){
                    setWinner()
                    //freeze game
                }
                else{
                    switchPlayer();
                }
            }
        }
    }

    const resetBoard = () => {
        tiles.forEach((tile, index) => {
            tile.innerText='';
            board[index]='';
        })
    }

    const resetGame = () => {
        resetBoard();
        currentPlayer='X'
        announcer.classList.add('hide')
    }

    
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => updateBoard(tile, index));
    })

    resetButton.addEventListener('click', () => resetGame());
})