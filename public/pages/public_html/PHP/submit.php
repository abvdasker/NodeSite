<?php

require_once 'Mail.php';

ini_set('display_errors', '0');     # don't show any errors...
error_reporting(E_ALL | E_STRICT);


$fac = new Mail();
$pear = new PEAR();

$addr = $_POST["sender_addr"];
$sub = $_POST["sub"];
$msg = $_POST["msg"];


$to = "hal.c.rogers@gmail.com";
/* $headers = "From: " . $addr; */
$headers = array("From" => $addr, "Subject" => $sub);
$body = $msg;

$host = 'ssl://smtp.gmail.com';
$port = "465";
$username = "hal.c.rogers@gmail.com";
$password = 'ab7dasker';

$smtp = $fac->factory('smtp', array('host' => $host,
            'port'=>$port,
            'auth' => true,
            'username' => $username,
            'password' => $password
        ));

$mail = $smtp->send($to, $headers, $body);

if ($pear->isError($mail)) {
    echo("<p>" . $mail->getMessage() . "</p>");
} else {
    echo("<p>Message successfully sent!</p>");
}
echo "Take me back to <a href=\"http://www.amherst.edu/~hrogers13\">Hal's site</a>";
//phpinfo();
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>