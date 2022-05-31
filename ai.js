// export let model;

// 1) set up a table of numbers (one for each possible state of the game)
// 2) Each number is the latest estimate of the probability of winning the game from that state
// 3) This is the state's VALUE
// 4) States with 3 X's in a row => value=1
// 5) States with 3 O's in a row => value=0
// 6) Every other state has value=0.5 (50% probability of winning)


let Simulation = class {
    
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
            this.p1.feedReward(-1);
            this.p2.feedReward(1);
        }
        else{
            this.p1.feedReward(0.1);
            this.p2.feedReward(0.1);
        }
    }


    // player 1 moves first
    // train(){
    //     let epochs = 500000;
    //     for(let i = 0; i < epochs; i++){
    //         console.log("progress = " + i + "/" + epochs)
    //         this.gameActive = true;
    //         while(this.gameActive){
    //             // player 1 move: update simulation
    //             let possibleActions = this.availableActions();
    //             let p1_action = this.p1.chooseAction(this.board, possibleActions);
    //             this.updateState(p1_action, this.p1);
    //             // check for winner
    //             if(this.winner()!=null){
    //                 this.giveReward();
    //                 this.reset();
    //                 break;
    //             }
    //             // if no winner, player 2 moves
    //             else{
    //                 // player 2 move: update simulation
    //                 possibleActions = this.availableActions();
    //                 let p2_action = this.p2.chooseAction(this.board, possibleActions);
    //                 this.updateState(p2_action, this.p2);
    //                 // check for winner
    //                 if(this.winner()!=null){
    //                     this.giveReward();
    //                     this.reset();
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     var fs = require('fs');
    //     fs.writeFile("test.json", JSON.stringify(this.p1.qTable), function(err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //     });
    // }

    // player 2 moves first
    train(){
        let epochs = 500000;
        for(let i = 0; i < epochs; i++){
            console.log("progress = " + i + "/" + epochs)
            this.gameActive = true;
            while(this.gameActive){
                // player 1 move: update simulation
                let possibleActions = this.availableActions();
                let p2_action = this.p2.chooseAction(this.board, possibleActions);
                this.updateState(p2_action, this.p2);
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
                    let p1_action = this.p1.chooseAction(this.board, possibleActions);
                    this.updateState(p1_action, this.p1);
                    // check for winner
                    if(this.winner()!=null){
                        this.giveReward();
                        this.reset();
                        break;
                    }
                }
            }
        }
        var fs = require('fs');
        fs.writeFile("test_2.json", JSON.stringify(this.p1.qTable), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    // player 1 moves first
    // test(){
    //     this.gameActive=true;
    //     this.p1.loadqTable('test.json');
    //     while(this.gameActive){
    //         this.showBoard()
    //         console.log("AI thinking...")
    //         let possibleActions = this.availableActions();
    //         let p1_action = this.p1.chooseAction(this.board, possibleActions);
    //         this.updateState(p1_action, this.p1);
    //         // // player 1 move: update agent
    //         // let boardHash = this.getHash();
    //         // this.p1.addState(boardHash);
    //         this.showBoard()
    //         // check for winner
    //         if(this.winner()!=null){
    //             this.giveReward();
    //             this.reset();
    //             break;
    //         }
    //         else{
    //             // human takes turn
    //             let prompt = require("prompt-sync")({ sigint: true });
    //             let index = prompt("Which square would you like to play? (0-8) ");
    //             this.updateState(index, this.p2);
    //             // check for winner
    //             if(this.winner()!=null){
    //                 this.giveReward();
    //                 this.reset();
    //                 break;
    //             }
    //         }
    //     }
    // }

    // player 2 moves first
    test(){
        this.gameActive=true;
        this.p1.loadqTable('test_2.json');
        this.showBoard()
        while(this.gameActive){
            // human takes turn
            let prompt = require("prompt-sync")({ sigint: true });
            let index = prompt("Which square would you like to play? (0-8) ");
            this.updateState(index, this.p2);
            this.showBoard()
            // check for winner
            if(this.winner()!=null){
                this.giveReward();
                this.reset();
                break;
            }
            else{
                console.log("AI thinking...")
                let possibleActions = this.availableActions();
                let p1_action = this.p1.chooseAction(this.board, possibleActions);
                this.updateState(p1_action, this.p1);
                this.showBoard()
                // check for winner
                if(this.winner()!=null){
                    this.giveReward();
                    this.reset();
                    break;
                }
            }
        }
    }

    showBoard(){
        let token; 
        for(let i = 0; i < 9; i+=3){
            console.log('-------------');
            let out = '| ';
            for(let j = 0; j < 3; j++){
                if(this.board[i+j] == 1){
                    token = 'x';
                }
                if(this.board[i+j] == -1){
                    token = 'o';
                }
                if(this.board[i+j] == 0){
                    token = ' ';
                }
                out+=token + ' | ';
            }
            console.log(out);
        }
        console.log('-------------');
    }

    reset(){
        this.board = [0,0,0,0,0,0,0,0,0];
        this.boardHash = undefined;
        this.gameActive = false;
        this.p1.reset();
        this.p2.reset();
    }
  };

let Agent = class {

    constructor(playerNumber){
        this.playerNumber = playerNumber;
        this.states = [];
        this.learningRate = 0.5;
        //SET EXPLORATION RATE TO 0 WHEN TESTING
        this.explorationRate = 0;
        this.decayGamma = 0.9;
        this.qTable = {};
    }

    getHash(board){
        return board.toString();
    }
    
    chooseAction(board, possibleActions){
        // choose action with highest value in qTable
        let localBoard = JSON.parse(JSON.stringify(board));
        if(this.qTable[this.getHash(localBoard)] == undefined){
            this.qTable[this.getHash(localBoard)] = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        }

        if(Math.random() < this.explorationRate){
            let randomAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
            this.addState(this.getHash(localBoard), randomAction);
            return randomAction;
        }
        else{
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
                    this.addState(this.getHash(localBoard), index);
                    return index
                }
            }
        }
    }


    addState(boardHash, action){
        this.states.push([boardHash,action])
    }

    // at the end of the game, backpropogate and update states values
    feedReward(reward){
        let r = reward;
        let nextMax = -1.0
        let moveHistory = this.states.reverse()
        for(let i = 0; i < moveHistory.length; i++){
            let move = moveHistory[i];
            if(nextMax < 0){
                this.qTable[move[0]][move[1]] = r;
            }
            else{
                this.qTable[move[0]][move[1]] = this.qTable[move[0]][move[1]] * (
                    1.0 - this.learningRate) + this.learningRate * this.decayGamma * nextMax
            }
            nextMax = Math.max(...this.qTable[move[0]])
        }
    }

    reset(){
        this.states = []
    }

    loadqTable(fileName){
        let fs = require('fs');
        this.qTable = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    }
}

let p1 = new Agent(1);
let p2 = new Agent(-1);
let simulation = new Simulation(p1, p2);
simulation.test();
