//this is the graphics engine 
var homeScreen = new Image();
var gameScreen = new Image();  
var endScreen = new Image();  
var goalie = new Image();
var ball = new Image();

function drawHomeScreen() {
}

function drawEndScreen() {
}

function drawStatusBar() {
  var ctx = document.getElementById('gamecanvas').getContext('2d');  
  ctx.save();
  
  //draw black bar 
  ctx.clearRect(0,0,500,25); // clear canvas  
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

function writeDebugInfo() {
  document.getElementById('framecounter').innerHTML = "Frame Count: " + frameCount;
  document.getElementById('timer').innerHTML = "Timer: " + (Date.now() - animationTimeStamp);
}
