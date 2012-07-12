//this is the game engine
var game = {"score":0, "level":0, "shotsLeft": 5, "shotsMade": 0, "shotsMissed":0};
var shotanimation = {"type":"missed","curved":false,"direction":"hardleft"};
var gameState = "homescreen";
var debugInfoOn = true;
var debugWriteIntervalID = 0;

//button areas
var homeScreenPlayButtonArea = {"x":220,"y":330,"width":160,"height":25};
var homeScreenHighScoresButtonArea = {"x":230,"y":368,"width":235,"height":25};
var endScreenPlayAgainButtonArea = {"x":135,"y":315,"width":165,"height":25};
var endScreenHighScoresButtonArea = {"x":140,"y":353,"width":235,"height":25};



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
  document.getElementById('timer').innerHTML = "Time: " + (Date.now() - animationStartTimeStamp);
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

function hitEndPlayAgainButton(e) {
  var canvascursorX = e.pageX - $("#gamecanvas").offset().left;
  var canvascursorY = e.pageY - $("#gamecanvas").offset().top;
  if (canvascursorX > endScreenPlayAgainButtonArea.x && canvascursorX < endScreenPlayAgainButtonArea.x + endScreenPlayAgainButtonArea.width) {
    if (canvascursorY > endScreenPlayAgainButtonArea.y && canvascursorY < endScreenPlayAgainButtonArea.y + endScreenPlayAgainButtonArea.height) {
      return true;
    }
  }
  return false;
}

function hitEndViewHighScoresButton(e) {
  var canvascursorX = e.pageX - $("#gamecanvas").offset().left;
  var canvascursorY = e.pageY - $("#gamecanvas").offset().top;
  if (canvascursorX > endScreenHighScoresButtonArea.x && canvascursorX < endScreenHighScoresButtonArea.x + endScreenHighScoresButtonArea.width) {
    if (canvascursorY > endScreenHighScoresButtonArea.y && canvascursorY < endScreenHighScoresButtonArea.y + endScreenHighScoresButtonArea.height) {
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
   
    case "endscreen":
      if (hitEndPlayAgainButton(e)) {
        newGame();
        gameState = "newgame";
      }
      else if (hitEndViewHighScoresButton(e)) {
        writeHighScores();
        gameState = "highscoresscreen";  
      } 
      break;

    case "highscoresscreen":
      drawHomeScreen();
      gameState = "homescreen"; 
      break;

    case "newgame":
      shotanimation = {"type":"missed","curved":false,"direction":"hardleft"};
      gameState = "shotanimation"; 
      break;

    case "shotanimation":
      animationStartTimeStamp = Date.now();
      if (shotanimation.type == "missed") {
        animationTimerID = setInterval(drawMissAnim, 1000 / frameRate);   
      }
      else if (shotanimation.type == "goal") {
        animationTimerID = setInterval(drawGoalAnim, 1000 / frameRate);   
      }
      gameState = "inanimation"; 
      break;
  }
}

function drawGoalAnim() {
    
}

function drawMissAnim() {
  frameCount++;
  drawGameScreen();
  drawStatusBar();
  var elapsedTime = Date.now() - animationStartTimeStamp; 
  if (elapsedTime < ballShotTimeToGoal) {
    var ballXOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var ballYOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    var ballSize = 100 - (70 * elapsedTime/ballShotTimeToGoal);
    drawBall(ballSize,ballStartingPosition.x - ballXOffset, ballStartingPosition.y - ballYOffset);
    drawGoalie(shotanimation.direction,goalieStartingPosition.x,goalieStartingPosition.y);
  }
  else if (elapsedTime > ballShotTimeToGoal && elapsedTime < totalAnimationDuration) {
    drawGoalie(shotanimation.direction,goalieStartingPosition.x,goalieStartingPosition.y);
  }
  else {
    clearInterval(animationTimerID);
    gameState = "newgame";
  }
  //keyword = keywords[Math.floor(Math.random()*keywords.length)];
  //drawStatusText("You Missed!","red");
}

function newGame() {
  drawGameScreen();
  drawGoalie("sitting",goalieStartingPosition.x,goalieStartingPosition.y);
  drawBall(100,ballStartingPosition.x,ballStartingPosition.y);
  game = {"score":0, "level":0, "shotsLeft": 5, "shotsMade": 0, "shotsMissed":0};    //reset the game
  drawStatusBar();
}

function writeGameScreen() {
  drawGameScreen();
  drawStatusBar();
}

function writeHighScores() {
  drawHighScoreScreen();
}

function writeEndScreen() {
  drawEndScreen();
}
