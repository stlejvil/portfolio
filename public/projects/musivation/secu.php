<?php
error_reporting(E_ERROR);

$email = $_POST['email'];

if (emailValidation($email) == true ){
	include ("requests.php");

	$hash = md5( rand(0,1000) );
	$result = newsletter($email, $hash);

	$to      = $email; 
	$subject = 'Email verification';  
	$message = ' 
	 
	Thanks for signing up!
	 
	Now, let me know if you are a real person: 
	 
	http://stlejvil.com/verification.php?email='.$email.'&hash='.$hash.' 
	 
	'; // Our message above including the link  
	                      
	$headers = 'From:noreply@localhost' . "\r\n"; // Set from headers  
	mail($to, $subject, $message, $headers); // Send our email 

	return $result;
} else {
	return false;
}

function emailValidation($email)
{
 	if(preg_match("/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i", $email)) {
 		return true;
	} else {
 		return false;
 	}
}

?>