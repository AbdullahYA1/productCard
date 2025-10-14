<?php 

include 'db.php';
// Handle login request
if(isset($_POST['email']) && isset($_POST['password'])) {
    $login_email = $_POST['email'];
    $login_password = $_POST['password'];
   
    try {
        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $login_email);
        $stmt->execute();
        $result = $stmt->get_result();

    $users = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }

    echo json_encode($users);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
    $conn->close();
}
?>

