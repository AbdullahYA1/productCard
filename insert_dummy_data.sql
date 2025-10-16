-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT(255) NOT NULL AUTO_INCREMENT,
    username VARCHAR(56) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert simple test users with plain text passwords (for beginners)
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', 'admin123'),
('john', 'john@example.com', 'john123'),
('test', 'test@example.com', 'test123');
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', 'admin123'),
('john_doe', 'john@example.com', 'john123'),
('jane_smith', 'jane@example.com', 'jane123'),
('test_user', 'test@example.com', 'test123'),
('demo_user', 'demo@example.com', 'demo123');

-- Verify the table was created and data inserted
SELECT * FROM users;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT(255) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500) DEFAULT 'images/carfuture.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample products
INSERT INTO products (name, description, price, image) VALUES
('iPhone 15 Pro', 'Latest iPhone with advanced camera system and A17 Pro chip', 999.99, 'images/iphone.jpeg'),
('Samsung Galaxy S24', 'Premium Android smartphone with AI features', 899.99, 'images/carfuture.png'),
('MacBook Air M3', 'Ultra-thin laptop with M3 chip for productivity', 1299.99, 'images/carfuture.png'),
('Dell XPS 15', 'High-performance laptop for professionals', 1599.99, 'images/carfuture.png'),
('iPad Pro 12.9"', 'Professional tablet with M2 chip', 1099.99, 'images/carfuture.png');

-- Verify the products table
SELECT * FROM products;
