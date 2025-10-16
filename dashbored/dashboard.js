document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check if already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simple demo authentication
    if (email === 'admin@hashplus.com' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('Invalid credentials! Use: admin@hashplus.com / admin123');
    }
}

function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';
    
    // Initialize dashboard data
    loadDashboardData();
    
    // Initialize form handlers with a small delay to ensure elements are rendered
    setTimeout(() => {
        initializeProductForm();
    }, 100);
}

function initializeProductForm() {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        // Remove any existing listeners first
        productForm.removeEventListener('submit', handleProductSubmit);
        // Add the event listener
        productForm.addEventListener('submit', handleProductSubmit);
        console.log('Product form event listener attached successfully');
    } else {
        console.log('Product form not found');
    }
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('dashboard-content').style.display = 'none';
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Add active class to clicked nav link
    event.target.classList.add('active');
    
    // Load section specific data
    if (sectionName === 'products') {
        loadProducts();
    } else if (sectionName === 'orders') {
        loadOrders();
    }
}

function loadDashboardData() {
    // Load products and update stats
    loadProducts();
    // Keep some static stats for now, but products count will be dynamic
    updateStaticStats();
}

function updateStaticStats() {
    // These would typically come from backend API calls
    // Products count will be updated by loadProducts()
    document.getElementById('total-orders').textContent = '28';
    document.getElementById('total-revenue').textContent = '$15,420';
    document.getElementById('pending-orders').textContent = '5';
}

// Product Management Functions
function showAddProductForm() {
    document.getElementById('product-form').style.display = 'block';
    document.getElementById('form-title').innerHTML = '<i class="fas fa-plus"></i> Add New Product';
    document.getElementById('productForm').reset();
    
    // Reset to add mode (in case we were in edit mode)
    resetFormToAddMode();
    
    // Ensure event listener is attached when form is shown
    initializeProductForm();
}

function hideProductForm() {
    document.getElementById('product-form').style.display = 'none';
    document.getElementById('message').innerHTML = '';
}

function handleProductSubmit(e) {
    e.preventDefault();
    console.log('Form submitted!'); // Debug log
    
    const formData = new FormData(e.target);
    
    console.log('FormData created:', formData); // Debug log
    
    const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow"
    };

    fetch("http://localhost/productCard/backend/add-product.php", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log('Server response:', result);
            try {
                const data = JSON.parse(result);
                if (data.success) {
                    showMessage('Product added successfully!', 'success');
                    e.target.reset();
                    hideProductForm();
                    loadProducts(); // Refresh products list
                    // Stats will be updated automatically by loadProducts()
                } else {
                    showMessage('Error: ' + data.message, 'danger');
                }
            } catch (error) {
                console.error('JSON parse error:', error);
                showMessage('Error parsing response: ' + result, 'danger');
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
            showMessage('Error: ' + error.message, 'danger');
        });
}

function loadProducts() {
    const productsTable = document.getElementById('products-table');
    if (!productsTable) return;
    
    // Show loading spinner
    productsTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading products...</p>
            </td>
        </tr>
    `;
    
    // Fetch products from the API
    fetch('http://localhost/productCard/backend/get.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Products loaded:', data);
            
            if (data.success) {
                // Check if products array exists and has items
                if (data.products && data.products.length > 0) {
                    displayProducts(data.products);
                    updateProductsCount(data.products.length);
                } else {
                    // No products found
                    showNoProductsMessage();
                    updateProductsCount(0);
                }
            } else {
                // API returned success: false
                showErrorMessage(data.message || 'Failed to load products');
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            showErrorMessage(error.message);
        });
}

function showNoProductsMessage() {
    const productsTable = document.getElementById('products-table');
    productsTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-muted py-5">
                <i class="fas fa-box-open fa-3x mb-3 text-secondary"></i>
                <h5>No products found</h5>
                <p>Start by adding your first product to the store</p>
                <button class="btn btn-primary" onclick="showAddProductForm()">
                    <i class="fas fa-plus"></i> Add First Product
                </button>
            </td>
        </tr>
    `;
}

function showErrorMessage(message) {
    const productsTable = document.getElementById('products-table');
    productsTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-danger py-4">
                <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                <h6>Error loading products</h6>
                <p class="small">${message}</p>
                <button class="btn btn-sm btn-outline-primary" onclick="loadProducts()">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </td>
        </tr>
    `;
}

function displayProducts(products) {
    const productsTable = document.getElementById('products-table');
    
    if (products.length === 0) {
        showNoProductsMessage();
        return;
    }
    
    const rows = products.map(product => {
        // Truncate description if too long
        const description = product.description ? 
            (product.description.length > 50 ? 
                product.description.substring(0, 50) + '...' : 
                product.description) : 
            'No description';
        
        // Format price
        const price = parseFloat(product.price).toFixed(2);
        
        // Handle image with proper fallback
        let imageUrl = product.image;
        if (!imageUrl || imageUrl.trim() === '') {
            imageUrl = 'images/carfuture.png';
        }
        // If it's a relative path, make sure it starts correctly
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            imageUrl = '../' + imageUrl;
        }
        
        return `
            <tr>
                <td><strong>#${product.id}</strong></td>
                <td>
                    <div class="product-image-container">
                        <img src="${imageUrl}" 
                             alt="${product.name}" 
                             class="product-image" 
                             loading="lazy"
                             onerror="handleImageError(this)"
                             onload="handleImageLoad(this)">
                        <div class="image-loading" style="display: none;">
                            <div class="spinner-border spinner-border-sm" role="status"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <strong>${product.name}</strong>
                    <br>
                    <small class="text-muted">Added: ${formatDate(product.created_at)}</small>
                </td>
                <td>
                    <span class="badge bg-success fs-6">$${price}</span>
                </td>
                <td>
                    <span class="text-muted" title="${product.description || 'No description'}">
                        ${description}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editProduct(${product.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id}, '${product.name}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    productsTable.innerHTML = rows;
}

function handleImageError(img) {
    // Hide loading spinner if exists
    const container = img.parentElement;
    const spinner = container.querySelector('.image-loading');
    if (spinner) spinner.style.display = 'none';
    
    // Set fallback image
    img.src = '../images/carfuture.png';
    img.style.opacity = '0.7';
    img.title = 'Image not found - using default';
}

function handleImageLoad(img) {
    // Hide loading spinner if exists
    const container = img.parentElement;
    const spinner = container.querySelector('.image-loading');
    if (spinner) spinner.style.display = 'none';
    
    // Show the image
    img.style.opacity = '1';
}

function updateProductsCount(count) {
    const totalProductsElement = document.getElementById('total-products');
    if (totalProductsElement) {
        totalProductsElement.textContent = count;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function editProduct(productId) {
    console.log('Edit product:', productId);
    
    // Find the product data from the current products list
    fetch('../backend/get.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.products) {
            const product = data.products.find(p => p.id == productId);
            if (product) {
                // Show the form with product data
                showEditProductForm(product);
            } else {
                showMessage('Product not found', 'danger');
            }
        }
    })
    .catch(error => {
        console.error('Error fetching product:', error);
        showMessage('Error loading product data', 'danger');
    });
}

function showEditProductForm(product) {
    // Show the product form
    document.getElementById('product-form').style.display = 'block';
    
    // Change form title
    document.getElementById('form-title').innerHTML = '<i class="fas fa-edit"></i> Edit Product';
    
    // Fill form with existing data
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image || '';
    
    // Store product ID in a hidden field or data attribute
    const form = document.getElementById('productForm');
    form.dataset.editMode = 'true';
    form.dataset.productId = product.id;
    
    // Change form submit handler
    form.removeEventListener('submit', handleProductSubmit);
    form.addEventListener('submit', handleProductUpdate);
}

function handleProductUpdate(e) {
    e.preventDefault();
    
    const form = e.target;
    const productId = form.dataset.productId;
    
    // Get form data
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const image = document.getElementById('productImage').value;
    
    // Create JSON data for PUT request
    const productData = {
        id: parseInt(productId),
        name: name,
        description: description,
        price: parseFloat(price),
        image: image
    };
    
    console.log('Updating product:', productData);
    
    // Show loading message
    showMessage('Updating product...', 'info');
    
    // Send PUT request
    fetch('../backend/update-product.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Update response:', data);
        
        if (data.success) {
            showMessage('Product updated successfully!', 'success');
            hideProductForm();
            loadProducts(); // Refresh products list
            resetFormToAddMode();
        } else {
            showMessage('Error: ' + data.message, 'danger');
        }
    })
    .catch(error => {
        console.error('Update error:', error);
        showMessage('Network error: Could not update product', 'danger');
    });
}

function resetFormToAddMode() {
    const form = document.getElementById('productForm');
    
    // Reset form title
    document.getElementById('form-title').innerHTML = '<i class="fas fa-plus"></i> Add New Product';
    
    // Reset form data attributes
    delete form.dataset.editMode;
    delete form.dataset.productId;
    
    // Reset form submit handler
    form.removeEventListener('submit', handleProductUpdate);
    form.addEventListener('submit', handleProductSubmit);
    
    // Clear form
    form.reset();
}

function deleteProduct(productId, productName) {
    console.log('Delete product:', productId, productName);
    
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`)) {
        return;
    }
    
    // Show loading state
    const deleteBtn = event.target.closest('button');
    const originalContent = deleteBtn.innerHTML;
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Prepare form data
    const formData = new FormData();
    formData.append('productId', productId);
    
    const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow"
    };
    
    // Send delete request
    fetch("http://localhost/productCard/backend/delete-product.php", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Delete response:', data);
            
            if (data.success) {
                // Show success message
                showMessage(`Product "${productName}" deleted successfully!`, 'success');
                
                // Refresh products list
                loadProducts();
            } else {
                // Show error message
                showMessage(`Error deleting product: ${data.message}`, 'danger');
                
                // Restore button
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = originalContent;
            }
        })
        .catch(error => {
            console.error('Delete error:', error);
            showMessage(`Network error: ${error.message}`, 'danger');
            
            // Restore button
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = originalContent;
        });
}

function loadOrders() {
    const ordersTable = document.getElementById('orders-table');
    if (!ordersTable) return;
    
    // Show loading spinner
    ordersTable.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading orders...</p>
            </td>
        </tr>
    `;
    
    // Simulate API call (replace with actual orders API when available)
    setTimeout(() => {
        // For now, show no orders message
        ordersTable.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-5">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-secondary"></i>
                    <h5>No orders found</h5>
                    <p>Orders will appear here when customers make purchases</p>
                </td>
            </tr>
        `;
    }, 1000);
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return;
    
    messageDiv.innerHTML = `<div class="alert alert-${type} fade-in">${message}</div>`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
}
