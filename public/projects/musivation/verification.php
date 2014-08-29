<!DOCTYPE>
<html>
<head>
	<title>Musivation</title>
	<meta charset="utf-8" />
</head>
<body>
	<?php
		if(isset($_GET['email']) && !empty($_GET['email']) AND isset($_GET['hash']) && !empty($_GET['hash'])){  
		    include ("requests.php"); 
		    $email = mysql_escape_string($_GET['email']);  
		    $hash = mysql_escape_string($_GET['hash']);
		    $match  = mysql_num_rows(match($email, $hash));

		    if($match > 0){
		    	emailUpdate($email, $hash);
			    echo 'Thanks ! You will stay informed.';
			}else{  
			    echo "You need to retry";
			}
		} else {
			echo "*Barking dogs* Get out !";
		}   
	?>
	<!-- <h1>Thanks ! You will stay informed.</h1> -->
</body>
</html>