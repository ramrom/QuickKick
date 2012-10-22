//this is the game engine

//VARIABLES
var game = {"score":0, "level":1, "shotsLeft": 5, "shotsMade": 0};
var gameState = "homescreen";
var shotanimation = {"type":"miss","curved":false,"direction":"hardleft"};
var playerInfo = {"firstname":null,"lastname":null,"email":null, "score":0, "agree_to_terms":false};

var highScores = new Array();
for (var i=0;i<15;i++) {
  highScores[i] = {"name":"JDoe","score":10};
}

var slider={"speed":8,"precision":60};
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
        removeUserInputFields();
        newGame();
        gameState = "newgame";
      }
      else if (hitHomeViewHighScoresButton(e)) {
        writeHighScores();
	removeUserInputFields();
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

    case "inputsliders":
      if (currentSliderX == true) {
   	calculateSliderPosition("x");
        currentSliderX = false;
      }
      else {
   	calculateSliderPosition("y");
        clearInterval(animationTimerID);
        processScoreAfterShot();
        if (gameState != "endscreen") {
          animationTimerID2 = setTimeout(drawKickAnimation,sliderToAnimDelay);
          gameState = "sliderToKickAnimDelay";
        }
      }
      break;

    case "inanimation":
      clearInterval(animationTimerID);
      if (game.shotsLeft == 5) {
        checkNewLevel();
      }
      else {
        newTurn();      
      }
      break;

    case "sliderToKickAnimDelay":
      clearInterval(animationTimerID2);
      drawKickAnimation();
      break; 

    case "newlevel":
      clearInterval(animationTimerID2);
      newTurn();
      break;
  }
}

function drawGoalAnim() {
  frameCount++;
  drawGameScreen();
  drawStatusBar();
  var elapsedTime = Date.now() - animationStartTimeStamp; 
  var ballSize = 100 - (75 * elapsedTime/ballShotTimeToGoal);
   if (elapsedTime < 3*ballShotTimeToGoal/4) {
    drawGoalie("sitting",goalieStartingPosition.x, goalieStartingPosition.y);
    var ballXOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var ballYOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    drawBall(ballSize,ballStartingPosition.x - ballXOffset, ballStartingPosition.y - ballYOffset);
  }
  else if (elapsedTime < ballShotTimeToGoal) {
    
    var goalieXOffset = ((elapsedTime - 3*ballShotTimeToGoal/4) / ballShotTimeToGoal) * (goalieStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var goalieYOffset = ((elapsedTime - 3*ballShotTimeToGoal/4) / ballShotTimeToGoal) * (goalieStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    drawGoalie(shotanimation.direction,goalieStartingPosition.x - goalieXOffset, goalieStartingPosition.y - goalieYOffset);
    var ballXOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var ballYOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    drawBall(ballSize,ballStartingPosition.x - ballXOffset, ballStartingPosition.y - ballYOffset);
  }
  else if (elapsedTime < (ballShotTimeToGoal + ballTimeToDrop)) {
    var goalieXOffset = ((ballShotTimeToGoal/4) / ballShotTimeToGoal) * (goalieStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var goalieYOffset = ((ballShotTimeToGoal/4) / ballShotTimeToGoal) * (goalieStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    drawBall(25, goalieEndingPositions[shotanimation.direction].x, goalieEndingPositions[shotanimation.direction].y + 40 * (elapsedTime - ballShotTimeToGoal)/(totalAnimationDuration - ballShotTimeToGoal));
    drawGoalie("up", goalieStartingPosition.x - goalieXOffset, goalieStartingPosition.y - goalieYOffset + 30 * (elapsedTime - ballShotTimeToGoal)/(totalAnimationDuration - ballShotTimeToGoal));
  }
  else if (elapsedTime < totalAnimationDuration) {
    var goalieXOffset = ((ballShotTimeToGoal/4) / ballShotTimeToGoal) * (goalieStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var goalieYOffset = ((ballShotTimeToGoal/4) / ballShotTimeToGoal) * (goalieStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    drawBall(25, goalieEndingPositions[shotanimation.direction].x, goalieEndingPositions[shotanimation.direction].y + 40, false);
    drawGoalie("sitting", goalieStartingPosition.x - goalieXOffset, goalieStartingPosition.y - goalieYOffset + 30);
    drawStatusText("GOAL!","green");
  }
  else {
    clearInterval(animationTimerID);
    checkNewLevel();
  }
  //keyword = keywords[Math.floor(Math.random()*keywords.length)];
}

function drawMissAnim() {
  frameCount++;
  drawGameScreen();
  drawStatusBar();
  var elapsedTime = Date.now() - animationStartTimeStamp; 
  var ballSize = 100 - (75 * elapsedTime/ballShotTimeToGoal);
  if (elapsedTime < ballShotTimeToGoal/3) {
    drawGoalie("sitting",goalieStartingPosition.x, goalieStartingPosition.y);
    var ballXOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var ballYOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    drawBall(ballSize,ballStartingPosition.x - ballXOffset, ballStartingPosition.y - ballYOffset);
  }
  else if (elapsedTime < ballShotTimeToGoal) {
    var goalieXOffset = (elapsedTime / ballShotTimeToGoal) * (goalieStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var goalieYOffset = (elapsedTime / ballShotTimeToGoal) * (goalieStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    drawGoalie(shotanimation.direction,goalieStartingPosition.x - goalieXOffset, goalieStartingPosition.y - goalieYOffset);
    var ballXOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.x - goalieEndingPositions[shotanimation.direction].x); 
    var ballYOffset = (elapsedTime / ballShotTimeToGoal) * (ballStartingPosition.y - goalieEndingPositions[shotanimation.direction].y); 
    drawBall(ballSize,ballStartingPosition.x - ballXOffset, ballStartingPosition.y - ballYOffset);
  }
  else if (elapsedTime < (ballShotTimeToGoal + ballTimeToDrop)) {
    drawGoalie("up",goalieEndingPositions[shotanimation.direction].x,goalieEndingPositions[shotanimation.direction].y + 50 * (elapsedTime - ballShotTimeToGoal)/(totalAnimationDuration - ballShotTimeToGoal));
    drawBall(25, goalieEndingPositions[shotanimation.direction].x, goalieEndingPositions[shotanimation.direction].y + 70 * (elapsedTime - ballShotTimeToGoal)/(totalAnimationDuration - ballShotTimeToGoal));
  }
  else if (elapsedTime < totalAnimationDuration) {
    drawGoalie("sitting",goalieEndingPositions[shotanimation.direction].x,goalieEndingPositions[shotanimation.direction].y + 50);
    drawBall(25, goalieEndingPositions[shotanimation.direction].x, goalieEndingPositions[shotanimation.direction].y + 70, false);
    drawStatusText("You Missed!","red");
  }
  else {
    clearInterval(animationTimerID);
    checkNewLevel();
  }
}

function drawSliderAnim() {
  frameCount++;
  drawGameScreen();
  drawSliderBars();
  drawStatusBar();
  drawGameInstruction();
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

function drawKickAnimation() {
  var randomPosition = positionKeyWords[Math.floor(Math.random() * positionKeyWords.length)]; 
  shotanimation.direction = randomPosition;
  animationStartTimeStamp = Date.now();
  if (shotanimation.type == "miss") {
    animationTimerID = setInterval(drawMissAnim, 1000 / frameRate);   
    missSnd.play();
  }
  else if (shotanimation.type == "goal") {
    animationTimerID = setInterval(drawGoalAnim, 1000 / frameRate);   
    cheerSnd.play();
  }
  gameState = "inanimation"; 
}

function newGame() {
  gameIntroSnd.pause();
  drawGameScreen();
  drawGoalie("sitting",goalieStartingPosition.x,goalieStartingPosition.y);
  drawBall(100,ballStartingPosition.x,ballStartingPosition.y);
  drawStatusText("Click to Start!","blue");
  game = {"score":0, "level":1, "shotsLeft": 5, "shotsMade": 0};    //reset the game
  slider={"speed":8,"precision":60};
  drawStatusBar();
}

function checkNewLevel()
{
  if (game.shotsLeft == 5) {
    writeGameScreen();
    drawStatusText("You advanced to Level " + game.level + "!",'green',250,250,35,'sans-serif'); 
    animationTimerID2 = setTimeout(newTurn,sliderToAnimDelay*2);
    gameState = "newlevel";  
  }
  else {
    newTurn();
  }
}

function calculateSliderPosition(axis) {
  sliderClickPosition[axis] =  (slider.speed / 20) * (Date.now() - animationStartTimeStamp) % 800;
  if (sliderClickPosition[axis] > 400) {
    sliderClickPosition[axis] = 800 - sliderClickPosition[axis];
  }
}

function didSlidersHit() {
  if (Math.abs(200 - sliderClickPosition.x) < slider.precision && Math.abs(200 - sliderClickPosition.y) < slider.precision) {
    return true;
  } 
  return false;
}

function calculateScore() {
  //the closer the timing was to the center the higher the score
  xdiff = Math.abs(200 - sliderClickPosition.x);
  ydiff = Math.abs(200 - sliderClickPosition.y);
  var scoreScalar = Math.sqrt(Math.abs((slider.precision - xdiff) * (slider.precision - ydiff) / (slider.precision * slider.precision)));
  var score = 0;
  if (game.level < 3) {
    score = 100;
  }
  else if (game.level < 5) {
    score = 200;
  }
  else if (game.level < 7) {
    score = 300;
  }
  else if (game.level < 9) {
    score = 500;
  }
  else if (game.level < 12) {
    score = 800;
  }
  else {
    score = 1600;
  }
  return Math.floor(score * scoreScalar);
}

function processScoreAfterShot() {
  game.shotsLeft--;
  if (didSlidersHit()) {
    game.shotsMade++;
    game.score=game.score + calculateScore();
    shotanimation.type = "goal";
  }
  else {
    shotanimation.type = "miss";
  }
  if (game.shotsLeft == 0) {
    if (game.shotsMade > 2) {
      game.level++;
      game.shotsMade = 0;
      game.shotsLeft = 5;
      if (game.level % 2 == 0) {
        slider.speed++;
      }
      else {
        slider.precision--;
      }
    }
    else {
      playerInfo.score = game.score;
      writeEndScreen();
      if (playerInfo.score > highScores[14].score) {
        drawStatusText("CONGRATULATIONS!","red",250,40,40); 
        drawStatusText("You have achieved a new high score!","red",250,65,25); 
      }
      drawStatusText("Score: " + game.score,"blue",250,100,30); 
      gameIntroSnd.currentTime=0;
      gameIntroSnd.play();
      gameState = "endscreen";
      sendUserInfo(); 
    }
  }
}

function newTurn() {
  cheerSnd.pause();
  cheerSnd.currentTime=0;
  missSnd.pause();
  missSnd.currentTime=0;
  drawSliderBars();
  gameState = "inputsliders";
  currentSliderX = true;
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
