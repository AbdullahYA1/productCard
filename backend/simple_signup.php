<?php
include 'db.php';

if ($_POST['username'] && $_POST['email'] && $_POST['password']) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Simple insert query
    $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password')";
    
    if ($conn->query($sql)) {
        echo "Account created successfully! <a href='../login.html'>Go to Login</a>";
    } else {
        echo "Error: " . $conn->error;
    }
} else {
    echo "Please fill all fields!";
}
?>
