//this is the game engine
var game = {"score":0, "level":0, "shotsLeft": 5, "shotsMade": 0, "shotsMissed":0};
var gameState = "homescreen";
var debugInfoOn = true;
var debugWriteIntervalID = 0;

//button areas
var homeScreenPlayButtonArea = {"x":220,"y":330,"width":160,"height":25};
var homeScreenHighScoresButtonArea = {"x":230,"y":368,"width":235,"height":25};

// DEBUGGING FUNCTIONS
function toggleDebugInfo() {
  if (debugInfoOn == false) {
    $("#debuginfo").show();
    debugInfoOn = true;
    debugWriteIntervalID = setInterval(writeDebugInfo, 1000/frameRate);
  }
  else {
    $("#debuginfo").hide();
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

function writeMousePosition(e) {
  //$("#browsercursorX").attr("value", (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft));
  $("#browsercursorX").attr("value",e.pageX);
  $("#browsercursorY").attr("value",e.pageY);
  $("#canvascursorX").attr("value",e.pageX - $("#gamecanvas").offset().left);
  $("#canvascursorY").attr("value",e.pageY - $("#gamecanvas").offset().top);
}

// Input Handler

function hitHomePlayButton(e) {
  var canvascursorX = e.pageX - $("#gamecanvas").offset().left;
  var canvascursorY = e.pageY - $("#gamecanvas").offset().top;
  if (canvascursorX > homeScreenPlayButtonArea.x && canvascursorX < homeScreenPlayButtonArea.x + homeScreenPlayButtonArea.width) {
    if (canvascursorY > homeScreenPlayButtonArea.y && canvascursorY < homeScreenPlayButtonArea.y + homeScreenPlayButtonArea.height) {
      return true;
    }
  }
  return false;
}

function hitHomeViewHighScoresButton(e) {
  var canvascursorX = e.pageX - $("#gamecanvas").offset().left;
  var canvascursorY = e.pageY - $("#gamecanvas").offset().top;
  if (canvascursorX > homeScreenHighScoresButtonArea.x && canvascursorX < homeScreenHighScoresButtonArea.x + homeScreenHighScoresButtonArea.width) {
    if (canvascursorY > homeScreenHighScoresButtonArea.y && canvascursorY < homeScreenHighScoresButtonArea.y + homeScreenHighScoresButtonArea.height) {
      return true;
    }
  }
  return false;
}

function canvasMouseClickHandler(e) {
 
  switch(gameState) {
    case "homescreen":
      if (hitHomePlayButton(e)) {
        newGame();
        gameState = "newgame";
      }
      else if (hitHomeViewHighScoresButton(e)) {
        writeHighScores();
        gameState = "highscoresscreen";  
      } 
      break;
   
    case "newgame":
        
      gameState = "newshotX"; 
      break;

    case "endscreen":
      writeEndScreen();
      break;

    case "highscoresscreen":
      drawHomeScreen();
      gameState = "homescreen"; 
      break;
  }
}

// Game Screens 

function newGame() {
  drawGameScreen();
  drawGoalie("sitting",goalieStartingPosition.x,goalieStartingPosition.y);
  drawBall(0,ballStartingPosition.x,ballStartingPosition.y);
  game = {"score":0, "level":0, "shotsLeft": 5, "shotsMade": 0, "shotsMissed":0};    //reset the game
  drawStatusBar();
  //add play button and goto high scores screen  
}

function writeGameScreen() {
  drawGameScreen();
  drawStatusBar();
  //add button to start over
}

function writeHighScores() {
  drawHighScoreScreen();
  //add button to go back to home screen
}

