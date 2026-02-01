/* ---------------- LOGIN ---------------- */
function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert("Login successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "index.html";
    } else {
        alert("Invalid email or password.");
    }
}

document.getElementById("loginForm")?.addEventListener("submit", loginUser);

/* ---------------- REGISTER ---------------- */
function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) {
        alert("Email already registered.");
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please login.");
    window.location.href = "login.html";
}

document.getElementById("registerForm")?.addEventListener("submit", registerUser);

/* ---------------- PRODUCTS / ADD TO CART ---------------- */
const allProducts = [
    {id:1,name:"Wireless Headphones",price:49.99,category:"Electronics",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",description:"Noise cancelling headphones"},
    {id:2,name:"Smart Watch",price:89.99,category:"Electronics",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",description:"Fitness & GPS smart watch"},
    {id:3,name:"Laptop Backpack",price:29.99,category:"Fashion",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",description:"Waterproof backpack"},
    {id:4,name:"Bluetooth Speaker",price:39.99,category:"Electronics",image:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",description:"Portable speaker"},
    {id:5,name:"Running Shoes",price:59.99,category:"Sports",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",description:"Comfort running shoes"},
    {id:6,name:"Coffee Maker",price:79.99,category:"Home",image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",description:"Automatic coffee maker"},
    {id:7,name:"Gaming Mouse",price:34.99,category:"Electronics",image:"https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",description:"RGB gaming mouse"},
    {id:8,name:"Desk Lamp",price:24.99,category:"Home",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",description:"LED desk lamp"}
];

function addToCart(productId){
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = allProducts.find(p => p.id === productId);

    const existing = cart.find(item => item.id === productId);
    if(existing){
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity:1});
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(product.name + " added to cart!");
    updateCartCount();
}

/* ---------------- CART PAGE ---------------- */
function loadCart(){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    if(!container) return;

    container.innerHTML='';
    if(cart.length===0){
        container.innerHTML = `<div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Add some products first.</p>
            <a href="products.html" style="padding:10px 20px; background:#3498db;color:white;border-radius:6px;text-decoration:none;">Browse Products</a>
        </div>`;
        document.getElementById('cart-summary').style.display='none';
        return;
    }

    document.getElementById('cart-summary').style.display='block';
    cart.forEach((item,index)=>{
        const card = document.createElement('div');
        card.className='cart-card';
        card.innerHTML=`
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="cart-price">$${item.price.toFixed(2)}</div>
                <div class="cart-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(${index},-1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${index},1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    updateSummary();
}

function changeQuantity(index,delta){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeItem(index){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index,1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function updateSummary(){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal=0;
    cart.forEach(item => subtotal += item.price * item.quantity);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    document.getElementById('subtotal')?.textContent = subtotal.toFixed(2);
    document.getElementById('tax')?.textContent = tax.toFixed(2);
    document.getElementById('total')?.textContent = total.toFixed(2);
    updateCartCount();
}

function checkout(){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cart.length===0){ alert("Cart is empty!"); return; }
    alert("Checkout successful! Total: $" + document.getElementById('total').textContent);
    localStorage.removeItem('cart');
    loadCart();
}

function updateCartCount(){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum,item)=>sum+item.quantity,0);
    document.getElementById('cart-count')?.textContent = count;
}

/* ---------------- INITIALIZE ---------------- */
document.addEventListener('DOMContentLoaded', ()=>{
    loadCart();
    updateCartCount();
});
