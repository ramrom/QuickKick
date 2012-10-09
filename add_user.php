//add a new user
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
  $result = mysql_query("INSERT into `quickkick` (first_name,last_name,email,score,agree_to_terms) values ('John','Doe','jdoe@test.com',0,false)");

?>
