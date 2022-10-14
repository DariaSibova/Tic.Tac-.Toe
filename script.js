var origBoard;
var svgWidth = 100;
var svgHeight = 99;
var winRatio = ["true", "true", "true", "false"];//change the ratio of trues and falses to change the level of skill the computer has. true = more compuer skill, false = less skill
var shouldWin;
var turnFirst = "o"; //First game x will be first
var huWins = 0;
var aiWins = 0;
var huAiTies = 0;
var gameEnded = false;
var ticTacToeDataString = localStorage.getItem("tic-tac-toe-data");
var ticTacToeData = {};
const huPlayer =
  '<svg class="x" width="' +
  svgWidth +
  '" height="' +
  svgHeight +
  '"><path class="cross" d="M 20 20 L 80 80" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100"></path><path class="cross" d="M 80 20 L 20 80" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100"></path></svg>'; //X
const aiPlayer =
  '<svg class="o" width="' +
  svgWidth +
  '" height="' +
  svgHeight +
  '"><circle class="naught" cx="50" cy="50" r="30" fill="none" stroke-width="10" stroke-dasharray="200" stroke-dashoffset="200" stroke-linecap="round"></circle></svg>'; //O
const winCombo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];
const cell = document.querySelectorAll(".cell");
ini();
startGame();

function ini() {
  if (ticTacToeDataString) {
    ticTacToeData = JSON.parse(ticTacToeDataString);
    huWins = ticTacToeData.huWins;
    aiWins = ticTacToeData.aiWins;
    huAiTies = ticTacToeData.huAiTies;

    document.getElementById("huWins").innerText = ticTacToeData.huWins;
    
    document.getElementById("huAiTies").innerText = ticTacToeData.huAiTies;
    document.getElementById("aiWins").innerText = ticTacToeData.aiWins;
  }
}

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  gameEnded = false;
  shouldWin = Math.floor(Math.random() * winRatio.length);
  turnFirst = turnFirst == "x" ? "o" : "x";
  console.log(
    "User Win Possible:",
    winRatio[shouldWin] == "true" ? false : true
  );
  console.log("First Move:", turnFirst);
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cell.length; i++) {
    cell[i].innerText = "";
    cell[i].style.removeProperty("background-color");
    cell[i].addEventListener("click", turnClick, false);
  }
  if (turnFirst === "o") {
    removeGameClick();
    if (!checkTie()) turn(bestSpot(), aiPlayer);
    addGameClick();
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] === "number") {
    turn(square.target.id, huPlayer);
    setTimeout(function () {
      if (!checkTie() && gameEnded == false) {
        turn(bestSpot(), aiPlayer);
      }
      addGameClick();
    }, 500);
    //if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squarId, _player) {
  origBoard[squarId] = _player;
  //document.getElementById(squarId).innerText = _player;
  document.getElementById(squarId).innerHTML = _player;
  removeGameClick();
  let gameWon = checkWin(origBoard, _player);
  if (gameWon) {
    gameOver(gameWon);
    gameEnded = true;
  }
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombo.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombo[gameWon.index]) {

    document.getElementById(index).style.backgroundColor =
    gameWon.player == huPlayer ? "#4CAF50" : "#f44336";
}
if (gameWon.player == huPlayer) {
  huWins++;
} else {
  aiWins++;
}
for (var i = 0; i < cell.length; i++) {
  cell[i].removeEventListener("click", turnClick, false);
}
declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
saveData();
}

function declareWinner(who) {

  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

function bestSpot() {
  //return emptySquares()[0];
  if (winRatio[shouldWin] === "true") {
    console.log("Best move");
    return minimax(origBoard, aiPlayer).index;
  } else {
    console.log("Random move");
    return emptySquares()[Math.floor(Math.random() * emptySquares().length)];
  }
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cell.length; i++) {
      cell[i].style.backgroundColor = "#2980b9";
      cell[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Draw!");
    huAiTies++;
    return true;
  }
  return false;
}

function removeGameClick() {
  for (var i = 0; i < cell.length; i++) {
    cell[i].removeEventListener("click", turnClick, false);
  }
}

function addGameClick() {
  for (var i = 0; i < cell.length; i++) {
    cell[i].addEventListener("click", turnClick, false);
  }
}

function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function onResize() {
  var SW = window.innerWidth;
  var td = document.querySelectorAll("td");
  svgWidth = SW - 20;
  svgHeight = SW - 21;
  var boxSize;
  if (isMobile()) {
    boxSize = SW / 3.5 + "px";
  } else if (isTablet()) {
    boxSize = SW / 5 + "px";
  } else {
    boxSize = SW / 8 + "px";
  }
  for (var i = 0; i < td.length; i++) {
    td[i].style.width = boxSize;
    td[i].style.height = boxSize;
  }
}

function saveData() {
  document.getElementById("huWins").innerText = huWins;
  document.getElementById("huAiTies").innerText = huAiTies;
  document.getElementById("aiWins").innerText = aiWins;
  ticTacToeData.huWins = huWins;
  ticTacToeData.aiWins = aiWins;
  ticTacToeData.huAiTies = huAiTies;
  localStorage.setItem("tic-tac-toe-data", JSON.stringify(ticTacToeData));
  console.log(
    "Data Saved",
    JSON.parse(localStorage.getItem("tic-tac-toe-data"))
  );
}

function toggleScores() {
  if (document.getElementById("scores").classList.contains("show")) {

    document.getElementById("scores").classList.remove("show");
  } else {
    document.getElementById("scores").classList.add("show");
  }
}

function isMobile() {
  if (window.innerWidth < 775) {
    return true;
  } else {
    return false;
  }
}

function isTablet() {
  if (window.innerWidth < 1024) {
    return true;
  } else {
    return false;
  }
}

window.addEventListener("resize", onResize);
onResize();