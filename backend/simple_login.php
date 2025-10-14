<?php
include 'db.php';

if ($_POST['username'] && $_POST['password']) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Simple query to check user
    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        echo "Login successful! Welcome " . $username;
    } else {
        echo "Wrong username or password!";
    }
} else {
    echo "Please fill all fields!";
}
?>
