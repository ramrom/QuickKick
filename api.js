//this is where we write the AJAX and JSON type requests and POSTS to server to store data
var xmldebug = new XMLHttpRequest();

function sendUserInfo() {
  $.post("add_user.php",playerInfo);
} 

function retrieveHighScores() {
  if (window.XMLHttpRequest) {   // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
    xmldebug = xmlhttp;
  }
  else { // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  } 
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      output = eval("(" + xmlhttp.responseText + ")");
      for (var i=0;i<15;i++) {
        highScores[i].name = output[i].first_name.substring(0,1) + ". " + output[i].last_name;
        highScores[i].score = output[i].score;
      }
    }
  }
  xmlhttp.open("GET","get_high_scores.php",true);
  xmlhttp.send();
} 
