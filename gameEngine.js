//this is the game engine
var game = {"score":0, "level":0, "shotsLeft": 5, "shotsMade": 0, "shotsMissed":0};
var gameState = "init";
var debugInfoOn = false;
var debugWriteIntervalID = 0;


// DEBUGGING FUNCTIONS
function toggleDebugInfo() {
  if (debugInfoOn == false) {
    debugInfoOn = true;
    debugWriteIntervalID = setInterval(writeDebugInfo, 1000/frameRate);
  }
  else {
    debugInfoOn = false;
    clearInterval(debugWriteIntervalID);
  }
}
  
function writeDebugInfo() {
  document.getElementById('framecounter').innerHTML = "Frame Count: " + frameCount;
  document.getElementById('timer').innerHTML = "Time: " + (Date.now() - animationTimeStamp);
  document.getElementById('framerate').innerHTML = "Frame Rate: " + frameRate;
  document.getElementById('gamestate').innerHTML = "Game State: " + gameState;
}


// Game Screens 

function writeHomeScreen() {
  drawHomeScreen();
  //add play button and goto high scores screen  
}

function writeGameScreen() {
  drawGameScreen();
  drawStatusBar();
  //add button to start over
}

function writeHighScoresScreen() {
  drawHighScoreScreen();
  //add button to go back to home screen
}

