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
        this.gameActive = true;
    }

    getHash(){
        let boardHash = this.board.toString();
        return boardHash;
    }

    winner(){
        // horizontal win
        for(let i = 0; i <9; i+=3){
            if(this.board[i]+this.board[i+1]+this.board[i+2]==3){
                this.gameActive = false;
                return 1;
            }
            if(this.board[i]+this.board[i+1]+this.board[i+2]==-3){
                this.gameActive = false;
                return -1;
            }
        }
        // vertical win
        for(let i = 0; i < 3; i++){
            if(this.board[i]+this.board[i+3]+this.board[i+6]==3){
                this.gameActive = false;
                return 1;
            }
            if(this.board[i]+this.board[i+3]+this.board[i+6]==-3){
                this.gameActive = false;
                return -1;
            }
        }
        // diagonal win
        if(this.board[0]+this.board[4]+this.board[8]==3 || 
            this.board[2]+this.board[4]+this.board[6]==3){
            this.gameActive = false;
            return 1;
        }
        if(this.board[0]+this.board[4]+this.board[8]==-3 || 
            this.board[2]+this.board[4]+this.board[6]==-3){
            this.gameActive = false;
            return -1;
        }
        // draw
        let isDraw = true;
        for(let i = 0; i < this.board.length; i++){
            if(this.board[i] == ""){
                isDraw = false;
            }
        }
        if(isDraw == true){
            return 0;
        }
        return null;
    }

    availableActions(){
        // returns array of possible moves
        let positions = [];
        for(let i = 0; i < this.board.length; i++){
            if(this.board[i] == 0){
                positions.push(i);
            }
        }
        return positions;
    }

    updateState(position, player){
        this.board[position] = player.playerNumber;
    }

    giveReward(){
        let res = this.winner();
        if(res == 1){
            this.p1.feedReward(1);
            this.p2.feedReward(0);
        }
        else if(res == -1){
            this.p1.feedReward(0);
            this.p2.feedReward(1);
        }
        else{
            this.p1.feedReward(0.1);
            this.p1.feedReward(0.5);
        }
    }

    play(){
        let epochs = 100;
        for(let i = 0; i < epochs; i++){
            while(this.gameActive){
                // player 1 move: update simulation
                let possibleActions = this.availableActions();
                let p1_action = this.p1.chooseAction(this.board, possibleActions);
                this.updateState(p1_action, this.p1);
                // player 1 move: update agent
                let boardHash = this.getHash();
                this.p1.addState(boardHash);

                // check for winner
                if(this.winner()!=null){
                    this.giveReward();
                    this.reset();
                    break;
                }
                // if no winner, player 2 moves
                else{
                    // player 2 move: update simulation
                    possibleActions = this.availableActions();
                    let p2_action = this.p2.chooseAction(this.board, possibleActions);
                    this.updateState(p2_action, this.p2);
                    // player 2 move: update agent
                    boardHash = this.getHash();
                    this.p2.addState(boardHash)

                    // check for winner
                    if(this.winner()!=null){
                        this.giveReward();
                        this.reset();
                        break;
                    }
                }
            }
        }
    }

    reset(){
        this.board = [0,0,0,0,0,0,0,0,0];
        this.boardHash = undefined;
        this.gameActive = false;
        this.p1.reset();
        this.p2.reset();
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
        // ADD EXPLORATION 20%
        // choose action with highest value in qTable
        if(Math.random() < 0.2){
            //EXPLORE
        }
        else{
            let possibleBoards = [];
            for(let i = 0; i < possibleActions.length; i++){
                possibleBoards[i] = board;
                possibleBoards[i][possibleActions[i]] = this.playerNumber;
            }
            let index = 0;
            let maxValue = -999;
            for(let i = 0; i < possibleBoards.length; i++){
                let value = this.qTable[this.getHash(possibleBoards[i])];
                if(value==undefined){
                    value=0
                }
                if(value > maxValue){
                    maxValue = value;
                    index = i;
                }
            }
            return possibleActions[index];
        }
    }

    addState(boardHash){
        this.states.push(boardHash)
    }

    // at the end of the game, backpropogate and update states values
    feedReward(reward){
        let r = reward;
        // reverse loop through states visited during game
        for(let i = this.states.length - 1; i >-1; i--){
            this.qTable[this.states[i]] += this.learningRate*(this.decayGamma * r - this.qTable[this.states[i]]);
            r = this.qTable[this.states[i]];
        }
    }

    reset(){
        this.states = []
    }

    updateqTable(boardHash){
        // state (board hash) -> value
        if(this.qTable[boardHash]==undefined){
            this.qTable[boardHash]=0;
        }
    }
}

let p1 = new Agent(1);
let p2 = new Agent(-1);
let simulation = new Simulation(p1, p2);
// console.log(simulation.play())


// var dict = {
//     'zain': 'cool',
//     'ben': '4',
//     'k': 'chsss'
//   };
//   dict['zain'] = 'hi'
// console.log(dict['zain'])