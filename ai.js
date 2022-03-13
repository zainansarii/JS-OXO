// export let model;

// 1) set up a table of numbers (one for each possible state of the game)
// 2) Each number is the latest estimate of the probability of winning the game from that state
// 3) This is the state's VALUE
// 4) States with 3 X's in a row => value=1
// 5) States with 3 O's in a row => value=0
// 6) Every other state has value=0.5 (50% probability of winning)

export let State = class {
    
    constructor(p1, p2) {
        this.board = [0,0,0,0,0,0,0,0,0];
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

        // MAKE SURE TO UPDATE GAME_IS_ACTIVE variable!

        // horizontal win
        for(let i = 0; i <9; i+=3){
            if(this.board[i]+this.board[i+1]+this.board[i+2]==3){
                return 1;
            }
            if(this.board[i]+this.board[i+1]+this.board[i+2]==-3){
                return -1;
            }
        }
        // vertical win
        for(let i = 0; i < 3; i++){
            if(this.board[i]+this.board[i+3]+this.board[i+6]==3){
                return 1;
            }
            if(this.board[i]+this.board[i+3]+this.board[i+6]==-3){
                return -1;
            }
        }
        // diagonal win
        if(this.board[0]+this.board[4]+this.board[8]==3 || 
            this.board[2]+this.board[4]+this.board[6]==3){
            return 1;
        }
        if(this.board[0]+this.board[4]+this.board[8]==-3 || 
            this.board[2]+this.board[4]+this.board[6]==-3){
            return -1;
        }
        // draw
        let temp = false;
        for(let i = 0; i < this.board.length; i++){
            if(this.board[i]==0){
                temp = true;
            }
        }
        if(temp==false){
            return 0;
        }
    }

    availablePositions(){
        
    }

    updateState(){

    }

    giveReward(){

    }

    reset(){

    }
    
    play(){

    }
  };


export let Agent = class {

    constructor(name){
        this.name = name;
        this.states = [];
        this.learningRate = 0.2;
        this.explorationRate = 0.3;
        this.decayGamma = 0.9;
        this.qTable = {}; // state -> value
    }

    getHash(board){
        return board.toString();
    }
    
    chooseAction(){

    }

    addState(){

    }

    feedReward(){

    }

    reset(){

    }
}