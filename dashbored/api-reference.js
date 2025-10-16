/**
 * API REFERENCE FOR STUDENTS
 * ==========================
 * Simple examples of fetch operations for product management
 */

// =============================================================================
// 1. ADD PRODUCT API
// =============================================================================
// Endpoint: POST ../backend/add-product.php
// Data: FormData with name, description, price, image

function exampleAddProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    fetch("../backend/add-product.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        const data = JSON.parse(result);
        if (data.success) {
            console.log('Product added successfully');
        } else {
            console.log('Error:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// =============================================================================
// 2. GET PRODUCTS API
// =============================================================================
// Endpoint: POST ../backend/get.php
// Data: JSON empty object

function exampleGetProducts() {
    fetch('../backend/get.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.products) {
            console.log('Products loaded:', data.products);
        }
    })
    .catch(error => console.error('Error:', error));
}

// =============================================================================
// 3. UPDATE PRODUCT API
// =============================================================================
// Endpoint: PUT ../backend/update-product.php
// Data: JSON with id, name, description, price, image

function exampleUpdateProduct(productId, productData) {
    const updateData = {
        id: productId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: productData.image
    };
    
    fetch('../backend/update-product.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Product updated successfully');
        } else {
            console.log('Error:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// =============================================================================
// 4. DELETE PRODUCT API
// =============================================================================
// Endpoint: POST ../backend/delete-product.php
// Data: FormData with id

function exampleDeleteProduct(productId) {
    const formData = new FormData();
    formData.append('id', productId);
    
    fetch('../backend/delete-product.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Product deleted successfully');
        } else {
            console.log('Error:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
