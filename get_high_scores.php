<?php 

  // mysql db info
  $host = "localhost";
  $user = "enovagameuser";
  $pass = "enovagameuser";

  $database = "enovagames";
  $tableName = "quickkick";

  //Connect to mysql database
  include 'DB.php';
  $con = mysql_connect($host,$user,$pass);
  $dbs = mysql_select_db($database, $con);

  //Query database for data
  $result = mysql_query("SELECT * FROM $tableName order by score desc LIMIT 15");          //query
  
  //TODO: Need to scrub the results of everything but name and score
  $array = mysql_fetch_row($result);                          //fetch result    

  //echo result as json 
  echo json_encode($array);

?>
