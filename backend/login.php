<?php 
session_start();

// Handle login request
if(isset($_POST['email']) && isset($_POST['password'])) {
    $login_email = $_POST['email'];
    $login_password = $_POST['password'];
    
    // Check if session has signup data and if login credentials match
    if(isset($_SESSION['user_email']) && isset($_SESSION['user_password'])) {
        if($_SESSION['user_email'] === $login_email && $_SESSION['user_password'] === $login_password) {
            echo "Login Successfully";
        } else {
            echo "Login Failed";
        }
    } else {
        echo "No user found. Please sign up first.";
    }
} else {
    echo "All fields are required";
}
?>