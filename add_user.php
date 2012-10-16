//add a new user
<?php 

  // mysql db info
  $host = "localhost";
  $user = "enovagameuser";
  $pass = "enovagameuser";

  $database = "enovagames";
  $tableName = "quickkick";

  if(isset($_POST["playerInfo"])){
    $playerInfo_json = $_POST["playerInfo"];
    $JSONArray  = json_decode($playerInfo_json, true); //returns null if not decoded
    //Values can now be accessed like standard PHP array
    if($JSONArray !== null){ 
        $firstname = $JSONArray["firstname"];
        $lastname = $JSONArray["lastname"];
        $email = $JSONArray["email"];
        $score = $JSONArray["score"];
        $agree_to_terms = $JSONArray["agree_to_terms"];
    }
  } 
  //Connect to mysql database
  $con = mysql_connect($host,$user,$pass);
  $dbs = mysql_select_db($database, $con);

  //Query database for data
  $result = mysql_query("INSERT into $database.$tableName (first_name,last_name,email,score,agree_to_terms) values ($firstname,$lastname,$email,$score,$agree_to_terms)"); 
?>
