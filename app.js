const products = [
    { image: "images/carfuture.png", id: 1, name: "camera", price: 3000 },
    { image: "images/carfuture.png", id: 2, name: "laptop", price: 5000 },
    { image: "images/carfuture.png", id: 3, name: "phone", price: 2000 },
    { image: "images/carfuture.png", id: 4, name: "watch", price: 1000 }
];

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

// Render products (with a data-id for the button)
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

// Attach click listeners to "Add to Cart" buttons (beginner-friendly)
document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = products.find((p) => p.id === id);
        if (item) {
            cart.push(item);
            updateCartUI();
        }
    });
});

// Update sidebar list, total and count (minimal)
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
                (item) => `
                <div class="cart-item" style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid #eee;">
                    <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;">
                    <div style="flex:1;">
                        <div style="font-weight:600;">${item.name}</div>
                        <div style="color:#e74c3c;">$${item.price}</div>
                    </div>
                </div>`
            )
            .join("");

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalAmount.textContent = total.toFixed(2);
        cartTotal.style.display = "block";
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
