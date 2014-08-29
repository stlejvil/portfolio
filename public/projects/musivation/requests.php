<?php

// se connecter au serveur de la DB
$link = mysql_connect('mysql51-95.perso', 'stlejvil2013', 'yit973M9')
or die('Could not connect server: '.mysql_error());

// choisir la bonne DB
$db = mysql_select_db('stlejvil2013');

// notre reqûete SQL de newsletter
function newsletter($email, $hash) {
	
	$result = mysql_query(
	"INSERT INTO Emails (email, hash)
	 VALUES ('$email', '$hash')"
	)or die(mysql_error());
	
	return $result;
}

function match($email, $hash) {

	$result = mysql_query(
			"SELECT email, hash, valid
			 FROM Emails
			 WHERE email='$email'
			 AND hash='$hash'
			 AND valid='0'"
			)or die(mysql_error());

	return $result;
}

function emailUpdate($email, $hash) {

	mysql_query(
				"UPDATE Emails
				 SET valid='1'
				 WHERE email='$email'
				 AND hash='$hash'"
				)or die(mysql_error());
}