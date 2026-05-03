// Global Cart Logic
let cartCount = parseInt(localStorage.getItem('cartTotal')) || 0;

// Update UI on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupEventListeners();
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
}