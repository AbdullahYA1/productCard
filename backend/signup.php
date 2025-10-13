<?php 
session_start();

// Handle signup request
if(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['confirm_password'])) {
    $signup_name = $_POST['name'];
    $signup_email = $_POST['email'];
    $signup_password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if($signup_password === $confirm_password) {
        // Save signup information in session
        $_SESSION['user_name'] = $signup_name;
        $_SESSION['user_email'] = $signup_email;
        $_SESSION['user_password'] = $signup_password;
        
        echo "Sign Up Successful";
    } else {
        echo "Passwords do not match";
    }
} else {
    echo "All fields are required";
}
?>
