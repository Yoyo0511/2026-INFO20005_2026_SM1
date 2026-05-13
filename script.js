/**
 * THE LITTLE CAPSULE CO. - FULL SITE LOGIC
 * Features: Multi-item Cart, Catalog Filtering, Live Search, and Checkout Flow.
 */

// 1. GLOBAL STATE: Persistence using LocalStorage
let cart = JSON.parse(localStorage.getItem('lcc_cart')) || {};

// 2. PRODUCT DATABASE: Single source of truth for UI rendering
const productData = {
    "Cashmere Beanie": { price: 32.00, image: "beanie.webp" },
    "Cashmere Jumper": { price: 45.00, image: "jumper.webp" },
    "Cashmere Leggings": { price: 38.00, image: "leggings.webp" },
    "Cashmere Booties": { price: 18.00, image: "boots.webp" }
};

// 3. INITIALIZATION: Ensuring all UI elements are ready
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();        // Header count
    setupEventListeners(); // Add to Cart & Qty buttons
    
    // Page-Specific Logic: Checking for element presence before running
    if (document.getElementById('catalog-search')) {
        initCatalogLogic(); // Filter & Search
    }
    
    if (document.getElementById('cart-items-list')) {
        renderCart();
    }
    
    if (document.getElementById('summary-qty')) {
        renderCheckoutSummary();
    }

    if (document.getElementById('checkout-form')) {
        setupCheckoutLogic();
    }

    // Global Clear Cart Button
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('lcc_cart');
            cart = {}; 
            updateCartUI();
            renderCart();
        });
    }
});

/**
 * CATALOG LOGIC: Filtering & Live Search
 * Student Note: I am using 'Attribute Selection' to hide/show cards.
 */
function initCatalogLogic() {
    const searchInput = document.getElementById('catalog-search');
    const filterButtons = document.querySelectorAll('.pill');
    const productCards = document.querySelectorAll('.product-card');

    // 1. PILL FILTERING
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // UI Update: Toggle active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Show card if 'all' is selected or if it matches the specific filter
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 2. SEARCH BAR LOGIC
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();

            productCards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                
                // Simple string matching for live search
                if (title.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/**
 * CART LOGIC: UI Counters & Rendering
 */
function updateCartUI() {
    const cartElement = document.getElementById('cart-count');
    if (cartElement) {
        const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
        cartElement.innerText = `🛒 (${totalItems})`;
    }
}

function setupEventListeners() {
    const addBtn = document.getElementById('add-to-cart-btn');
    const plusBtn = document.getElementById('plus');
    const minusBtn = document.getElementById('minus');
    const qtySpan = document.getElementById('qty');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const productName = document.querySelector('h1').innerText;
            const currentQty = parseInt(qtySpan.innerText);
            
            cart[productName] = (cart[productName] || 0) + currentQty;
            localStorage.setItem('lcc_cart', JSON.stringify(cart));
            
            addBtn.innerText = "Added!";
            updateCartUI();
            setTimeout(() => { addBtn.innerText = "Add to Bag"; }, 2000);
        });
    }

    if (plusBtn) plusBtn.addEventListener('click', () => { qtySpan.innerText = parseInt(qtySpan.innerText) + 1; });
    if (minusBtn) minusBtn.addEventListener('click', () => {
        let val = parseInt(qtySpan.innerText);
        if (val > 1) qtySpan.innerText = val - 1;
    });
}

function renderCart() {
    const cartList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    let subtotal = 0;

    if (Object.keys(cart).length > 0) {
        cartList.innerHTML = ''; 
        for (const [name, qty] of Object.entries(cart)) {
            const itemInfo = productData[name] || { price: 0, image: "placeholder.webp" };
            const itemTotal = itemInfo.price * qty;
            subtotal += itemTotal;

            cartList.insertAdjacentHTML('beforeend', `
                <div class="cart-item-row">
                    <img src="${itemInfo.image}" alt="${name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h3>${name}</h3>
                        <p>Qty: ${qty} • $${itemInfo.price.toFixed(2)} ea</p>
                        <button class="remove-item-btn" data-name="${name}">Remove 1</button>
                    </div>
                    <div class="cart-item-price"><strong>$${itemTotal.toFixed(2)}</strong></div>
                </div>
            `);
        }
        subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
        setupRemoveButtons(); 
    } else {
        cartList.innerHTML = '<div class="empty-cart-msg">Your bag is currently empty.</div>';
        subtotalEl.innerText = "$0.00";
    }
}

function setupRemoveButtons() {
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            if (cart[name] > 1) {
                cart[name] -= 1;
            } else {
                delete cart[name];
            }
            localStorage.setItem('lcc_cart', JSON.stringify(cart));
            updateCartUI();
            renderCart();
        });
    });
}

function renderCheckoutSummary() {
    const summaryQty = document.getElementById('summary-qty');
    const summaryTotal = document.getElementById('summary-total');
    let totalQty = 0, totalPrice = 0;

    for (const [name, qty] of Object.entries(cart)) {
        totalQty += qty;
        totalPrice += (productData[name]?.price || 0) * qty;
    }

    if (summaryQty) summaryQty.innerText = totalQty;
    if (summaryTotal) summaryTotal.innerText = `$${totalPrice.toFixed(2)}`;
}

function setupCheckoutLogic() {
    const checkoutForm = document.getElementById('checkout-form');
    const successState = document.getElementById('success-state');

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('complete-btn');
        btn.innerText = "Processing...";
        btn.disabled = true;

        setTimeout(() => {
            localStorage.removeItem('lcc_cart');
            cart = {}; 
            successState.classList.remove('hidden');
            window.scrollTo(0, 0);
        }, 2000);
    });
}