//**** This is the graphics engine   *******
//******************************************

//declare the image objects we need
var homeScreen = new Image();
var gameScreen = new Image();  
var endScreen = new Image();  
var highScoreScreen = new Image();
var ball = new Image();
var goalieReadyPosition = new Image();
var goalieJumpUp = new Image();
var goalieJumpHardRight = new Image();
var goalieJumpHardLeft = new Image();
var goalieJumpSoftRight = new Image();
var goalieJumpSoftLeft = new Image();

//preload the images
homeScreen.src = 'images/HomeScreen.png';  
gameScreen.src = 'images/GameScreen.png';  
endScreen.src = 'images/EndScreen.png';  
highScoreScreen.src = 'images/HighScoreScreen_02.png';  
goalieReadyPosition.src = 'images/Goalie_Sitting.png';  
goalieJumpUp.src = 'images/Goalie_JumpingUp.png';  
goalieJumpHardRight.src = 'images/Goalie_Jumping_HardRight.png';  
goalieJumpHardLeft.src = 'images/Goalie_Jumping_HardLeft.png';  
goalieJumpSoftLeft.src = 'images/Goalie_JumpingLeft.png';  
goalieJumpSoftRight.src = 'images/Goalie_JumpingRight.png';  
ball.src = 'images/Ball_01.png';  

var frameRate = 30;            //target frames per second
var kickAnimDuration = 1500;     //total length in miliseconds of kick animations
var intervalTimerID=0;
var frameCount = 1;
var animationTimeStamp = Date.now();

var ballStartingPosition = {"x":250, "y":410};
var goalieStartingPosition = {"x":250, "y":115};

function drawmain() {
  intervalTimerID = setInterval(draw, 1000 / frameRate);   
  var canv = document.getElementById('gamecanvas');  
  canv.removeEventListener('click',drawmain,false);
  canv.addEventListener('click',drawEndScreen,false);
  //setTimeout(draw, 1000);    //would call draw 1000 miliseconds later
}


function draw() {
  frameCount ++;
     
  //ctx.globalCompositeOperation = 'destination-over';  
  var ctx = document.getElementById('gamecanvas').getContext('2d');  
  ctx.clearRect(0,0,500,500); // clear canvas  
   
  ctx.drawImage(gameScreen,0,0);

  ctx.save();
  //ctx.globalAlpha = 0.5;
  ctx.translate(goalieStartingPosition['x'],goalieStartingPosition['y']);
  ctx.drawImage(goalieReadyPosition,-20,-30,40,60);  
  ctx.restore();  

  ctx.save();
  //ctx.globalAlpha = 0.5;
  ctx.translate(ballStartingPosition['x'],ballStartingPosition['y']);
  ctx.rotate(Math.PI * 2 * frameCount / frameRate);
  ctx.drawImage(ball,-50,-50,100,100);  
  ctx.restore();  

  drawStatusBar();

  ctx.font = "bold 25px sans-serif";
  ctx.fillText("You Missed!",200,200); 
  /*if (frameCount == 60) {
    clearInterval(intervalTimerID);
  } */
}  

function drawGoalie(posture,Xpos,Ypos) {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.save();
  //ctx.globalAlpha = 0.5;
  ctx.translate(Xpos,Ypos);
  switch (posture) {
    case "jumpup":
      ctx.drawImage(goalieJumpUp,-20,-30,40,60);  
      break;
    case "jumphardleft":
      ctx.drawImage(goalieJumpHardLeft,-20,-30,40,60);  
      break;
    case "jumphardright":
      ctx.drawImage(goalieJumpHardRight,-20,-30,40,60);  
      break;
    case "jumpsoftleft":
      ctx.drawImage(goalieJumpSoftLeft,-20,-30,40,60);  
      break;
    case "jumpsoftright":
      ctx.drawImage(goalieJumpSoftRight,-20,-30,40,60);  
      break;
    default:
      ctx.drawImage(goalieReadyPosition,-20,-30,40,60);  
      break;
  }
  ctx.restore();  
}

function drawBall(size,Xpos,Ypos) {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.save();
  //ctx.globalAlpha = 0.5;
  ctx.translate(Xpos,Ypos);
  ctx.rotate(Math.PI * 2 * frameCount / frameRate);
  ctx.drawImage(ball,-50,-50,100,100);  
  ctx.restore();  
}

function drawGameScreen() {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.drawImage(gameScreen,0,0);
}

function drawHomeScreen() {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  //canv.removeEventListener('click',drawHomeScreen,false);
  ctx.drawImage(homeScreen,0,0);
  //canv.addEventListener('click',drawmain,false);
}

function drawEndScreen() {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  clearInterval(intervalTimerID);   // will stop the function from running on interval
  //canv.removeEventListener('click',drawEndScreen,false);
  ctx.drawImage(endScreen,0,0);
  //canv.addEventListener('click',drawHomeScreen,false);
}

function drawHighScoreScreen() {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.drawImage(highScoreScreen,0,0);
}

function drawStatusBar() {
  var ctx = document.getElementById('gamecanvas').getContext('2d');  
  ctx.save();
  
  //draw black bar 
  //ctx.clearRect(0,0,500,25); // clear canvas  
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0,0,500,25);
 
  //draw the status texts
  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "blue";
  ctx.textAlign = "center";
  ctx.fillText("Score: " + game['score'],250,19); 
  ctx.textAlign = "left";
  ctx.fillText("Level: " + game['level'],5,19); 
  ctx.textAlign = "right";
  ctx.fillText("Shots Left: " + game["shotsLeft"],495,19); 

  ctx.restore();
}


