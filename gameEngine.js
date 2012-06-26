//this is the game engine
var game = {"score":0, "level":0, "shotsLeft": 5, "shotsMade": 0, "shotsMissed":0};

function writeDebugInfo() {
  document.getElementById('framecounter').innerHTML = "Frame Count: " + frameCount;
  document.getElementById('timer').innerHTML = "Timer: " + (Date.now() - animationTimeStamp);
}
