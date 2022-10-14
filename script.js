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
    
