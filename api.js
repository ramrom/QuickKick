//this is where we write the AJAX and JSON type requests and POSTS to server to store data
highScores = Array[15];
for (var i=0;i<15;i++) {
  highScores[i].name = "JDoe"
  highScores[i].score = "10"
}

function sendUserInfo() {
 //retrive high scores and store in highScores array
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("PUT","add_user.php",true);
    xmlhttp.send();
  }
}

function retrieveHighScores()
{
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    //document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
    //TODO: populate highScores array with values
      for (var i=0;i<15;i++) {
        highScores[i].name = xmlhttp.responseText 
        highScores[i].score = xmlhttp.responseText 
      }
    }
  xmlhttp.open("GET","get_high_scores.php",true);
  //xmlhttp.open("GET","get_high_scores.php?q="+str,true);
  xmlhttp.send();
} 

