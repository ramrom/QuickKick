//this is the game engine
var game = {"score":0, "level":0, "shotsLeft": 5, "shotsMade": 0, "shotsMissed":0};
var gameState = "homescreen";
var shotanimation = {"type":"missed","curved":false,"direction":"hardleft"};

var slider={"speed":10,"precision":60};
var currentSliderX = true;
var sliderClickPosition={"x":0,"y":0};

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
      gameState = "inputsliders"; 
      newTurn();
      break;

    case "shotanimation":
      var randomPosition = positionKeyWords[Math.floor(Math.random() * positionKeyWords.length)]; 
      shotanimation = {"type":"missed","curved":false,"direction":randomPosition};
      animationStartTimeStamp = Date.now();
      if (shotanimation.type == "missed") {
        animationTimerID = setInterval(drawMissAnim, 1000 / frameRate);   
      }
      else if (shotanimation.type == "goal") {
        animationTimerID = setInterval(drawGoalAnim, 1000 / frameRate);   
      }
      gameState = "inanimation"; 
      break;
   
    case "inputsliders":
      if (currentSliderX == true) {
   	calculateSliderPosition("x");
        currentSliderX = false;
      }
      else {
   	calculateSliderPosition("y");
        clearInterval(animationTimerID);
        gameState = "shotanimation";
      }
      //(currentSliderX == true) ? currentSliderX=false : gameState = "shotanimation"; clearInterval(animationTimerID);
      break;

    case "newlevel":
      currentSliderX=true;
      gameState = "shotanimation";
      clearInterval(animationTimerID);
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
    drawGoalie(shotanimation.direction,goalieStartingPosition.x,goalieStartingPosition.y);
    var ballXOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var ballYOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    var ballSize = 100 - (75 * elapsedTime/ballShotTimeToGoal);
    drawBall(ballSize,ballStartingPosition.x - ballXOffset, ballStartingPosition.y - ballYOffset);
  }
  else if (elapsedTime > ballShotTimeToGoal && elapsedTime < totalAnimationDuration) {
    drawGoalie(shotanimation.direction,goalieStartingPosition.x,goalieStartingPosition.y);
  }
  else {
    clearInterval(animationTimerID);
    drawSliderBars();
    gameState = "inputsliders";
    processGameState();
  }
  //keyword = keywords[Math.floor(Math.random()*keywords.length)];
  //drawStatusText("You Missed!","red");
}

function drawSliderAnim() {
  frameCount++;
  drawGameScreen();
  drawStatusBar();
  drawSliderBars();
  $("#sliderX").attr("value",sliderClickPosition.x);
  $("#sliderY").attr("value",sliderClickPosition.y);
  if (currentSliderX == true) { 
    calculateSliderPosition("x");
    drawBall(40, sliderClickPosition.x + 50, 250 );
  }
  else {
    calculateSliderPosition("y");
    drawBall(40, sliderClickPosition.x + 50, 250 );
    drawBall(40, 250, 50 + sliderClickPosition.y);
  }
}

function newGame() {
  drawGameScreen();
  drawGoalie("sitting",goalieStartingPosition.x,goalieStartingPosition.y);
  drawBall(100,ballStartingPosition.x,ballStartingPosition.y);
  drawStatusText("Click to Start!","blue");
  game = {"score":0, "level":0, "shotsLeft": 5, "shotsMade": 0, "shotsMissed":0};    //reset the game
  drawStatusBar();
}

function calculateSliderPosition(axis) {
  sliderClickPosition[axis] =  (slider.speed / 20) * (Date.now() - animationStartTimeStamp) % 800;
  if (sliderClickPosition[axis] > 400) {
    sliderClickPosition[axis] = 800 - sliderClickPosition[axis];
  }
}

function slidersHit() {
  if (Math.abs(200 - sliderClickPosition.x) < slider.precision && Math.abs(200 - sliderClickPosition.y) < slider.precision) {
    return true;
  } 
  return false;
}

function processGameState() {
  if (slidersHit()) {
  }
  newTurn();
}

function newTurn() {
  currentSliderX = true;
  shotanimation = {"type":"missed","curved":false,"direction":"hardleft"};
  sliderClickPosition = {"x":0,"y":0};
  animationStartTimeStamp = Date.now();
  animationTimerID = setInterval(drawSliderAnim, 1000 / frameRate);   
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
