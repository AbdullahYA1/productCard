<?php

header('Content-Type: application/json');

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] != 'PUT') {
    echo json_encode(['success' => false, 'message' => 'Please use PUT method']);
    exit();
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$id = $data['id'];
$name = $data['name'];
$description = $data['description'];
$price = $data['price'];
$image = $data['image'];

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Product ID is required']);
    exit();
}

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Product name is required']);
    exit();
}

if (empty($price) || $price <= 0) {
    echo json_encode(['success' => false, 'message' => 'Valid price is required']);
    exit();
}

$sql = "UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("ssdsi", $name, $description, $price, $image, $id);

$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Product not found or no changes made']);
}

$stmt->close();
$conn->close();

?>