
// Basic DOM refs
const productCard = document.getElementById("product-list");
const cartBtn = document.getElementById("cartBtn");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const totalAmount = document.getElementById("totalAmount");
const cartTotal = document.getElementById("cartTotal");

// Very simple cart (array of items, duplicates allowed)
let cart = [];

const requestOptions = {
    method: "GET",
    redirect: "follow"
};

fetch("backend/get.php", requestOptions)
    .then((response) => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log('API payload:', data);
        // Backend returns an envelope: { success: boolean, products: [] }
        if (data && data.success === true && Array.isArray(data.products)) {
            renderProducts(data.products);
            return;
        }

        // If backend returned success:false or unexpected format, surface the message
        const message = data && data.message ? data.message : 'Invalid API response';
        throw new Error(message);
    })
    .catch((error) => {
        console.error('Error fetching products from backend:', error);
        productCard.innerHTML = `<div class="col-12"><div class="alert alert-danger">Failed to load products: ${error.message}</div></div>`;
    });


function renderProducts(products) {
    // Defensive guards
    if (!Array.isArray(products)) {
        console.error('renderProducts expected an array but got:', products);
        productCard.innerHTML = '<div class="col-12"><div class="alert alert-danger">Unexpected data format from server.</div></div>';
        return;
    }

    if (products.length === 0) {
        productCard.innerHTML = '<div class="col-12"><div class="alert alert-info">No products available.</div></div>';
        return;
    }
    
    // Clear existing cards before rendering
    productCard.innerHTML = '';
    
    products.forEach((product) => {
      productCard.innerHTML += `
        <div class="col">
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Price: $${product.price}</p>
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    });

    // Attach click listeners to "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            const item = products.find((p) => p.id == id); // Use == to compare string/number
            if (item) {
                // Convert price to number for cart calculations
                const cartItem = {
                    ...item,
                    price: parseFloat(item.price),
                    id: parseInt(item.id)
                };
                cart.push(cartItem);
                updateCartUI();
            }
        });
    });
}

function updateCartUI() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa fa-shopping-bag"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.style.display = "none";
    } else {
        cartItems.innerHTML = cart
            .map(
                (item, index) => `  //products =[name price image] items[[0]laptop , ]
                <div class="cart-item" style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid #eee;">
                    <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;">
                    <div style="flex:1;">
                        <div style="font-weight:600;">${item.name}</div>
                        <div style="color:#e74c3c;">$${item.price}</div>
                    </div>
                    <button class="remove-from-cart" data-index="${index}" title="Remove from cart">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>`
            )
            .join("");

        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        totalAmount.textContent = total.toFixed(2);
        cartTotal.style.display = "block";
        
        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-from-cart").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                cart.splice(index, 1); // Remove item at specific index
                updateCartUI(); // Refresh the cart display
            });
        });
    }

    cartCount.textContent = String(cart.length);
}

// Toggle sidebar open/close using existing CSS class `.open`
cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartSidebar.classList.toggle("open");
});

cartCloseBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
});
