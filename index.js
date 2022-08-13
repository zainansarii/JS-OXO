let Agent = class {

    constructor(playerNumber){
        this.playerNumber = playerNumber;
        this.states = [];
        this.learningRate = 0.5;
        this.decayGamma = 0.9;
        this.qTable = JSON.parse(algo);
    }

    getHash(board){
        return board.toString();
    }
    
    chooseAction(board, possibleActions){
        let localBoard = JSON.parse(JSON.stringify(board));
        if(this.qTable[this.getHash(localBoard)] == undefined){
            this.qTable[this.getHash(localBoard)] = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        }
        let indices = [];
        let localBoardQValues = this.qTable[this.getHash(localBoard)];
        let maxQVal = Math.max(...localBoardQValues);
        for(let i = 0; i < localBoardQValues.length; i++){
            if(localBoardQValues[i] == maxQVal){
                indices.push(i);
            }
        }
        while(true){
            let index = indices[Math.floor(Math.random() * indices.length)];
            if(possibleActions.includes(index)){
                return index
            }
        }
    }

    reset(){
        this.states = []
    }
}

window.addEventListener('DOMContentLoaded', () => { 

    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('.reset');
    const announcer = document.querySelector('.announcer');

    let board = ['','','','','','','','',''];
    let currentPlayer = 'X';
    let gameIsActive = true;

    let ai = new Agent(1);
    console.log(ai.qTable)

    const tileIsOccupied = (index) => {
        if(board[index]!=""){
            return true;
        }
        return false ;
    }

    const availableActions = () => {
        let positions = [];
        for(let i = 0; i < board.length; i++){
            if(board[i] == ''){
                positions.push(i);
            }
        }
        return positions;
    }

    const getHash = () => {
        let aiBoard = [];
        board.forEach(function(item, i) { if (item == 'X') aiBoard[i] = -1; });
        board.forEach(function(item, i) { if (item == 'O') aiBoard[i] = 1; });
        board.forEach(function(item, i) { if (item == '') aiBoard[i] = 0; });
        return ai.getHash(aiBoard);
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
        if(currentPlayer == 'X'){
            announcer.innerHTML = "You win! <br><br>"
        }
        else if(currentPlayer = 'O'){
            announcer.innerHTML = "The AI wins! <br><br>"
        }
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
                // PLAYER  MOVES
                tile.innerHTML = '<fade-in>' + currentPlayer;
                board[index] = currentPlayer;
                checkWin() ? setWinner() : checkDraw() ? setDraw() : switchPlayer();
                // AI MOVES
                setTimeout(function(){
                    if(gameIsActive){
                        let boardHash = getHash();
                        let aiAction = ai.chooseAction(boardHash, availableActions());
                        tiles[aiAction].innerHTML = '<fade-in>' + currentPlayer;
                        board[aiAction] = currentPlayer;
                        checkWin() ? setWinner() : checkDraw() ? setDraw() : switchPlayer();
                    }
                }, 300); 
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