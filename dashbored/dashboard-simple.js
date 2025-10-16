// =============================================================================
// SIMPLE DASHBOARD JAVASCRIPT - BEGINNER FRIENDLY
// =============================================================================
// This file contains all the JavaScript functions for the dashboard
// Each function is explained step by step for easy learning

// =============================================================================
// 1. INITIALIZATION - RUNS WHEN PAGE LOADS
// =============================================================================

// Wait for the page to fully load before running our code
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, starting dashboard...');
    startDashboard();
});

// Main function to start the dashboard
function startDashboard() {
    // Step 1: Check if admin is already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true') {
        // User is logged in, show dashboard
        showDashboard();
    } else {
        // User is not logged in, show login form
        showLogin();
    }
    
    // Step 2: Set up the login form
    setupLoginForm();
}

// =============================================================================
// 2. LOGIN SYSTEM - SIMPLE AUTHENTICATION
// =============================================================================

function setupLoginForm() {
    // Find the login form in the HTML
    const loginForm = document.getElementById('loginForm');
    
    // Add event listener to handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form is ready');
    }
}

function handleLogin(event) {
    // Step 1: Prevent the form from submitting normally
    event.preventDefault();
    
    // Step 2: Get the email and password from the form
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    console.log('Login attempt for:', email);
    
    // Step 3: Check if credentials are correct (simple demo)
    if (email === 'admin@hashplus.com' && password === 'admin123') {
        // Success: Save login status and show dashboard
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        console.log('Login successful');
    } else {
        // Error: Show error message
        alert('Wrong email or password!\\nUse: admin@hashplus.com / admin123');
        console.log('Login failed');
    }
}

function logout() {
    // Step 1: Remove login status from browser storage
    localStorage.removeItem('adminLoggedIn');
    
    // Step 2: Show login screen again
    showLogin();
    
    console.log('User logged out');
}

// =============================================================================
// 3. UI FUNCTIONS - SHOW/HIDE SECTIONS
// =============================================================================

function showLogin() {
    // Hide dashboard and show login form
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('dashboard-content').style.display = 'none';
}

function showDashboard() {
    // Hide login and show dashboard
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';
    
    // Load dashboard data
    loadAllData();
    setupProductForm();
}

function showSection(sectionName) {
    // Step 1: Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Step 2: Remove active class from all navigation links
    const allNavLinks = document.querySelectorAll('.sidebar .nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Step 3: Show the selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Step 4: Add active class to clicked navigation link
    event.target.classList.add('active');
    
    // Step 5: Load data for the selected section
    if (sectionName === 'products') {
        loadProducts();
    }
    
    console.log('Switched to section:', sectionName);
}

// =============================================================================
// 4. PRODUCT MANAGEMENT - ADD NEW PRODUCTS
// =============================================================================

function setupProductForm() {
    // Find the product form and set up event listener
    const productForm = document.getElementById('productForm');
    
    if (productForm) {
        productForm.addEventListener('submit', addProduct);
        console.log('Product form is ready');
    }
}

function showAddProductForm() {
    // Show the add product form
    document.getElementById('product-form').style.display = 'block';
    
    // Clear any existing data in the form
    document.getElementById('productForm').reset();
    
    console.log('Add product form shown');
}

function hideProductForm() {
    // Hide the add product form
    document.getElementById('product-form').style.display = 'none';
    
    // Clear any messages
    document.getElementById('message').innerHTML = '';
    
    console.log('Add product form hidden');
}

// Function to add a new product
function addProduct(event) {
    // Step 1: Prevent form from submitting normally
    event.preventDefault();
    console.log('Adding new product...');
    
    // Step 2: Get form data
    const form = event.target;
    const formData = new FormData(form);
    
    // Step 3: Show loading message
    showMessage('Adding product...', 'info');
    
    // Step 4: Send data to server using fetch
    fetch('../backend/add-product.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        // Step 5: Handle server response
        console.log('Server response:', result);
        
        try {
            const data = JSON.parse(result);
            
            if (data.success) {
                // Success: Show success message and reset form
                showMessage('Product added successfully!', 'success');
                form.reset();
                hideProductForm();
                loadProducts(); // Refresh the products list
            } else {
                // Error: Show error message
                showMessage('Error: ' + data.message, 'danger');
            }
        } catch (error) {
            // JSON parsing error
            console.error('Error parsing response:', error);
            showMessage('Server error occurred', 'danger');
        }
    })
    .catch(error => {
        // Network error
        console.error('Network error:', error);
        showMessage('Network error: Could not connect to server', 'danger');
    });
}

// =============================================================================
// 5. DISPLAY PRODUCTS - GET AND SHOW PRODUCTS
// =============================================================================

function loadProducts() {
    console.log('Loading products...');
    
    // Step 1: Show loading message in the table
    const productsTable = document.getElementById('products-table');
    productsTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Loading products...</p>
            </td>
        </tr>
    `;
    
    // Step 2: Fetch products from server
    fetch('../backend/get.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        // Step 3: Handle server response
        console.log('Products loaded:', data);
        
        if (data.success && data.products) {
            displayProducts(data.products);
            updateProductCount(data.products.length);
        } else {
            showNoProducts();
            updateProductCount(0);
        }
    })
    .catch(error => {
        // Step 4: Handle errors
        console.error('Error loading products:', error);
        showProductsError();
    });
}

function displayProducts(products) {
    const productsTable = document.getElementById('products-table');
    
    if (products.length === 0) {
        showNoProducts();
        return;
    }
    
    // Step 1: Create HTML for each product
    let tableHTML = '';
    
    products.forEach(product => {
        // Format price to 2 decimal places
        const price = parseFloat(product.price).toFixed(2);
        
        // Handle description (make it shorter if too long)
        let description = product.description || 'No description';
        if (description.length > 50) {
            description = description.substring(0, 50) + '...';
        }
        
        // Handle image
        let imageUrl = product.image || '../images/carfuture.png';
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            imageUrl = '../' + imageUrl;
        }
        
        // Create table row for this product
        tableHTML += `
            <tr>
                <td><strong>#${product.id}</strong></td>
                <td>
                    <img src="${imageUrl}" 
                         alt="${product.name}" 
                         class="product-image" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"
                         onerror="this.src='../images/carfuture.png'">
                </td>
                <td><strong>${product.name}</strong></td>
                <td><span class="badge bg-success">$${price}</span></td>
                <td>${description}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-2" onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price}, '${product.image}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
    
    // Step 2: Put the HTML into the table
    productsTable.innerHTML = tableHTML;
}

function showNoProducts() {
    const productsTable = document.getElementById('products-table');
    productsTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-muted py-5">
                <i class="fas fa-box-open fa-3x mb-3"></i>
                <h5>No products found</h5>
                <p>Click the button below to add your first product</p>
                <button class="btn btn-primary" onclick="showAddProductForm()">
                    <i class="fas fa-plus"></i> Add First Product
                </button>
            </td>
        </tr>
    `;
}

function showProductsError() {
    const productsTable = document.getElementById('products-table');
    productsTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-danger py-4">
                <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                <h6>Error loading products</h6>
                <p>Could not connect to the server</p>
                <button class="btn btn-outline-primary" onclick="loadProducts()">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </td>
        </tr>
    `;
}

// =============================================================================
// 6. DELETE PRODUCTS
// =============================================================================

function deleteProduct(productId) {
    // Step 1: Ask user for confirmation
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    
    if (!confirmDelete) {
        console.log('Delete cancelled by user');
        return;
    }
    
    console.log('Deleting product ID:', productId);
    
    // Step 2: Create form data with product ID
    const formData = new FormData();
    formData.append('id', productId);
    
    // Step 3: Send delete request to server
    fetch('../backend/delete-product.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Step 4: Handle server response
        console.log('Delete response:', data);
        
        if (data.success) {
            showMessage('Product deleted successfully!', 'success');
            loadProducts(); // Refresh the products list
        } else {
            showMessage('Error deleting product: ' + data.message, 'danger');
        }
    })
    .catch(error => {
        // Step 5: Handle errors
        console.error('Delete error:', error);
        showMessage('Network error: Could not delete product', 'danger');
    });
}

// =============================================================================
// 7. UPDATE PRODUCTS
// =============================================================================

function editProduct(id, name, description, price, image) {
    // Step 1: Show the product form
    showAddProductForm();
    
    // Step 2: Fill the form with existing product data
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = name;
    document.getElementById('productDescription').value = description;
    document.getElementById('productPrice').value = price;
    document.getElementById('productImage').value = image;
    
    // Step 3: Change form title to indicate editing
    document.getElementById('form-title').innerHTML = '<i class="fas fa-edit"></i> Edit Product';
    
    // Step 4: Change the form submit to update instead of add
    const form = document.getElementById('productForm');
    form.onsubmit = function(event) {
        updateProduct(event, id);
    };
    
    console.log('Editing product ID:', id);
}

function updateProduct(event, productId) {
    // Step 1: Prevent form from submitting normally
    event.preventDefault();
    console.log('Updating product ID:', productId);
    
    // Step 2: Get form data
    const form = event.target;
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const image = document.getElementById('productImage').value;
    
    // Step 3: Create JSON data for PUT request
    const productData = {
        id: productId,
        name: name,
        description: description,
        price: parseFloat(price),
        image: image
    };
    
    // Step 4: Show loading message
    showMessage('Updating product...', 'info');
    
    // Step 5: Send PUT request to server
    fetch('../backend/update-product.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        // Step 6: Handle server response
        console.log('Update response:', data);
        
        if (data.success) {
            // Success: Show success message and reset form
            showMessage('Product updated successfully!', 'success');
            form.reset();
            hideProductForm();
            loadProducts(); // Refresh the products list
            
            // Reset form back to add mode
            resetFormToAddMode();
        } else {
            // Error: Show error message
            showMessage('Error: ' + data.message, 'danger');
        }
    })
    .catch(error => {
        // Network error
        console.error('Update error:', error);
        showMessage('Network error: Could not update product', 'danger');
    });
}

function resetFormToAddMode() {
    // Reset form title
    document.getElementById('form-title').innerHTML = '<i class="fas fa-plus"></i> Add New Product';
    
    // Reset form submit handler back to add product
    const form = document.getElementById('productForm');
    form.onsubmit = addProduct;
    
    // Clear the hidden product ID field
    document.getElementById('productId').value = '';
}

// =============================================================================
// 8. HELPER FUNCTIONS - UTILITIES
// =============================================================================

function loadAllData() {
    // Load products and update statistics
    loadProducts();
    updateStaticStats();
}

function updateProductCount(count) {
    // Update the products count in the statistics
    const productCountElement = document.getElementById('total-products');
    if (productCountElement) {
        productCountElement.textContent = count;
    }
}

function updateStaticStats() {
    // Update other statistics (these would come from APIs in a real app)
    document.getElementById('total-orders').textContent = '28';
    document.getElementById('total-revenue').textContent = '$15,420';
    document.getElementById('pending-orders').textContent = '5';
}

function showMessage(message, type) {
    // Show a message to the user
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return;
    
    // Create alert HTML
    const alertClass = `alert alert-${type}`;
    messageDiv.innerHTML = `<div class="${alertClass}">${message}</div>`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
}

// =============================================================================
// BEGINNER LEARNING NOTES:
// =============================================================================
/*
KEY CONCEPTS FOR STUDENTS:

1. EVENT LISTENERS:
   - addEventListener() attaches functions to events
   - 'DOMContentLoaded' waits for page to load
   - 'submit' event fires when forms are submitted

2. LOCAL STORAGE:
   - localStorage.setItem() saves data in browser
   - localStorage.getItem() retrieves saved data
   - localStorage.removeItem() deletes saved data

3. FETCH API:
   - fetch() sends HTTP requests to server
   - .then() handles responses (promises)
   - .catch() handles errors

4. JSON:
   - JSON.parse() converts text to JavaScript object
   - JSON.stringify() converts object to text

5. DOM MANIPULATION:
   - getElementById() finds HTML elements
   - innerHTML changes content inside elements
   - style.display controls visibility

6. FORM DATA:
   - new FormData() gets all form input values
   - Automatically handles file uploads
   - Works with PHP $_POST

PRACTICE EXERCISES:
1. Add a search function to filter products
2. Add an edit function to modify existing products
3. Add form validation before submitting
4. Add loading states for better user experience
*/
