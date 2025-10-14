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
