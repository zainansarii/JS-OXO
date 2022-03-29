// export let model;

// 1) set up a table of numbers (one for each possible state of the game)
// 2) Each number is the latest estimate of the probability of winning the game from that state
// 3) This is the state's VALUE
// 4) States with 3 X's in a row => value=1
// 5) States with 3 O's in a row => value=0
// 6) Every other state has value=0.5 (50% probability of winning)

export let Simulation = class {
    
    constructor(p1,p2) {
        this.p1 = p1
        this.p2 = p2
        this.board = [0,0,0,0,0,0,0,0,0];
        this.game_active = true;
    }

    possibleMoves() {
        let moves = [];
        for(let i = 0; i < this.board.length; i++){
            if(this.board[i]==0){
                moves.push(i);
            }
        }
        return moves;
    }

    getHash(){
        this.boardHash = this.board.toString();
        return this.boardHash;
    }

    winner(){
        // horizontal win
        for(let i = 0; i <9; i+=3){
            if(this.board[i]+this.board[i+1]+this.board[i+2]==3){
                this.game_active = false;
                return 1;
            }
            if(this.board[i]+this.board[i+1]+this.board[i+2]==-3){
                this.game_active = false;
                return -1;
            }
        }
        // vertical win
        for(let i = 0; i < 3; i++){
            if(this.board[i]+this.board[i+3]+this.board[i+6]==3){
                this.game_active = false;
                return 1;
            }
            if(this.board[i]+this.board[i+3]+this.board[i+6]==-3){
                this.game_active = false;
                return -1;
            }
        }
        // diagonal win
        if(this.board[0]+this.board[4]+this.board[8]==3 || 
            this.board[2]+this.board[4]+this.board[6]==3){
            this.game_active = false;
            return 1;
        }
        if(this.board[0]+this.board[4]+this.board[8]==-3 || 
            this.board[2]+this.board[4]+this.board[6]==-3){
            this.game_active = false;
            return -1;
        }
        // draw
        let isDraw = true;
        for(let i = 0; i < this.board.length; i++){
            if(board[i] == ""){
                isDraw = false;
            }
        }
        if(isDraw == true){
            return 0;
        }
        return null;
    }

    availablePositions(){
        // returns array of possible moves
        let positions = [];
        for(let i = 0; i < this.board.length; i++){
            if(this.board[i] == 0){
                positions.push(i);
            }
        }
        return positions;
    }

    updateState(position){
    }

    giveReward(){

    }

    reset(){

    }
    
    play(){

    }
  };

export let Agent = class {

    constructor(playerNumber){
        this.playerNumber = playerNumber;
        this.states = [];
        this.learningRate = 0.2;
        this.explorationRate = 0.3;
        this.decayGamma = 0.9;
        this.qTable = {};
    }

    getHash(board){
        return board.toString();
    }
    
    chooseAction(board, possibleActions){
        // choose action with highest value in qTable
        let possibleBoards = [];
        for(let i = 0; i < possibleActions.length; i++){
            possibleBoards[i] = board;
            possibleBoards[i][possibleActions[i]] = this.playerNumber;
        }
        let index = 0;
        let maxValue = 0;
        for(let i = 0; i < possibleBoards.length; i++){
            let value = this.qTable[this.getHash(possibleBoards[i])];
            if(value > maxValue){
                maxValue = value;
                index = i;
            }
        }
        return possibleActions[i];
    }

    addState(){

    }

    feedReward(){

    }

    reset(){

    }

    updateqTable(boardHash){
        // state (board hash) -> value
        if(this.qTable[boardHash]==undefined){
            this.qTable[boardHash]=0;
        }
    }
}

// let p1 = new Agent(1);
// let p2 = new Agent(2);
// let simulation = new Simulation(p1, p2);

// simulation.play();
// above should result in two trained AI: p1 and p2

let test = {}
console.log(test[''])