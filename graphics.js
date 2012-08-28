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
highScoreScreen.src = 'images/HighScoreScreen_01.png';  
goalieReadyPosition.src = 'images/Goalie_Sitting.png';  
goalieJumpUp.src = 'images/Goalie_JumpingUp.png';  
goalieJumpHardRight.src = 'images/Goalie_Jumping_HardRight.png';  
goalieJumpHardLeft.src = 'images/Goalie_Jumping_HardLeft.png';  
goalieJumpSoftLeft.src = 'images/Goalie_JumpingLeft.png';  
goalieJumpSoftRight.src = 'images/Goalie_JumpingRight.png';  
ball.src = 'images/Ball_01.png';  

//preload the sounds
if (navigator.appVersion.indexOf("firefox") != -1) {      //mozilla doesn't support mp3
  var cheerSnd = new Audio("sounds/cheering_crowd.ogg");
  var missSnd = new Audio("sounds/crowd_miss.ogg");
  var gameIntroSnd = new Audio("sounds/main_game_music.ogg");
  //alert("using ogg " + navigator.appVersion);
}
else {
  var cheerSnd = new Audio("sounds/cheering_crowd.mp3");
  var missSnd = new Audio("sounds/crowd_miss.mp3");
  var gameIntroSnd = new Audio("sounds/main_game_music.mp3");
}

gameIntroSnd.loop = true;

// other important variables
var frameRate = 40;            //target frames per second
var ballShotTimeToGoal = 500;
var ballTimeToDrop = ballShotTimeToGoal/4;
var shotEndDelay = 5000;
var sliderToAnimDelay = 2000;   //the amount of time to wait to draw the kick animation after both slider inputs have been received
var totalAnimationDuration = ballShotTimeToGoal + ballTimeToDrop + shotEndDelay; //total length in miliseconds of kick animations
var animationTimerID=0;
var animationTimerID2=0;
var frameCount = 1;
var animationStartTimeStamp = Date.now();

var ballStartingPosition = {"x":250, "y":410};
var goalieStartingPosition = {"x":250, "y":115};
var positionKeyWords = ["up","hardleft","hardright","softleft","softright"];
var goalieEndingPositions = {"hardleft":{"x":160,"y":90},
			     "hardright":{"x":340,"y":90},
			     "softleft":{"x":210,"y":75},
			     "softright":{"x":290,"y":75},
			     "up":{"x":250,"y":70}}


//posture is which goalie to draw, X and Y center positions of goalie
function drawGoalie(posture,Xpos,Ypos) {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.save();
  //ctx.globalAlpha = 0.5;
  ctx.translate(Xpos,Ypos);
  switch (posture) {
    case "up":
      ctx.drawImage(goalieJumpUp,-20,-30,40,60);  
      break;
    case "hardleft":
      ctx.drawImage(goalieJumpHardLeft,-30,-20,60,40);  
      break;
    case "hardright":
      ctx.drawImage(goalieJumpHardRight,-30,-20,60,40);  
      break;
    case "softleft":
      ctx.drawImage(goalieJumpSoftLeft,-20,-30,40,60);  
      break;
    case "softright":
      ctx.drawImage(goalieJumpSoftRight,-20,-30,40,60);  
      break;
    default:
      ctx.drawImage(goalieReadyPosition,-20,-30,40,60);  
      break;
  }
  ctx.restore();  
}

//size in pixels, X and Y center positions of ball
function drawBall(size,Xpos,Ypos,rotate) {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.save();
  ctx.translate(Xpos,Ypos);
  if (typeof rotate == "undefined") {
    rotate = true;
  }
  if (rotate) {
    ctx.rotate(Math.PI * 8 * frameCount / frameRate);
  }
  ctx.drawImage(ball,-size/2,-size/2, size, size);  
  ctx.restore();  
}

function drawStatusText(message,color) {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.font = "bold 35px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.fillText(message,250,250); 
}

function drawGameScreen() {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.drawImage(gameScreen,0,0);
}

function drawHomeScreen() {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.clearRect(0,0,500,500); // clear canvas  
  //canv.removeEventListener('click',drawHomeScreen,false);
  ctx.drawImage(homeScreen,0,0);
  //canv.addEventListener('click',drawmain,false);
}

function drawEndScreen() {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.drawImage(endScreen,0,0);
}

function drawHighScoreScreen() {
  var canv = document.getElementById('gamecanvas');  
  var ctx = canv.getContext('2d');  
  ctx.drawImage(highScoreScreen,0,0);
}

function drawSliderBars() {
  var ctx = document.getElementById('gamecanvas').getContext('2d');  
  ctx.save();
  ctx.fillStyle = 'rgba(256,256,256,.5)';
  ctx.fillRect(0,0,500,500);

  ctx.lineWidth = 20;
  ctx.strokeStyle = "orange";
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.5;

  ctx.beginPath();
  ctx.moveTo(50,250);
  ctx.lineTo(450,250);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(250,50);
  ctx.lineTo(250,450);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "green";
  ctx.lineCap = "square";

  ctx.beginPath();
  ctx.moveTo(50,250);
  ctx.lineTo(450,250);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(250,50);
  ctx.lineTo(250,450);
  ctx.stroke();

  //draw the bullseye
  ctx.beginPath();
  ctx.globalAlpha = .7;
  ctx.strokeStyle = "red";
  ctx.lineWidth = 15;
  ctx.arc(250,250,slider.precision,0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(250,250,10,2 * Math.PI, false);
  ctx.closePath();
  ctx.stroke();
  //ctx.fill();

  ctx.globalAlpha = 1;
  for (var i=0;i<4;i++) {  
    ctx.translate(250,250);
    ctx.rotate(Math.PI/2);  
    ctx.beginPath();  
    ctx.moveTo(250 + 3 * slider.precision/5,250);  
    ctx.lineTo(250 + 7 * slider.precision/5,250);  
    ctx.closePath();
    ctx.stroke();  
  }  
  ctx.restore();
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
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Score: " + game['score'],250,19); 
  ctx.textAlign = "left";
  ctx.fillText("Level: " + game['level'],5,19); 
  ctx.textAlign = "right";
  ctx.fillText("Shots Left: " + game["shotsLeft"],495,19); 

  ctx.restore();
}

function writeUserInputFields() {
  $("#user_txt_boxes").append('<input type="text" id="firstname" style="position: absolute; left: 30px; top: 350px" size="10">');
  $("#user_txt_boxes").append('<input type="text" id="lastname" style="position: absolute; left: 120px; top: 350px" size="10">');
  $("#user_txt_boxes").append('<input type="text" id="email" style="position: absolute; left: 30px; top: 390px" size="20">');
}

function removeUserInputFields() {
  $("#firstname").remove();
  $("#lastname").remove();
  $("#email").remove();
}
