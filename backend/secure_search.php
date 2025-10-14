<?php 
include 'db.php';

// SECURE CODE FOR COMPARISON
// ✅ This demonstrates proper security practices

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Search Demo - Best Practices</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .success {
            background-color: #28a745;
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
        .security-info {
            background-color: #d1f2eb;
            border: 1px solid #7dcea0;
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
            background-color: #28a745;
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
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div style="margin-bottom: 20px;">
        <a href="../name.html" class="back-link">← Back to Demo Selection</a>
        <a href="vulnerable_search.php" style="background-color: #dc3545; color: white; padding: 8px 15px; text-decoration: none; border-radius: 3px;">View Vulnerable Version 🔓</a>
    </div>
    
    <div class="success">
        ✅ SECURE VERSION - Demonstrates Proper Security Practices
    </div>

    <div class="form-container">
        <h2>Secure Product Search</h2>
        
        <div class="security-info">
            <strong>Security Features Implemented:</strong>
            <ul>
                <li><strong>XSS Prevention:</strong> All output is properly sanitized using htmlspecialchars()</li>
                <li><strong>SQL Injection Prevention:</strong> Prepared statements with parameter binding</li>
                <li><strong>Input Validation:</strong> Server-side validation and length limits</li>
                <li><strong>Error Handling:</strong> Generic error messages that don't reveal system details</li>
            </ul>
        </div>

        <form method="GET">
            <label for="search"><strong>Search for a product:</strong></label>
            <input type="text" name="search" id="search" placeholder="Enter product name..." maxlength="100" />
            <button type="submit">Search Products</button>
        </form>

        <?php
        if (isset($_GET['search']) && !empty($_GET['search'])) {
            // SECURITY FIX 1: Input validation and sanitization
            $search_term = trim($_GET['search']);
            
            // Validate input length
            if (strlen($search_term) > 100) {
                echo "<div class='results'>";
                echo "<p style='color: red;'>Search term is too long. Please limit to 100 characters.</p>";
                echo "</div>";
            } else {
                // SECURITY FIX 2: XSS Prevention - Sanitize output
                echo "<div class='results'>";
                echo "<h3>Search Results for: " . htmlspecialchars($search_term, ENT_QUOTES, 'UTF-8') . "</h3>";
                
                try {
                    // SECURITY FIX 3: SQL Injection Prevention - Prepared statements
                    $sql = "SELECT * FROM products WHERE title LIKE ? OR description LIKE ?";
                    $stmt = $conn->prepare($sql);
                    
                    if ($stmt) {
                        $search_param = "%" . $search_term . "%";
                        $stmt->bind_param("ss", $search_param, $search_param);
                        $stmt->execute();
                        $result = $stmt->get_result();
                        
                        if ($result && $result->num_rows > 0) {
                            echo "<h4>Found " . $result->num_rows . " product(s):</h4>";
                            echo "<table border='1' style='width:100%; border-collapse: collapse;'>";
                            echo "<tr><th>ID</th><th>Title</th><th>Description</th><th>Price</th></tr>";
                            
                            while ($row = $result->fetch_assoc()) {
                                echo "<tr>";
                                echo "<td>" . htmlspecialchars($row['id'], ENT_QUOTES, 'UTF-8') . "</td>";
                                echo "<td>" . htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8') . "</td>";
                                echo "<td>" . htmlspecialchars($row['description'], ENT_QUOTES, 'UTF-8') . "</td>";
                                echo "<td>$" . htmlspecialchars($row['price'], ENT_QUOTES, 'UTF-8') . "</td>";
                                echo "</tr>";
                            }
                            echo "</table>";
                        } else {
                            echo "<p>No products found matching your search.</p>";
                        }
                        
                        $stmt->close();
                    } else {
                        // SECURITY FIX 4: Generic error messages
                        echo "<p style='color: red;'>An error occurred while searching. Please try again later.</p>";
                    }
                    
                } catch (Exception $e) {
                    // SECURITY FIX 5: Don't reveal system information in errors
                    echo "<p style='color: red;'>An error occurred while searching. Please try again later.</p>";
                    // Log the actual error for developers (not shown to users)
                    error_log("Database error in secure_search.php: " . $e->getMessage());
                }
                
                echo "</div>";
            }
        }
        ?>

        <div class="security-info" style="margin-top: 30px;">
            <h3>Security Best Practices Demonstrated:</h3>
            
            <h4>XSS Prevention:</h4>
            <ul>
                <li><code>htmlspecialchars($input, ENT_QUOTES, 'UTF-8')</code> - Properly encode output</li>
                <li>Content Security Policy headers (recommended for production)</li>
                <li>Input validation and length limits</li>
            </ul>
            
            <h4>SQL Injection Prevention:</h4>
            <ul>
                <li>Prepared statements with parameter binding</li>
                <li><code>$stmt->bind_param("ss", $param1, $param2)</code></li>
                <li>Never concatenate user input directly into SQL queries</li>
            </ul>
            
            <h4>Additional Security Measures:</h4>
            <ul>
                <li>Input validation (length, type, format)</li>
                <li>Generic error messages that don't reveal system information</li>
                <li>Proper error logging for developers</li>
                <li>Resource cleanup (closing statements and connections)</li>
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
