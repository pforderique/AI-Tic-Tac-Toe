/*
  TIC TAC TOE w MINIMAX
  
  @author Piero Orderique
  @date 30 July 2021
*/

var grid = [
  ['','',''],
  ['','',''],
  ['','',''],
];

const players = {
	HUMAN_PLAYER: 0,
  COMPUTER_PLAYER: 1,
}
let currentPlayer;
let winningPlayer;
let winningLineCoors = [];

let game_won;
let computers_first_time = true; // to speed up game in starting states

// STATES
const states = {
	WELCOME_SCREEN: 0,
	HUMAN_TURN: 1,
	COMPUTER_TURN: 2,
	END_SCREEN: 3,
}
let game_state = states.WELCOME_SCREEN;

// consts
let BLINKER_SPEED = 700; // ms
let MINIMUM_COMPUTER_SPEED = 500; // ms
let SPACEBAR_CODE = 32;
let BOARD_WIDTH = 400
let BOARD_HEIGHT = 400;
let EDGE_HEIGHT = 100;

// globals
let wins_count = 0;
let losses_count = 0;
let showSpace = false;
let LIGHT_YELLOW;
let BLUE_GRAY;
let BLUE_GREEN;
let timer;

function setup() {
  createCanvas(BOARD_WIDTH, BOARD_HEIGHT + 2*EDGE_HEIGHT);
  currentPlayer = int(random(0, 2)); // select random player
  console.log("WELCOME TO TIC TAC TOE w/Minimax");

  LIGHT_YELLOW = color('#FEFEE3');
  BLUE_GRAY = color('#1A5E63');
  BLUE_GREEN = color('#00BFB2');

  fill(LIGHT_YELLOW);

  timer = millis();
}

function draw() {
  background(BLUE_GRAY);
  ticTacToe();
}

// =============== Main game fsm ===============
function ticTacToe() {
  switch (game_state) {
    case states.WELCOME_SCREEN:
      showWelcomeScreen();
      // wait for spacebar/click (logic in KeyPressed/MouseClicked Functions)
      break;

    case states.HUMAN_TURN:
      showGame();
      // wait for mouse click (logic in MouseClicked Function)
      // then check if won
      break;

    case states.COMPUTER_TURN:
      showGame();

      // so that computer is not "lightning fast" and to simulate 
      // that its actually "thinking", we add a delay here
      if (millis() - timer > MINIMUM_COMPUTER_SPEED) {

        // try and save some time if its first move -- just go random
        if (computers_first_time) {
          let available_moves = [];
          for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
              if (grid[row][col] == '') {
                available_moves.push({row, col});
              }
            }
          }
          let move = random(available_moves);
          grid[move.row][move.col] = "O";
          computers_first_time = false;
        } else {
          calculateBestMove(); // calculates and places its move
        }
        // check if computer won game
        game_won = gameWon(true);

        // If game is finished
        if (game_won !== null) {
          if(game_won == 'tie'){
            winningPlayer = null;
            game_state = states.END_SCREEN;
          // else if computer just won
          } else if (game_won == 'computer'){
            winningPlayer = players.COMPUTER_PLAYER;
            losses_count += 1;
            game_state = states.END_SCREEN;
          }
        // else go on to humans's turn
        } else {
          game_state = states.HUMAN_TURN;
          currentPlayer = players.HUMAN_PLAYER;
        }

        timer = 0;
      }
      break;

    case states.END_SCREEN:
      showEndScreen();
      break;
  
    default:
      break;
  }
}

// =============== Display functions ===============
function showWelcomeScreen() {
  textAlign(CENTER);

  textSize((7/100)*BOARD_WIDTH);
  text("Welcome to Tic Tac Toe!", BOARD_WIDTH/2, EDGE_HEIGHT*2.5);

  if(millis() - timer > BLINKER_SPEED) { 
    showSpace = !showSpace;
    timer = millis(); 
  }
  if(showSpace) {
    textSize((3/100)*BOARD_WIDTH);
    text("Press SPACEBAR to Start", BOARD_WIDTH/2, (15/20)*BOARD_HEIGHT);
  }

  textAlign(LEFT);
  textSize((4/100)*BOARD_WIDTH);
  text("Created by: Piero Orderique", BOARD_WIDTH/2.4, height - EDGE_HEIGHT/3);
}

function showGame() {
  stroke(BLUE_GRAY);
  textAlign(CENTER) 
  textStyle(NORMAL); 

  // show current player:
  textSize((7/100)*BOARD_WIDTH);
  let player_text = "Current Player: "
  if (currentPlayer == players.HUMAN_PLAYER) {
    player_text += "Human"
  } else {
    player_text += "Computer"
  }
  text(player_text, BOARD_WIDTH/2,  EDGE_HEIGHT/1.5);  
  
  showGrid();
  
  stroke(BLUE_GRAY);
  textAlign(RIGHT);
  textStyle(NORMAL); 
  // show wins_count:
  textSize((5/100)*BOARD_WIDTH);
  text("Wins : " + wins_count, BOARD_WIDTH/4.5, height - EDGE_HEIGHT/1.3);
  // show losses_count: 
  textSize((5/100)*BOARD_WIDTH);
  text("Losses : " + losses_count, BOARD_WIDTH/3.7, height - EDGE_HEIGHT/2.5);
}

function showEndScreen() {
  // show current player:
  textAlign(CENTER)  
  textStyle(NORMAL);
  textSize((7/100)*BOARD_WIDTH);
  if (winningPlayer == null) {
    text("It's a tie!", BOARD_WIDTH/2,  EDGE_HEIGHT/1.5);  
  } else if (winningPlayer == players.HUMAN_PLAYER) {
    text("You won!", BOARD_WIDTH/2,  EDGE_HEIGHT/1.5);  
  } else {
    text("Computer won!", BOARD_WIDTH/2,  EDGE_HEIGHT/1.5);  
  }
  
  showGrid();

  // "strike-out" the 3-in-a-row win
  stroke(BLUE_GREEN);
  strokeWeight(8);
  let [x1, y1] = gridToCoor(winningLineCoors[0], winningLineCoors[1]);
  let [x2, y2] = gridToCoor(winningLineCoors[2], winningLineCoors[3]);
  line(x1, y1, x2, y2);
  stroke(BLUE_GRAY);
  strokeWeight(1);

  textAlign(RIGHT);
  textStyle(NORMAL);
  
  // show wins_count:
  textSize((5/100)*BOARD_WIDTH);
  text("Wins : " + wins_count, BOARD_WIDTH/4.5, height - EDGE_HEIGHT/1.3);
  // show losses_count:
  textSize((5/100)*BOARD_WIDTH);
  text("Losses : " + losses_count, BOARD_WIDTH/3.8, height - EDGE_HEIGHT/2.5);
  
  if(millis() - timer > BLINKER_SPEED) { 
    showSpace = !showSpace;
    timer = millis(); 
  }
  if(showSpace) {
    textAlign(CENTER);
    textSize((3/100)*BOARD_WIDTH);
    text("Press SPACEBAR to restart", BOARD_WIDTH/2, height - EDGE_HEIGHT/4);
  }
}

function showGrid() {
  // show gridlines
  strokeWeight(1);
  stroke(LIGHT_YELLOW);
  for(i = 1; i < grid.length; i++){
    let x = i*BOARD_WIDTH/grid[0].length 
    line(x, EDGE_HEIGHT + 10, x, EDGE_HEIGHT + BOARD_HEIGHT - 10)
  }
  for(i = 1; i < grid.length; i++){
    let y = i*(BOARD_HEIGHT)/grid[0].length 
    line(0, y + EDGE_HEIGHT, BOARD_WIDTH, y + EDGE_HEIGHT)
  }
  
  // iterate through grid and print contents
  textSize(BOARD_WIDTH/7)
  textStyle(NORMAL)
  textAlign(CENTER)
  for(row = 0; row < grid.length; row++){
    for(col = 0; col < grid[0].length; col++){
      // stagger the coordinates
      let x = int(width*col/grid.length) + width/(2*grid.length)
      let y = int(BOARD_HEIGHT*row/grid[0].length) + height/(2*grid[0].length) + EDGE_HEIGHT - BOARD_HEIGHT/30
      // show the text now
      text(grid[row][col], x, y);
    }
  }
}

// =============== Logic functions ===============
function calculateBestMove() {
  let bestScore = -Infinity;
  let bestMove;
  let score;

  // get all possible moves
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      // if the spot is available, run minimax and get score
      if (grid[row][col] == '') {
        grid[row][col] = 'O';
        score = minimax(1, false);
        grid[row][col] = ''; // undo the move 
        if (score > bestScore) {
          bestScore = score;
          bestMove = [row, col];
        }
      }
    }
  }
  grid[bestMove[0]][bestMove[1]] = 'O';
  console.log("Computer placed move");
}

function minimax(depth, maximizing) {
  // O win: +1 , X win: -1, tie: 0
  // console.log("minimax called. depth: " + depth + " maximizing: " + maximizing + " board: " + grid);

  // check if a player has won (leaf node)
  game_won = gameWon(false);
  if (game_won == 'tie') {
    return 0;
  } else if (game_won == "computer") {
    return 10;
  } else if (game_won == "human") {
    return -10;
  }

  let best_score;
  let round_score;

  // if MAXIMIZING
  if (maximizing) {
    best_score = -Infinity;
    // get all possible moves
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        // if the spot is available, run minimax and get score
        if (grid[row][col] == '') {
          grid[row][col] = 'O';
          round_score = minimax(depth + 1, false);
          grid[row][col] = ''; // undo the move 
          best_score = max(best_score, round_score);
        }
      }
    }
  // MINIMIZING player
  } else {
    // get all possible moves
    best_score = Infinity;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        // if the spot is available, run minimax and get score
        if (grid[row][col] == '') {
          grid[row][col] = 'X';
          round_score = minimax(depth + 1, true);
          grid[row][col] = ''; // undo the move 
          best_score = min(best_score, round_score);
        }
      }
    }
  }
  return best_score;
}

function gameWon(recordWinningCoors){  //* Returns {null, 'tie', 'human', or 'computer'}
  // check rows
  for(let row = 0; row < grid.length; row++){
    let xsum = 0
    let osum = 0
    for(let col = 0; col < grid[0].length; col++){
      if(grid[row][col] == "X"){xsum += 1}
      if(grid[row][col] == "O"){osum += 1}
    }
    if (xsum == 3 || osum == 3) {
      if (recordWinningCoors) { 
        winningLineCoors.push(row, 0, row, grid[0].length - 1); 
        console.log("game won. winning line: " + winningLineCoors);
      }
      if(xsum == 3){return "human"}
      if(osum == 3){return "computer"}
    }
  }
  
  // check columns
  for(let col = 0; col < grid[0].length; col++){
    let xsum = 0
    let osum = 0
    for(let row = 0; row < grid.length; row++){
      if(grid[row][col] == "X"){xsum += 1}
      if(grid[row][col] == "O"){osum += 1}
    }
    if (xsum == 3 || osum == 3) {
      if (recordWinningCoors) { 
        winningLineCoors.push(0, col, grid.length - 1, col); 
        console.log("game won. winning line: " + winningLineCoors);
      }
      if(xsum == 3){return "human"}
      if(osum == 3){return "computer"}
    }
  }
  
  // check diagonals
  let x1sum = 0
  let o1sum = 0
  let x2sum = 0
  let o2sum = 0
  for(let i = 0; i < grid.length; i++){
    if(grid[i][i] == "X"){x1sum += 1}
    if(grid[i][i] == "O"){o1sum += 1}
    if(grid[i][grid.length - 1 - i] == "X"){x2sum += 1}
    if(grid[i][grid.length - 1 - i] == "O"){o2sum += 1}
  }
  if (x1sum == 3 || o1sum == 3) {
    if (recordWinningCoors) { 
      winningLineCoors.push(0, 0, grid.length - 1, grid[0].length - 1); 
      console.log("game won. winning line: " + winningLineCoors);
    }
    if(x1sum == 3){return "human"}
    if(o1sum == 3){return "computer"}
  }
  if (x2sum == 3 || o2sum == 3) {
    if (recordWinningCoors) { 
      winningLineCoors.push(grid.length - 1, 0, 0, grid[0].length - 1); 
      console.log("game won. winning line: " + winningLineCoors);
    }
    if(x2sum == 3){return "human"}
    if(o2sum == 3){return "computer"}
  }
  
  // if still no return, check to see if board is full
  let nullcount = 0
  for(let row = 0; row < grid.length; row++){
    for(let col = 0; col < grid[0].length; col++){
      if(grid[row][col] == ''){nullcount += 1}
    }
  }
  if(nullcount == 0){return 'tie'}
  
  return null;
}

function gridToCoor(row, col) {
  let x = (BOARD_WIDTH/grid[0].length)/2 + col*(BOARD_WIDTH/grid[0].length);
  let y = EDGE_HEIGHT + (BOARD_HEIGHT/grid.length)/2 + row*(BOARD_HEIGHT/grid.length);
  return [x, y]
}

function resetGame(){
  // reset grid
  for(let row = 0; row < grid.length; row++){
    for(let col = 0; col < grid[0].length; col++){
      grid[row][col] = ''
    }
  }

  // select random player
  currentPlayer = int(random(0, 2)); 

  // clear the buffers
  winningLineCoors.length = 0;
  computers_first_time = true;
}

function mouseClicked(){
  switch (game_state) {
    // for mobile devices without keyboard, a click will suffice
    case states.WELCOME_SCREEN:
      if (currentPlayer == players.HUMAN_PLAYER) {
        game_state = states.HUMAN_TURN
      } else {
        game_state = states.COMPUTER_TURN
        timer = millis(); // to control computer turn's
      }
      break;

    // place human move there
    case states.HUMAN_TURN:
      // map where player clicks to an index in the grid
      let row = int(map(mouseY, EDGE_HEIGHT, EDGE_HEIGHT + BOARD_HEIGHT, 0, grid[0].length))
      let col = int(map(mouseX, 0, BOARD_WIDTH, 0, grid.length))

      // place player's symbol there IF empty and update current player
      if(grid[row][col] !== ''){
        console.log("INVALID MOVE");
        break;
      } else {
        grid[row][col] = 'X';
      }

      game_won = gameWon(true);
      if (game_won !== null){
        if (game_won == 'tie') {
          winningPlayer = null;
          game_state = states.END_SCREEN;
        } else if (game_won == "human") {
          winningPlayer = players.HUMAN_PLAYER;
          wins_count += 1;
          game_state = states.END_SCREEN;
        }

      // else game continues to computer
      } else {
        game_state = states.COMPUTER_TURN;
        currentPlayer = players.COMPUTER_PLAYER;
        timer = millis() // for controlling computer turn's speed
      }
      break;

    case states.COMPUTER_TURN:
      break;

    // for mobile devices without keyboard, a click will suffice
    case states.END_SCREEN:
      resetGame();
      if (currentPlayer == players.HUMAN_PLAYER) {
        game_state = states.HUMAN_TURN
      } else {
        game_state = states.COMPUTER_TURN
        timer = millis(); // to control computer turn's
      }
      break;

    default:
      break;
  }
}

function keyPressed(){
  switch (game_state) {
    case states.WELCOME_SCREEN:
      if (keyCode == SPACEBAR_CODE) {
        if (currentPlayer == players.HUMAN_PLAYER) {
          game_state = states.HUMAN_TURN
        } else {
          game_state = states.COMPUTER_TURN
        }
      }
      break;

    case states.END_SCREEN:
      if (keyCode == SPACEBAR_CODE) {
        resetGame();
        showGame();
        if (currentPlayer == players.HUMAN_PLAYER) {
          game_state = states.HUMAN_TURN
        } else {
          game_state = states.COMPUTER_TURN
        }
      }
      break;
  
    default:
      break;
  }
}