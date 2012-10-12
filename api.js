//this is where we write the AJAX and JSON type requests and POSTS to server to store data

function sendUserInfo() {
 //retrive high scores and store in highScores array
  var playerInfoEncoded = JSON.stringify(playerInfo);
  if (window.XMLHttpRequest) {
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","add_user.php",true);
    xmlhttp.send(playerInfoEncoded);
    //$.post("add_user.php",{JSON.stringify(playerInfo)});
  }
} 

function retrieveHighScores() {
  if (window.XMLHttpRequest) {   // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else { // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  } 
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    //document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
      for (var i=0;i<15;i++) {
        highScores[i].name = xmlhttp.responseText ;
        highScores[i].score = xmlhttp.responseText ;
      }
    }
  }
  xmlhttp.open("GET","get_high_scores.php",true);
  //xmlhttp.open("GET","get_high_scores.php?q="+str,true);
  xmlhttp.send();
} 
