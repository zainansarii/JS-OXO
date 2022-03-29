import { Simulation } from "./ai.js";

window.addEventListener('DOMContentLoaded', () => {

    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('.reset');
    const announcer = document.querySelector('.announcer');

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
        currentPlayer == 'X' ? currentPlayer = 'O' : currentPlayer = 'X';
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
        announcer.innerHTML = 'Player ' + currentPlayer + ' wins! <br><br>';
        announcer.classList.remove('hide');
        gameIsActive = false;
    }

    const checkDraw = () => {
        for(let i = 0; i < board.length; i++){
            if(board[i] == ""){
                return false;
            }
        }
        return true;
    }

    const setDraw = () => {
        announcer.innerHTML = "It's a draw! <br><br>";
        announcer.classList.remove('hide');
        gameIsActive = false;
    }

    const updateBoard = (tile, index) => {
        if(gameIsActive){
            if(!tileIsOccupied(index)){
                tile.innerHTML = '<fade-in>' + currentPlayer;
                board[index] = currentPlayer;
                checkWin() ? setWinner() : checkDraw() ? setDraw() : switchPlayer();
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
        currentPlayer='X';
        announcer.classList.add('hide');
        gameIsActive=true;
    }
    
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => updateBoard(tile, index));
    })

    resetButton.addEventListener('click', () => resetGame());
})