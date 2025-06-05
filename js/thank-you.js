// document.addEventListener('DOMContentLoaded', async function() {
//     // Get order ID from URL
//     const urlParams = new URLSearchParams(window.location.search);
//     const orderId = urlParams.get('order_id');
//     const customerEmail = urlParams.get('email');
    
//     // Load order data
//     const order = await loadOrderData(orderId);
    
//     if (order) {
//         // Populate order details
//         document.getElementById('order-number').textContent = `Order #${order.id}`;
//         document.getElementById('order-date').textContent = formatDate(order.date);
//         document.getElementById('customer-email').textContent = customerEmail || order.customer?.email || 'Not provided';
//         document.getElementById('payment-method').textContent = order.paymentMethod || 'Credit Card';
//         document.getElementById('shipping-method').textContent = order.shipping?.method || 'Standard Shipping';
//         document.getElementById('delivery-date').textContent = calculateDeliveryDate(order.date);
//         document.getElementById('order-total').textContent = formatCurrency(order.total);
        
//         // Populate items preview (show max 6 items)
//         const itemsContainer = document.getElementById('order-items-container');
//         const itemsToShow = order.items.slice(0, 6);
        
//         itemsToShow.forEach(item => {
//             const itemElement = document.createElement('div');
//             itemElement.className = 'item-thumbnail-container';
//             itemElement.innerHTML = `
//                 <img src="${item.image}" alt="${item.name}" class="item-thumbnail" title="${item.name}">
//                 ${item.quantity > 1 ? `<span class="item-quantity">${item.quantity}</span>` : ''}
//             `;
//             itemsContainer.appendChild(itemElement);
//         });
        
//         // Show "+X more" if there are additional items
//         if (order.items.length > 6) {
//             const moreItems = document.createElement('div');
//             moreItems.className = 'item-more';
//             moreItems.textContent = `+${order.items.length - 6} more`;
//             itemsContainer.appendChild(moreItems);
//         }
        
//         // Set up view full order button
//         document.getElementById('view-full-order').addEventListener('click', () => {
//             window.location.href = `/account/orders/${order.id}`;
//         });
//     } else {
//         // Order not found - show generic thank you
//         document.querySelector('.order-card').innerHTML = `
//             <div class="order-not-found">
//                 <h2>Thank you for your order!</h2>
//                 <p>We've received your payment and are processing your order.</p>
//                 <p>Details have been sent to your email address.</p>
//             </div>
//         `;
//     }
    
//     // Add analytics tracking
//     trackOrderConfirmation(orderId);
// });

// // Helper functions
// async function loadOrderData(orderId) {
//     // Try to load from session storage first
//     const sessionOrder = sessionStorage.getItem('lastOrder');
//     if (sessionOrder) {
//         return JSON.parse(sessionOrder);
//     }
    
//     // Then try local storage (simulated database)
//     const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
//     const foundOrder = allOrders.find(order => order.id === orderId);
    
//     if (foundOrder) {
//         return foundOrder;
//     }
    
//     // In a real app, you would fetch from your backend API here
//     // try {
//     //     const response = await fetch(`/api/orders/${orderId}`);
//     //     return await response.json();
//     // } catch (error) {
//     //     console.error('Error loading order:', error);
//     //     return null;
//     // }
    
//     return null;
// }

// function formatDate(dateString) {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', options);
// }

// function calculateDeliveryDate(orderDate) {
//     const date = new Date(orderDate);
//     date.setDate(date.getDate() + 3); // 3 days later
    
//     const options = { weekday: 'long', month: 'long', day: 'numeric' };
//     return date.toLocaleDateString('en-US', options);
// }

// function formatCurrency(amount) {
//     return '$' + parseFloat(amount).toFixed(2);
// }

// function trackOrderConfirmation(orderId) {
//     // Implement your analytics tracking here
//     console.log('Order confirmed:', orderId);
//     // Example: Facebook Pixel, Google Analytics, etc.
// }


document.addEventListener('DOMContentLoaded', async function() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    
    // Load order data
    const order = await loadOrderData(orderId);

    if (order) {
        // Get DOM elements
        const customerNameEl = document.getElementById('customer-name');
        const customerEmailEl = document.getElementById('customer-email');
        const orderTotalEl = document.getElementById('order-total');
        
        // Populate customer details
        customerNameEl.textContent = order.customer?.name || 'Customer';
        
        // Set customer email (check both URL params and order data)
        const emailFromURL = urlParams.get('email');
        customerEmailEl.textContent = emailFromURL || order.customer?.email || 'Not provided';
        
        // Set order total (ensure proper formatting)
        orderTotalEl.textContent = formatCurrency(order.total || 0);

        console.log('Order total before formatting:', order.total);
        const formattedTotal = formatCurrency(order.total);
        console.log('Formatted total:', formattedTotal);

        // Populate other order details
        document.getElementById('order-number').textContent = `Order #${order.id}`;
        document.getElementById('order-date').textContent = formatDate(order.date);
        document.getElementById('payment-method').textContent = order.paymentMethod || 'Credit Card';
        document.getElementById('shipping-method').textContent = order.shipping?.method || 'Standard Shipping';
        document.getElementById('delivery-date').textContent = calculateDeliveryDate(order.date);

        // Populate order items list
        const itemsList = document.getElementById('order-items-list');
        itemsList.innerHTML = ''; // Clear any existing items
        
        order.items.forEach(item => {
            const price = parseFloat(item.price);
            const discount = item.discount || 0;
            const discountedPrice = price - (price * discount / 100);
            const itemTotal = discountedPrice * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">
                        ${discount > 0 ? `
                            <span class="original-price">$${price.toFixed(2)}</span>
                            <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
                            <span class="discount-badge">-${discount}%</span>
                        ` : `
                            <span class="final-price">$${price.toFixed(2)}</span>
                        `}
                    </div>
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                    <div class="item-subtotal">Subtotal: $${itemTotal.toFixed(2)}</div>
                </div>
            `;
            itemsList.appendChild(itemElement);
        });
    } else {
        // Order not found - show generic thank you
        document.querySelector('.order-card').innerHTML = `
            <div class="order-not-found">
                <h2>Thank you for your order!</h2>
                <p>We've received your payment and are processing your order.</p>
                <p>Details have been sent to your email address.</p>
            </div>
        `;
    }

    // Add analytics tracking
    trackOrderConfirmation(orderId);
});

// Helper functions
async function loadOrderData(orderId) {
    // Try to load from session storage first
    const sessionOrder = sessionStorage.getItem('lastOrder');
    if (sessionOrder) {
        const order = JSON.parse(sessionOrder);
        
        // Ensure order has required properties
        if (!order.customer) {
            order.customer = {
                name: 'Customer',
                email: 'Not provided'
            };
        }
        // Always recalculate total to ensure accuracy
        order.total = calculateOrderTotal(order.items || []);
        
        return order;
    }

    // Then try local storage (simulated database)
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = allOrders.find(order => order.id === orderId);

    if (foundOrder) {
        // Ensure order has required properties
        if (!foundOrder.customer) foundOrder.customer = {};
        foundOrder.total = calculateOrderTotal(foundOrder.items || []);
        
        return foundOrder;
    }

    return null;
}

function calculateOrderTotal(items) {
    if (!items || !Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const discount = parseFloat(item.discount) || 0;
        const quantity = parseInt(item.quantity) || 0;
        
        const discountedPrice = price - (price * discount / 100);
        return total + (discountedPrice * quantity);
    }, 0);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

function calculateDeliveryDate(orderDate) {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 3); // 3 days later
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatCurrency(amount) {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
        console.error('Invalid amount received:', amount);
        return '$0.00';
    }
    return '$' + numericAmount.toFixed(2);
}

function trackOrderConfirmation(orderId) {
    // Implement your analytics tracking here
    console.log('Order confirmed:', orderId);
}
