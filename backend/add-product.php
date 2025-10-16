<?php

include 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Debug: Log received data
error_log("POST data received: " . print_r($_POST, true));

// Get POST data
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? 0;
$image = $_POST['image'] ?? 'images/carfuture.png';

// Basic validation
if (empty($name) || empty($price)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Name and price are required',
        'received_data' => $_POST
    ]);
    exit;
}

// Convert price to float to match your database schema (DECIMAL(10,2))
$priceFloat = (float) $price;

// Validate price is positive
if ($priceFloat <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Price must be a positive number']);
    exit;
}

// Check database connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$sql = "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

// Use "ssds" binding - string, string, decimal, string to match your schema
$stmt->bind_param("ssds", $name, $description, $priceFloat, $image);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'message' => 'Product added successfully', 
        'id' => $conn->insert_id,
        'data' => [
            'name' => $name,
            'description' => $description,
            'price' => $priceFloat,
            'image' => $image
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to add product: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>