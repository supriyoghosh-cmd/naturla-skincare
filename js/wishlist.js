function toggleWishlistSidebar() {
    const sidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        document.body.classList.toggle('no-scroll', sidebar.classList.contains('open'));
    }
}

function closeWishlistSidebar() {
    const sidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.classList.remove('no-scroll');
    }
}

function renderWishlist() {
    const wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];
    const container = document.getElementById('wishlist-items');
    
    if (!container) return;
    
    if (wishlistIds.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <i class="far fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Add items you love to your wishlist</p>
                <a href="shop.html" class="btn btn-primary ewcs_btn">Continue Shopping</a>
            </div>
        `;
        updateWishlistCount();
        return;
    }
    
    fetch('products.json')
        .then(res => res.json())
        .then(products => {
            const wishlistProducts = products.filter(product => 
                wishlistIds.includes(String(product.id))
            );
            
            if (wishlistProducts.length === 0) {
                container.innerHTML = `
                    <div class="empty-wishlist">
                        <i class="far fa-heart"></i>
                        <h3>Your wishlist is empty</h3>
                        <p>Add items you love to your wishlist</p>
                        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                `;
                updateWishlistCount();
                return;
            }
            
            container.innerHTML = wishlistProducts.map(product => {
                const price = parseFloat(product.price) || 0;
                const discount = product.discount || 0;
                const discountedPrice = price - (price * discount / 100);
                
                return `
                    <div class="wishlist-card">
                        <div class="wishlist-img-container">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="wishlist-card-body">
                            <h3 class="product-name">${product.name}</h3>
                            <div class="price-container">
                                ${discount > 0 ? `
                                    <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
                                    <span class="original-price wishlistOriginal-price">$${price.toFixed(2)}</span>
                                    <span class="discount-badge wishlistDiscount-badge">-${discount}%</span>
                                ` : `
                                    <span>$${price.toFixed(2)}</span>
                                `}
                            </div>
                            <div class="wishlist-actions">
                                <button class="move-to-cart" data-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                                <button class="remove-btn" data-id="${product.id}">
                                    <i class="fa-solid fa-trash-can"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add event listeners
            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const productId = this.getAttribute('data-id');
                    removeFromWishlist(productId);
                });
            });
            
            document.querySelectorAll('.move-to-cart').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const productId = this.getAttribute('data-id');
                    const product = wishlistProducts.find(p => p.id == productId);
                    if (product) {
                        moveToCart(product);
                    }
                });
            });
            
            updateWishlistCount();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            container.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error loading wishlist</h3>
                    <p>Please try again later</p>
                </div>
            `;
        });
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.map(String);
    const idStr = String(productId);
    wishlist = wishlist.filter(id => id !== idStr);
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlist();
    updateWishlistCount();
    
    // Close sidebar if wishlist is empty
    if (wishlist.length === 0) {
        closeWishlistSidebar();
    }
}

function moveToCart(product) {
    if (!product) return;
    
    // Add to cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    removeFromWishlist(product.id);
    updateCartCount();
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<span>${product.name} added to cart!</span>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
    updateCartCount();
    updateWishlistCount();
});

window.renderWishlist = renderWishlist;