<?php 
include 'db.php';

// VULNERABLE CODE FOR EDUCATIONAL PURPOSES ONLY
// ⚠️ WARNING: This code contains intentional security vulnerabilities
// DO NOT USE IN PRODUCTION ENVIRONMENTS

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vulnerable Search Demo - Educational Purpose</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .warning {
            background-color: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .form-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .vulnerability-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .results {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div style="margin-bottom: 20px;">
        <a href="../name.html" style="color: #007bff; text-decoration: none; margin-right: 15px;">← Back to Demo Selection</a>
        <a href="secure_search.php" style="background-color: #28a745; color: white; padding: 8px 15px; text-decoration: none; border-radius: 3px;">View Secure Version ✅</a>
    </div>
    
    <div class="warning">
        ⚠️ EDUCATIONAL DEMO - Contains Intentional Security Vulnerabilities
        <br>This is for learning purposes only. Never use this code in production!
    </div>

    <div class="form-container">
        <h2>Product Search Demo</h2>
        
        <div class="vulnerability-info">
            <strong>Educational Note:</strong> This form demonstrates common web vulnerabilities:
            <ul>
                <li><strong>XSS (Cross-Site Scripting):</strong> User input is directly displayed without sanitization</li>
                <li><strong>SQL Injection:</strong> User input is directly inserted into SQL queries</li>
            </ul>
        </div>

        <form method="GET">
            <label for="search"><strong>Search for a product:</strong></label>
            <input type="text" name="search" id="search" placeholder="Try: Laptop, <script>alert('XSS')</script>, or ' OR '1'='1" />
            <button type="submit">Search Products</button>
        </form>

        <?php
        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search_term = $_GET['search'];
            
            // VULNERABILITY 1: XSS - Direct output without sanitization
            echo "<div class='results'>";
            echo "<h3>Search Results for: " . $search_term . "</h3>";
            
            try {
                // VULNERABILITY 2: SQL Injection - Direct concatenation without prepared statements
                $sql = "SELECT * FROM products WHERE title LIKE '%" . $search_term . "%' OR description LIKE '%" . $search_term . "%'";
                
                echo "<p><em>Executed SQL Query:</em> <code>" . htmlspecialchars($sql) . "</code></p>";
                
                $result = $conn->query($sql);
                
                if ($result && $result->num_rows > 0) {
                    echo "<h4>Found Products:</h4>";
                    echo "<table border='1' style='width:100%; border-collapse: collapse;'>";
                    echo "<tr><th>ID</th><th>Title</th><th>Description</th><th>Price</th></tr>";
                    
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . htmlspecialchars($row['id']) . "</td>";
                        echo "<td>" . htmlspecialchars($row['title']) . "</td>";
                        echo "<td>" . htmlspecialchars($row['description']) . "</td>";
                        echo "<td>$" . htmlspecialchars($row['price']) . "</td>";
                        echo "</tr>";
                    }
                    echo "</table>";
                } else {
                    echo "<p>No products found matching your search.</p>";
                }
                
            } catch (Exception $e) {
                echo "<p style='color: red;'><strong>Database Error:</strong> " . $e->getMessage() . "</p>";
                echo "<p><em>This error might reveal sensitive information about the database structure.</em></p>";
            }
            
            echo "</div>";
        }
        ?>

        <div class="vulnerability-info" style="margin-top: 30px;">
            <h3>Try These Vulnerability Tests:</h3>
            <h4>XSS Examples:</h4>
            <ul>
                <li><code>&lt;script&gt;alert('XSS Attack!')&lt;/script&gt;</code></li>
                <li><code>&lt;img src=x onerror=alert('XSS')&gt;</code></li>
                <li><code>&lt;svg onload=alert('XSS')&gt;</code></li>
            </ul>
            
            <h4>SQL Injection Examples:</h4>
            <ul>
                <li><code>' OR '1'='1</code> - Shows all products</li>
                <li><code>' UNION SELECT 1,2,3,4 --</code> - Union-based injection</li>
                <li><code>'; DROP TABLE products; --</code> - Destructive query (won't work due to single query limitation)</li>
            </ul>
            
            <h4>How to Fix These Vulnerabilities:</h4>
            <ul>
                <li><strong>XSS Prevention:</strong> Use <code>htmlspecialchars()</code> or <code>htmlentities()</code> for output</li>
                <li><strong>SQL Injection Prevention:</strong> Use prepared statements with parameter binding</li>
                <li><strong>Input Validation:</strong> Validate and sanitize all user inputs</li>
                <li><strong>Content Security Policy:</strong> Implement CSP headers</li>
            </ul>
        </div>
    </div>
</body>
</html>

<?php
if (isset($conn)) {
    $conn->close();
}
?>
