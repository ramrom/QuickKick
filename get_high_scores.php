<?php 

  // mysql db info
  $host = "localhost";
  $user = "enovagameuser";
  $pass = "enovagameuser";

  $database = "enovagames";
  $tableName = "quickkick";

  //Connect to mysql database
  $con = mysql_connect($host,$user,$pass);
  $dbs = mysql_select_db($database, $con);

  //Query database for data
  $result = mysql_query("SELECT first_name,last_name,score FROM $tableName order by score desc LIMIT 15");          //query

  $parsed_results = array();
  while ($row = mysql_fetch_array($result)) {
    $parsed_results[] = array( 
      'first_name' => $row['first_name'],
      'last_name' => $row['last_name'],
      'score' => $row['score'],
    );
  } 
  //$array = mysql_fetch_row($result);                          //fetch result    

  //echo result as json 
  echo json_encode($parsed_results);

?>
