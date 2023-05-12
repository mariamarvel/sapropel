<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exeption;

// подключение файлов
require "PHPMailer/src/PHPMailer.php";
require "PHPMailer/src/Exeption.php";


//создаю объект класса PHPMailer
$mail = new PHPMailer(true);
$mail->CharSet = "UTF-8";
$mail->isHTML(true); //поддержка html тегов

//считывает данные с формы
$name = $_POST["name"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$message = $_POST["message"];

$email_template = "template_mail.html"; //связь с файлом
$body = file_get_contents($email_template);
$body = str_replase('%name%', $name, $body); //меняем строки <p>Имя: %name%</p>  <p>Email: %email%</p>, на значения с полей ввода
$body = str_replase('%email%', $email, $body);
$body = str_replase('%phone%', $phone, $body);
$body = str_replase('%message%', $message, $body);

// //формирует тело сообщения
// $body = $name . ' ' . $email . ' ' . $phone . ' ' . $message;

//тема сообщения
$theme = "[Заявка с формы]";

//задаём адресс на который будет присылаться письмоБ можно задавать несколько адресов
$mail->addAddress("maaborodulina@gmail.com");

//формирование темы сообщения
$mail->Subject = $theme;
 
//формирование тела сообщения
$mail->MsgHTML($body);

//отправка сообщения с ответом в jsonформате
if(!$mail->send()){
    $message = "Сообщение не отправленно"; 
} else{
    $message = "Сообщение успешно отправленно!"; 
}


//формируем простой json
$response = ["message" => $message];
header('Content-type: application/json');

echo json_encode($response);
