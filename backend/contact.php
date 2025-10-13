<?php
session_start();

// Initialize messages array
if(!isset($_SESSION['messages'])) {
    $_SESSION['messages'] = [];
}

// Store message from POST
if(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    if(!empty($name) && !empty($email) && !empty($message)) {
        $storeMessage = ['name' => $name, 'email' => $email, 'message' => $message];
        $_SESSION['messages'][] = $storeMessage;
    }
}

// Echo the array as JSON
echo json_encode($_SESSION['messages']);
?>
