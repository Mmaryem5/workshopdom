// Shopping Cart JavaScript
class ShoppingCart {
    constructor() {
        this.items = [];
        this.taxRate = 0.08; // 8% tax
        this.init();
    }

    init() {
        this.loadItems();
        this.setupEventListeners();
        // Initialize all quantities to 0
        this.initializeQuantitiesToZero();
        this.updateTotal();
    }

    loadItems() {
        // Get all cart items from DOM
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach(item => {
            const itemData = {
                id: item.dataset.id,
                price: parseFloat(item.dataset.price),
                quantity: parseInt(item.querySelector('.quantity').textContent),
                element: item
            };
            this.items.push(itemData);
        });
    }

    initializeQuantitiesToZero() {
        // Set all quantities to 0 and disable minus buttons
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach(item => {
            const quantitySpan = item.querySelector('.quantity');
            const minusBtn = item.querySelector('.minus-btn');
            
            quantitySpan.textContent = '0';
            minusBtn.disabled = true;
            
            // Update item data
            const itemId = item.dataset.id;
            const itemData = this.items.find(item => item.id === itemId);
            if (itemData) {
                itemData.quantity = 0;
            }
        });
    }

    setupEventListeners() {
        // Quantity buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('plus-btn')) {
                this.increaseQuantity(e.target);
            } else if (e.target.classList.contains('minus-btn')) {
                this.decreaseQuantity(e.target);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteItem(e.target);
            } else if (e.target.classList.contains('like-btn') || e.target.closest('.like-btn')) {
                this.toggleLike(e.target.closest('.like-btn') || e.target);
            }
        });

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    increaseQuantity(button) {
        const cartItem = button.closest('.cart-item');
        const quantitySpan = cartItem.querySelector('.quantity');
        const currentQuantity = parseInt(quantitySpan.textContent);
        
        // Update quantity
        quantitySpan.textContent = currentQuantity + 1;
        
        // Update minus button state
        const minusBtn = cartItem.querySelector('.minus-btn');
        minusBtn.disabled = false;
        
        // Update item in our data
        const itemId = cartItem.dataset.id;
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = currentQuantity + 1;
        }
        
        this.updateTotal();
        this.animateButton(button);
    }

    decreaseQuantity(button) {
        const cartItem = button.closest('.cart-item');
        const quantitySpan = cartItem.querySelector('.quantity');
        const currentQuantity = parseInt(quantitySpan.textContent);
        
        if (currentQuantity > 0) {
            // Update quantity
            quantitySpan.textContent = currentQuantity - 1;
            
            // Update minus button state
            if (currentQuantity - 1 === 0) {
                button.disabled = true;
            }
            
            // Update item in our data
            const itemId = cartItem.dataset.id;
            const item = this.items.find(item => item.id === itemId);
            if (item) {
                item.quantity = currentQuantity - 1;
            }
            
            this.updateTotal();
            this.animateButton(button);
        }
    }

    deleteItem(button) {
        const cartItem = button.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        
        // Add removal animation
        cartItem.classList.add('removing');
        
        // Remove from DOM after animation
        setTimeout(() => {
            cartItem.remove();
            
            // Remove from our data
            this.items = this.items.filter(item => item.id !== itemId);
            
            this.updateTotal();
            this.checkEmptyCart();
        }, 500);
    }

    toggleLike(button) {
        const isLiked = button.dataset.liked === 'true';
        
        if (isLiked) {
            button.dataset.liked = 'false';
            button.classList.remove('liked');
        } else {
            button.dataset.liked = 'true';
            button.classList.add('liked');
        }
        
        // Animate the heart
        this.animateHeart(button);
    }

    updateTotal() {
        const subtotal = this.calculateSubtotal();
        const tax = subtotal * this.taxRate;
        const total = subtotal + tax;
        
        // Update display
        document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.total-price').textContent = `$${total.toFixed(2)}`;
    }

    calculateSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    checkEmptyCart() {
        const cartItems = document.querySelector('.cart-items');
        if (cartItems.children.length === 0) {
            // Show empty cart message
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-cart';
            emptyMessage.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6c757d;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                </div>
            `;
            cartItems.appendChild(emptyMessage);
            
            // Update summary to show zero
            document.querySelector('.subtotal').textContent = '$0.00';
            document.querySelector('.tax').textContent = '$0.00';
            document.querySelector('.total-price').textContent = '$0.00';
        }
    }

    animateButton(button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }

    animateHeart(button) {
        const icon = button.querySelector('i');
        icon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 200);
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const total = this.calculateSubtotal() * (1 + this.taxRate);
        alert(`Thank you for your purchase!\nTotal: $${total.toFixed(2)}`);
        
        // Clear cart
        this.items = [];
        document.querySelector('.cart-items').innerHTML = '';
        this.updateTotal();
        this.checkEmptyCart();
    }
}

// Initialize shopping cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});

// Additional utility functions for enhanced user experience
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard support for quantity controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === '+') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('plus-btn')) {
                activeElement.click();
            }
        } else if (e.key === 'ArrowDown' || e.key === '-') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('minus-btn')) {
                activeElement.click();
            }
        }
    });

    // Add tooltips for better UX
    const tooltips = {
        '.like-btn': 'Click to like this item',
        '.delete-btn': 'Remove item from cart',
        '.plus-btn': 'Increase quantity',
        '.minus-btn': 'Decrease quantity',
        '.checkout-btn': 'Complete your purchase'
    };

    Object.entries(tooltips).forEach(([selector, text]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.title = text;
        });
    });

    // Add loading animation for better perceived performance
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}); 