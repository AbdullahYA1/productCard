<?php
$products = [
    [
        "id" => 1,
        "name" => "Apple iPhone 13",
        "price" => 799.99,
        "description" => "Latest iPhone with A15 Bionic chip and advanced camera system",
        "category" => "Smartphone",
        "brand" => "Apple",
        "image" => "images/carfuture.png",
        "stock" => 50,
        "rating" => 4.8,
        "features" => ["5G", "Face ID", "Wireless Charging", "Water Resistant"]
    ],
    [
        "id" => 2,
        "name" => "Samsung Galaxy S21",
        "price" => 699.99,
        "description" => "Flagship Android phone with triple camera and 120Hz display",
        "category" => "Smartphone", 
        "brand" => "Samsung",
        "image" => "images/galaxy-s21.jpg",
        "stock" => 35,
        "rating" => 4.6,
        "features" => ["5G", "120Hz Display", "Triple Camera", "Fast Charging"]
    ],
    [
        "id" => 3,
        "name" => "Google Pixel 6",
        "price" => 599.99,
        "description" => "Google's flagship with Tensor chip and computational photography",
        "category" => "Smartphone",
        "brand" => "Google",
        "image" => "images/pixel6.jpg",
        "stock" => 25,
        "rating" => 4.5,
        "features" => ["Google Tensor", "AI Photography", "Pure Android", "5G"]
    ],
    [
        "id" => 4,
        "name" => "OnePlus 9",
        "price" => 549.99,
        "description" => "Fast charging flagship with Hasselblad camera partnership",
        "category" => "Smartphone",
        "brand" => "OnePlus",
        "image" => "images/oneplus9.jpg",
        "stock" => 20,
        "rating" => 4.4,
        "features" => ["Warp Charge", "Hasselblad Camera", "120Hz", "5G"]
    ],
    [
        "id" => 5,
        "name" => "Sony Xperia 5",
        "price" => 649.99,
        "description" => "Compact flagship with cinema-grade display and camera",
        "category" => "Smartphone",
        "brand" => "Sony",
        "image" => "images/xperia5.jpg",
        "stock" => 15,
        "rating" => 4.3,
        "features" => ["4K HDR Display", "Cinema Pro", "21:9 Screen", "IP68"]
    ],
    [
        "id" => 6,
        "name" => "Nokia 3310",
        "price" => 59.99,
        "description" => "Classic feature phone with legendary battery life",
        "category" => "Feature Phone",
        "brand" => "Nokia",
        "image" => "images/nokia3310.jpg",
        "stock" => 100,
        "rating" => 4.2,
        "features" => ["Long Battery", "Snake Game", "Durable", "Dual SIM"]
    ],
    [
        "id" => 7,
        "name" => "Motorola Edge",
        "price" => 499.99,
        "description" => "Mid-range phone with curved edge display and clean Android",
        "category" => "Smartphone",
        "brand" => "Motorola",
        "image" => "images/moto-edge.jpg",
        "stock" => 30,
        "rating" => 4.1,
        "features" => ["Curved Display", "Clean Android", "Fast Charging", "5G"]
    ],
    [
        "id" => 8,
        "name" => "Huawei P40",
        "price" => 579.99,
        "description" => "Flagship with Leica cameras and premium design",
        "category" => "Smartphone",
        "brand" => "Huawei",
        "image" => "images/huawei-p40.jpg",
        "stock" => 18,
        "rating" => 4.0,
        "features" => ["Leica Camera", "Kirin 990", "Premium Design", "Fast Charging"]
    ]
];
$search = $_GET['search'] ?? '';
$safeInput = htmlspecialchars($search, ENT_QUOTES, 'UTF-8');

// If no search term, return all products
if(empty($safeInput)) {
    echo json_encode($products);
    exit;
}

// Search through products
$filteredProducts = [];
foreach($products as $product) {
    // Search in name, brand, description, and category
    if(stripos($product['name'], $safeInput) !== false ||
       stripos($product['brand'], $safeInput) !== false ||
       stripos($product['description'], $safeInput) !== false ||
       stripos($product['category'], $safeInput) !== false) {
        $filteredProducts[] = $product;
    }
}

echo json_encode($filteredProducts);