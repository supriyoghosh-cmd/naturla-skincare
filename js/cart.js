let cart = JSON.parse(localStorage.getItem('cart')) || [];
const container = document.getElementById('cart-container');
const totalPriceElem = document.getElementById('total-price');
const deliveryCharge = 20.00;
const freeDeliveryThreshold = 300.00;

function renderCart() {
    container.innerHTML = '';
    let subtotal = 0;
    let totalDiscount = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <h2>Your beauty bag is empty ✨</h2>
                <p>Let's find the perfect glow-up essentials.</p>
                <a href="shop.html" class="shop-now-btn">Shop Now</a>
            </div>
        `;
        totalPriceElem.style.display = 'none';
        document.querySelector('.cart-right').style.display = 'none';
        updateCartCount();
        return;
    } else {
        document.querySelector('.cart-right').style.display = 'block';
        totalPriceElem.style.display = 'block';
    }

    cart.forEach((item, index) => {
        const price = parseFloat(item.price);
        const discount = item.discount || 0;
        const discountedPrice = price - (price * discount / 100);
        const itemTotal = discountedPrice * item.quantity;
        subtotal += price * item.quantity;
        totalDiscount += (price - discountedPrice) * item.quantity;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
      <div>
       <div class="cartCard_top">
        <img src="${item.image}" alt="${item.name}" />
            <div>
                <h2>${item.name}</h2>
                ${item.rating ? `
            <div class="product-rating">
                <div class="stars">
                    ${renderStars(item.rating)}
                </div>
                <span class="rating-count">${item.reviewCount || '0'}+ reviews</span>
            </div>` : ''}
                <p>Size: <span>${item.size} ml</span></p>
            </div>
          <div class="cartPrice_area">
            <p class="pricePoint">
                ${discount > 0
                ? `<span class="original-price if_discount">$${price.toFixed(2)}</span>
                    <span class="discounted-price cartDiscount_price">$${discountedPrice.toFixed(2)}</span>
                    <span class="discount-badge cartDiscount">-${discount}%</span>`
                : `<span>$${price.toFixed(2)}</span>`}
            </p>
            <p class="cartSubtotal">Subtotal: <span>$${itemTotal.toFixed(2)}</span></p>
          </div>
       </div>
        <div class="cartCard_bottom">
            <div>
                <p class="counter">
                Quantity:
                <span>
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </span>
                </p>
            </div>
            <div class="cartAtc_button">
                <button onclick="removeFromCart(${index})" class="cartDelete">Remove</button>
                <a href="product.html?id=${item.id}" class="view-product-btn">View Product</a>
            </div>
        </div>
      </div>
    `;
        container.appendChild(div);
    });

    const delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
    const total = (subtotal - totalDiscount) + delivery;

    totalPriceElem.innerHTML = `
    <div class="price-summary">
      <div class="price-row">
        <span>Subtotal:</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      ${totalDiscount > 0 ? `
      <div class="price-row discount-row">
        <span>Discount:</span>
        <span>-$${totalDiscount.toFixed(2)}</span>
      </div>` : ''}
      <div class="price-row delivery-row">
        <span>Delivery:</span>
        <span>${delivery > 0 ? `$${delivery.toFixed(2)}` : 'FREE <span class="free-delivery-badge"></span>'}</span>
      </div>
      <div class="price-row total-row">
        <span>Grand Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      ${subtotal < freeDeliveryThreshold ? `
      <div class="free-delivery-notice">
        Spend $${(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery!
      </div>` : ''}
    </div>
  `;

    updateCartCount(); // <-- make sure cart badge updates
}

function changeQuantity(index, delta) {
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// MODIFIED: Ensure rating and reviewCount are stored when adding to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    const maxQty = product.stock || 1;

    if (existing) {
        if (existing.quantity >= maxQty) {
            showCartLimitWarning(product.name);
            return;
        }
        existing.quantity += 1;
    } else {
        if (maxQty < 1) {
            showCartLimitWarning(product.name);
            return;
        }
        // Include rating and reviewCount when adding new item
        cart.push({
            ...product,
            quantity: 1,
            rating: product.rating, // Explicitly add rating
            reviewCount: product.reviewCount || 0 // Explicitly add reviewCount, default to 0 if not present
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartNotification(product.name);
}

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartInfo = document.getElementById('cart-info');

        if (cartInfo) {
            cartInfo.textContent = total;
            cartInfo.style.display = total > 0 ? 'flex' : 'none';
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        localStorage.setItem('cart', JSON.stringify([]));
        const cartInfo = document.getElementById('cart-info');
        if (cartInfo) cartInfo.textContent = '0';
    }
}

function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<span>${productName} added to cart!</span>`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

function showCartLimitWarning(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification warning';
    notification.innerHTML = `<span>You could not add "${productName}" anymore. Stock limit reached.</span>`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 2500);
}

// Initialize the cart on page load
document.addEventListener('DOMContentLoaded', function () {
    renderCart();
    updateCartCount();
});

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    // Add half star if needed
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    // Add empty stars to complete 5 stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// Calculate and display estimated delivery date
function calculateDeliveryDate() {
    const today = new Date();
    // Add 3-5 business days (excluding weekends)
    let deliveryDays = 3 + Math.floor(Math.random() * 3); // Random between 3-5 days

    let deliveryDate = new Date(today);
    let addedDays = 0;

    while (addedDays < deliveryDays) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
            addedDays++;
        }
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const estimatedDeliveryDateElement = document.getElementById('estimated-delivery-date');
    if (estimatedDeliveryDateElement) {
        estimatedDeliveryDateElement.textContent = deliveryDate.toLocaleDateString('en-US', options);
    }
}

// Calculate delivery date when page loads
document.addEventListener('DOMContentLoaded', calculateDeliveryDate);
