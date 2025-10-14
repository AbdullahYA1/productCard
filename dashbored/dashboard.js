// Simple Admin Dashboard JavaScript for Beginners
class SimpleDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.isLoggedIn = false;
        this.currentEditId = null;
        this.currentDeleteId = null;
        
        // Sample data for demonstration
        this.products = [
            { id: 1, name: 'iPhone 15', price: 999.99, description: 'Latest iPhone model', image: 'https://via.placeholder.com/50x50' },
            { id: 2, name: 'Samsung Galaxy S24', price: 899.99, description: 'Premium Android phone', image: 'https://via.placeholder.com/50x50' },
            { id: 3, name: 'MacBook Pro', price: 1999.99, description: 'Professional laptop', image: 'https://via.placeholder.com/50x50' },
            { id: 4, name: 'iPad Air', price: 599.99, description: 'Tablet for work and play', image: 'https://via.placeholder.com/50x50' }
        ];
        
        this.orders = [
            { id: 1001, customerName: 'John Doe', email: 'john@example.com', date: '2024-01-15', items: 2, total: 1599.98, status: 'completed' },
            { id: 1002, customerName: 'Jane Smith', email: 'jane@example.com', date: '2024-01-14', items: 1, total: 999.99, status: 'pending' },
            { id: 1003, customerName: 'Bob Johnson', email: 'bob@example.com', date: '2024-01-13', items: 3, total: 2899.97, status: 'completed' },
            { id: 1004, customerName: 'Alice Brown', email: 'alice@example.com', date: '2024-01-12', items: 1, total: 599.99, status: 'cancelled' }
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkLoginStatus();
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Product form
        document.getElementById('productForm')?.addEventListener('submit', (e) => this.handleProductSubmit(e));
        
        // Delete confirmation
        document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => this.confirmDelete());
    }

    // Authentication
    checkLoginStatus() {
        // Check if user is logged in (in real app, check session/token)
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        if (isLoggedIn) {
            this.isLoggedIn = true;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        // Simple demo login (in real app, validate against server)
        if (email === 'admin@hashplus.com' && password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            this.isLoggedIn = true;
            this.showDashboard();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid credentials. Use admin@hashplus.com / admin123', 'danger');
        }
    }

    logout() {
        localStorage.removeItem('adminLoggedIn');
        this.isLoggedIn = false;
        this.showLogin();
        this.showNotification('Logged out successfully', 'info');
    }

    showLogin() {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('dashboard-content').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
        this.loadOverview();
    }

    // Section Management
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Update active nav link
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');

        this.currentSection = sectionName;

        // Load section data
        switch(sectionName) {
            case 'overview':
                this.loadOverview();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'orders':
                this.loadOrders();
                break;
        }
    }

    // Overview/Dashboard
    loadOverview() {
        this.updateStatistics();
        this.loadRecentOrders();
    }

    updateStatistics() {
        // Calculate statistics from sample data
        const totalProducts = this.products.length;
        const totalOrders = this.orders.length;
        const totalRevenue = this.orders.filter(o => o.status === 'completed')
            .reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;

        // Update dashboard cards
        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('pending-orders').textContent = pendingOrders;
    }

    loadRecentOrders() {
        const recentOrders = this.orders.slice(0, 5); // Get last 5 orders
        const tbody = document.getElementById('recent-orders-table');
        
        if (!tbody) return;

        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.date}</td>
                <td>$${order.total}</td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(order.status)}">
                        ${order.status.toUpperCase()}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // Product Management
    loadProducts() {
        this.renderProductsTable(this.products);
    }

    renderProductsTable(products) {
        const tbody = document.getElementById('products-table');
        if (!tbody) return;

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>#${product.id}</td>
                <td>
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td class="text-truncate" style="max-width: 200px;">${product.description}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary" onclick="dashboard.editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="dashboard.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showAddProductForm() {
        document.getElementById('form-title').innerHTML = '<i class="fas fa-plus"></i> Add New Product';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('product-form').style.display = 'block';
        document.getElementById('productName').focus();
    }

    hideProductForm() {
        document.getElementById('product-form').style.display = 'none';
        document.getElementById('productForm').reset();
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        // Populate form with product data
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image;

        document.getElementById('form-title').innerHTML = '<i class="fas fa-edit"></i> Edit Product';
        document.getElementById('product-form').style.display = 'block';
        this.currentEditId = id;
    }

    handleProductSubmit(e) {
        e.preventDefault();
        
        const formData = {
            id: document.getElementById('productId').value,
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            image: document.getElementById('productImage').value || 'https://via.placeholder.com/50x50'
        };

        if (formData.id) {
            // Update existing product
            const index = this.products.findIndex(p => p.id == formData.id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...formData };
                this.showNotification('Product updated successfully!', 'success');
            }
        } else {
            // Add new product
            formData.id = Math.max(...this.products.map(p => p.id)) + 1;
            this.products.push(formData);
            this.showNotification('Product added successfully!', 'success');
        }

        this.hideProductForm();
        this.loadProducts();
        this.updateStatistics(); // Update counts
    }

    deleteProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        this.currentDeleteId = id;
        document.getElementById('deleteItemInfo').textContent = `Product: ${product.name}`;
        new bootstrap.Modal(document.getElementById('deleteModal')).show();
    }

    confirmDelete() {
        if (this.currentDeleteId) {
            this.products = this.products.filter(p => p.id !== this.currentDeleteId);
            this.showNotification('Product deleted successfully!', 'success');
            this.loadProducts();
            this.updateStatistics();
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
            this.currentDeleteId = null;
        }
    }

    // Order Management
    loadOrders() {
        this.renderOrdersTable(this.orders);
    }

    renderOrdersTable(orders) {
        const tbody = document.getElementById('orders-table');
        if (!tbody) return;

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.email}</td>
                <td>${order.date}</td>
                <td>${order.items}</td>
                <td>$${order.total}</td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(order.status)}">
                        ${order.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary" onclick="dashboard.showOrderDetails(${order.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const orderDetails = `
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="fas fa-info-circle"></i> Order Information</h6>
                    <p><strong>Order #:</strong> #${order.id}</p>
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Items:</strong> ${order.items}</p>
                    <p><strong>Total:</strong> $${order.total}</p>
                    <p><strong>Status:</strong> 
                        <span class="badge ${this.getStatusBadgeClass(order.status)}">
                            ${order.status.toUpperCase()}
                        </span>
                    </p>
                </div>
                <div class="col-md-6">
                    <h6><i class="fas fa-user"></i> Customer Information</h6>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                </div>
            </div>
        `;
        
        document.getElementById('orderModalBody').innerHTML = orderDetails;
        new bootstrap.Modal(document.getElementById('orderModal')).show();
    }

    // Search and Filter Functions
    searchOrders() {
        const query = document.getElementById('order-search').value.toLowerCase();
        const filtered = this.orders.filter(order => 
            order.customerName.toLowerCase().includes(query) ||
            order.email.toLowerCase().includes(query) ||
            order.id.toString().includes(query)
        );
        this.renderOrdersTable(filtered);
    }

    filterOrders() {
        const statusFilter = document.getElementById('order-status-filter').value;
        const dateFilter = document.getElementById('order-date-filter').value;
        
        let filtered = this.orders;
        
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }
        
        if (dateFilter) {
            filtered = filtered.filter(order => order.date === dateFilter);
        }
        
        this.renderOrdersTable(filtered);
    }

    // Utility Functions
    getStatusBadgeClass(status) {
        const statusClasses = {
            'completed': 'bg-success',
            'pending': 'bg-warning',
            'cancelled': 'bg-danger',
            'processing': 'bg-info',
            'shipped': 'bg-primary'
        };
        return statusClasses[status] || 'bg-secondary';
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show notification`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
}

// Global Functions for onclick handlers
function showSection(sectionName) {
    dashboard.showSection(sectionName);
}

function showAddProductForm() {
    dashboard.showAddProductForm();
}

function hideProductForm() {
    dashboard.hideProductForm();
}

function searchOrders() {
    dashboard.searchOrders();
}

function filterOrders() {
    dashboard.filterOrders();
}

function logout() {
    dashboard.logout();
}

// Initialize Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new SimpleDashboard();
});

// PHP Integration Examples (commented out - for reference)
/*
// Example: Save product to PHP backend
async function saveProductToPHP(productData) {
    try {
        const response = await fetch('api/products.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Product saved:', result);
            return result;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error saving product:', error);
        throw error;
    }
}

// Example: Load products from PHP backend
async function loadProductsFromPHP() {
    try {
        const response = await fetch('api/products.php');
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        throw error;
    }
}

// Example: Delete product via PHP backend
async function deleteProductFromPHP(productId) {
    try {
        const response = await fetch(`api/products.php?id=${productId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}
*/
