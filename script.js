// Global Cart Logic
let cartCount = parseInt(localStorage.getItem('cartTotal')) || 0;

// Update UI on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupEventListeners();
    const cartList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const clearBtn = document.getElementById('clear-cart');

    // If we are on the Cart page, render the items
    if (cartList) {
        renderCart();
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('cartTotal');
            location.reload(); // Refresh to show empty state
        });
    }
});

function updateCartUI() {
    const cartElement = document.getElementById('cart-count');
    if (cartElement) {
        cartElement.innerText = `🛒 (${cartCount})`;
    }
}

function setupEventListeners() {
    const addBtn = document.getElementById('add-to-cart-btn');
    const plusBtn = document.getElementById('plus');
    const minusBtn = document.getElementById('minus');
    const qtySpan = document.getElementById('qty');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const currentQty = parseInt(qtySpan.innerText);
            cartCount += currentQty;
            
            // Save to local storage
            localStorage.setItem('cartTotal', cartCount);
            
            // Visual Feedback
            addBtn.innerText = "Added!";
            updateCartUI();
            
            setTimeout(() => {
                addBtn.innerText = "Add to Bag";
            }, 2000);
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            let val = parseInt(qtySpan.innerText);
            qtySpan.innerText = val + 1;
        });
    }

    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            let val = parseInt(qtySpan.innerText);
            if (val > 1) qtySpan.innerText = val - 1;
        });
    }
    
    const summaryQty = document.getElementById('summary-qty');
    const summaryTotal = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const successState = document.getElementById('success-state');

    if (summaryQty) {
        summaryQty.innerText = cartCount;
        summaryTotal.innerText = `$${(cartCount * 32.00).toFixed(2)}`; // Mock price calculation
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const btn = document.getElementById('complete-btn');
            btn.innerText = "Processing...";
            btn.disabled = true;

            setTimeout(() => {
                localStorage.removeItem('cartTotal'); 
                // This removes the 'display: none !important' 
                successState.classList.remove('hidden');
            }, 2000);
        });
    }
}

function renderCart() {
    const cartList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const currentCount = parseInt(localStorage.getItem('cartTotal')) || 0;

    if (currentCount > 0) {
        // Clear the 'empty' message
        cartList.innerHTML = ''; 

        // placeholder only beanie
        const itemHtml = `
            <div class="cart-item-row">
                <img src="beanie.webp" class="cart-item-img">
                <div class="cart-item-info">
                    <h3>Cashmere Beanie</h3>
                    <p>Qty: ${currentCount}</p>
                    <p>Price: $32.00</p>
                </div>
            </div>
        `;
        cartList.innerHTML = itemHtml;
        subtotalEl.innerText = `$${(currentCount * 32.00).toFixed(2)}`;
    }
}