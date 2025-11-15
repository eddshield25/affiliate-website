// script.js
// Sample initial products
let products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        affiliateLink: "https://example.com/affiliate/headphones"
    },
    {
        id: 2,
        title: "Smart Fitness Watch",
        description: "Track your heart rate, steps, sleep, and more with this advanced fitness watch.",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        affiliateLink: "https://example.com/affiliate/watch"
    },
    {
        id: 3,
        title: "Portable Bluetooth Speaker",
        description: "Waterproof speaker with 360-degree sound and 12-hour battery life.",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        affiliateLink: "https://example.com/affiliate/speaker"
    }
];

// Cart array
let cart = [];

// DOM Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav a');
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav');
const productsContainer = document.getElementById('products-container');
const checkoutItems = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutRedirect = document.getElementById('checkout-redirect');
const adminProductsList = document.getElementById('admin-products-list');
const productForm = document.getElementById('product-form');
const saveProductBtn = document.getElementById('save-product');
const cancelEditBtn = document.getElementById('cancel-edit');
const productIdInput = document.getElementById('product-id');
const productTitleInput = document.getElementById('product-title');
const productDescriptionInput = document.getElementById('product-description');
const productPriceInput = document.getElementById('product-price');
const productImageInput = document.getElementById('product-image');
const productAffiliateInput = document.getElementById('product-affiliate');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    displayAdminProducts();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page') + '-page';
            showPage(pageId);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Product form submission
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });

    // Cancel edit
    cancelEditBtn.addEventListener('click', function() {
        resetForm();
    });

    // Checkout redirect
    checkoutRedirect.addEventListener('click', function(e) {
        e.preventDefault();
        // In a real implementation, this would redirect to the main affiliate site
        alert('Redirecting to main affiliate site for checkout...');
        // window.location.href = 'https://main-affiliate-site.com/checkout';
    });
}

// Show specific page and hide others
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Display products on the home page
function displayProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <a href="#" class="btn btn-buy" data-id="${product.id}">Buy Now</a>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });

    // Add event listeners to buy buttons
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            showPage('checkout-page');
            
            // Update nav active state
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('nav a[data-page="checkout"]').classList.add('active');
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCheckout();
    }
}

// Update checkout display
function updateCheckout() {
    checkoutItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <span>${item.title}</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(checkoutItem);
        total += item.price;
    });
    
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// Display products in admin panel
function displayAdminProducts() {
    adminProductsList.innerHTML = '';
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'admin-product-item';
        productItem.innerHTML = `
            <div>
                <h4>${product.title}</h4>
                <p>$${product.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="btn edit-product" data-id="${product.id}">Edit</button>
                <button class="btn btn-danger delete-product" data-id="${product.id}">Delete</button>
            </div>
        `;
        adminProductsList.appendChild(productItem);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });

    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

// Save product (add or update)
function saveProduct() {
    const id = productIdInput.value ? parseInt(productIdInput.value) : Date.now();
    const title = productTitleInput.value;
    const description = productDescriptionInput.value;
    const price = parseFloat(productPriceInput.value);
    const image = productImageInput.value;
    const affiliateLink = productAffiliateInput.value;

    if (productIdInput.value) {
        // Update existing product
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { id, title, description, price, image, affiliateLink };
        }
    } else {
        // Add new product
        products.push({ id, title, description, price, image, affiliateLink });
    }

    resetForm();
    displayProducts();
    displayAdminProducts();
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        productIdInput.value = product.id;
        productTitleInput.value = product.title;
        productDescriptionInput.value = product.description;
        productPriceInput.value = product.price;
        productImageInput.value = product.image;
        productAffiliateInput.value = product.affiliateLink;
        
        saveProductBtn.textContent = 'Update Product';
        cancelEditBtn.style.display = 'inline-block';
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        displayProducts();
        displayAdminProducts();
    }
}

// Reset form
function resetForm() {
    productForm.reset();
    productIdInput.value = '';
    saveProductBtn.textContent = 'Add Product';
    cancelEditBtn.style.display = 'none';
}