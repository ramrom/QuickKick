//add a new user
<?php 

  // mysql db info
  $host = "localhost";
  $user = "enovagameuser";
  $pass = "enovagameuser";

  $database = "enovagames";
  $tableName = "quickkick";

  if(isset($_POST["firstname"])) {

    if ($_POST[agree_to_terms]=='true') {
      $agree_to_terms = 1;
    }
    else {
      $agree_to_terms = 0;
    }
  
    //Connect to mysql database
    $con = mysql_connect($host,$user,$pass);
    $dbs = mysql_select_db($database, $con);

    //Query database for data
    $result = mysql_query("INSERT INTO $database.$tableName (first_name,last_name,email,score,agree_to_terms) values ('$_POST[firstname]','$_POST[lastname]','$_POST[email]','$_POST[score]',$agree_to_terms)");
    //$result = mysql_query("INSERT into $database.$tableName (first_name,last_name,email,score,agree_to_terms) values ($firstname,$lastname,$email,$score,$agree_to_terms)"); 
  } 
?>
