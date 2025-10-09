const products = [
    {
        image:"images/carfuture.png",
        id:1,
        name:"camera",
        price: 3000
    }, 
    {
        image:"images/carfuture.png",
        id:2,
        name:"laptop",
        price: 5000
    },
    {
        image:"images/carfuture.png",
        id:3,
        name:"phone",
        price: 2000
    },
    {
        image:"images/carfuture.png",
        id:4,
        name:"watch",
        price: 1000
    }

]

const productCard = document.getElementById("product-list")

products.forEach(product => {
    productCard.innerHTML += `
    <div class="col">
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Price: $${product.price}</p>
            <button class="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
});