// const checkoutContainer = document.getElementById('checkout-container');
// const totalElem = document.getElementById('total-checkout-price');
// const confirmMessage = document.getElementById('confirmation-message');
// const confirmBtn = document.getElementById('confirm-checkout');
// let cart = JSON.parse(localStorage.getItem('cart')) || [];
// const deliveryCharge = 20.00;
// const freeDeliveryThreshold = 300.00;

// function renderCheckout() {
//   checkoutContainer.innerHTML = '';
//   let subtotal = 0;
//   let totalDiscount = 0;

//   if (cart.length === 0) {
//     checkoutContainer.innerHTML = '<p>Your cart is empty.</p>';
//     totalElem.innerHTML = '';
//     confirmBtn.style.display = 'none';
//     return;
//   }

//   cart.forEach(item => {
//     const price = parseFloat(item.price);
//     const discount = item.discount || 0;
//     const discountedPrice = price - (price * discount / 100);
//     const itemTotal = discountedPrice * item.quantity;
//     subtotal += price * item.quantity;
//     totalDiscount += (price - discountedPrice) * item.quantity;

//     const div = document.createElement('div');
//     div.className = 'checkout-item';
//     div.innerHTML = `
//       <img src="${item.image}" alt="${item.name}" />
//       <div class="item-details">
//         <h2>${item.name}</h2>
//         <p class="price">
//           ${discount > 0
//             ? `<span class="original-price">$${price.toFixed(2)}</span>
//                <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
//                <span class="discount-badge">-${discount}%</span>`
//             : `<span>$${price.toFixed(2)}</span>`}
//         </p>
//         <p>Quantity: ${item.quantity}</p>
//         <p class="subtotal">Subtotal: $${itemTotal.toFixed(2)}</p>
//       </div>
//     `;
//     checkoutContainer.appendChild(div);
//   });

//   // Calculate delivery (free if subtotal >= $300)
//   const delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
//   const total = (subtotal - totalDiscount) + delivery;

//   totalElem.innerHTML = `
//     <div class="price-summary">
//       <div class="price-row">
//         <span>Subtotal:</span>
//         <span>$${subtotal.toFixed(2)}</span>
//       </div>
//       ${totalDiscount > 0 ? `
//       <div class="price-row discount-row">
//         <span>Discount:</span>
//         <span>-$${totalDiscount.toFixed(2)}</span>
//       </div>` : ''}
//       <div class="price-row delivery-row">
//         <span>Delivery:</span>
//         <span>${delivery > 0 ? `$${delivery.toFixed(2)}` : 'FREE <span class="free-delivery-badge">($${freeDeliveryThreshold}+ order)</span>'}</span>
//       </div>
//       <div class="price-row total-row">
//         <span>Total:</span>
//         <span>$${total.toFixed(2)}</span>
//       </div>
//       ${subtotal < freeDeliveryThreshold ? `
//       <div class="free-delivery-notice">
//         <i class="fas fa-truck"></i> Spend $${(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery!
//       </div>` : ''}
//     </div>
//   `;
// }

// confirmBtn.addEventListener('click', () => {
//   // Create order summary before clearing cart
//   const orderSummary = {
//     items: [...cart],
//     date: new Date().toISOString(),
//     total: document.querySelector('.total-row span:last-child').textContent
//   };
  
//   // Save order to history (optional)
//   const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
//   orderHistory.push(orderSummary);
//   localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  
//   // Clear cart and show confirmation
//   localStorage.removeItem('cart');
//   cart = [];
//   renderCheckout();
//   confirmMessage.textContent = '✅ Thank you! Your order has been placed. A confirmation email has been sent.';
//   confirmBtn.style.display = 'none';
  
//   // Optional: Redirect after delay
//   // setTimeout(() => window.location.href = 'thank-you.html', 3000);
// });

// renderCheckout();



const checkoutContainer = document.getElementById('checkout-container');
const totalElem = document.getElementById('total-checkout-price');
const confirmMessage = document.getElementById('confirmation-message');
const confirmBtn = document.getElementById('confirm-checkout');
const deliveryOptions = document.querySelectorAll('.delivery-option');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let deliveryCharge = 20.00;
const freeDeliveryThreshold = 300.00;

// Set up delivery option selection
deliveryOptions.forEach(option => {
  option.addEventListener('click', function() {
    deliveryOptions.forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');
    
    // Update delivery charge based on selection
    const priceText = this.querySelector('.price').textContent;
    if (priceText.includes('35')) {
      deliveryCharge = 35.00;
    } else {
      deliveryCharge = 20.00;
    }
    
    renderCheckout();
  });
});

// Payment form validation
document.getElementById('card-number')?.addEventListener('input', function(e) {
  this.value = this.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  if (this.value.length > 19) this.value = this.value.substring(0, 19);
});

document.getElementById('expiry')?.addEventListener('input', function(e) {
  this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/');
  if (this.value.length > 5) this.value = this.value.substring(0, 5);
});

document.getElementById('cvv')?.addEventListener('input', function(e) {
  this.value = this.value.replace(/\D/g, '');
  if (this.value.length > 4) this.value = this.value.substring(0, 4);
});

function renderCheckout() {
  checkoutContainer.innerHTML = '';
  let subtotal = 0;
  let totalDiscount = 0;

  if (cart.length === 0) {
    checkoutContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty.</p>
        <a href="index.html" class="continue-shopping">Continue Shopping</a>
      </div>
    `;
    totalElem.innerHTML = '';
    confirmBtn.style.display = 'none';
    return;
  }

  cart.forEach(item => {
    const price = parseFloat(item.price);
    const discount = item.discount || 0;
    const discountedPrice = price - (price * discount / 100);
    const itemTotal = discountedPrice * item.quantity;
    subtotal += price * item.quantity;
    totalDiscount += (price - discountedPrice) * item.quantity;

    const div = document.createElement('div');
    div.className = 'checkout-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-details">
        <h2>${item.name}</h2>
        <p class="price">
          ${discount > 0
            ? `<span class="original-price">$${price.toFixed(2)}</span>
               <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
               <span class="discount-badge">-${discount}%</span>`
            : `<span>$${price.toFixed(2)}</span>`}
        </p>
        <p>Quantity: ${item.quantity}</p>
        <p class="subtotal">Subtotal: $${itemTotal.toFixed(2)}</p>
      </div>
    `;
    checkoutContainer.appendChild(div);
  });

  // Calculate delivery (free if subtotal >= $300)
  const delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
  const total = (subtotal - totalDiscount) + delivery;

  totalElem.innerHTML = `
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
        <span>${delivery > 0 ? `$${delivery.toFixed(2)}` : 'FREE <span class="free-delivery-badge">($${freeDeliveryThreshold}+ order)</span>'}</span>
      </div>
      <div class="price-row total-row">
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      ${subtotal < freeDeliveryThreshold ? `
      <div class="free-delivery-notice">
        <i class="fas fa-truck"></i> Spend $${(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery!
      </div>` : ''}
      <div class="estimated-delivery">
        <i class="fas fa-calendar-alt"></i> Estimated delivery: ${calculateDeliveryDate()}
      </div>
    </div>
  `;
}

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

  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return deliveryDate.toLocaleDateString('en-US', options);
}

confirmBtn.addEventListener('click', () => {
  // Enhanced form validation
  const cardName = document.getElementById('card-name').value;
  const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
  const expiry = document.getElementById('expiry').value;
  const cvv = document.getElementById('cvv').value;
  
  // Validate card number (16 digits)
  if (!cardName || !cardNumber || !expiry || !cvv) {
    confirmMessage.textContent = 'Please fill in all payment details';
    confirmMessage.style.color = 'var(--discount-color)';
    return;
  }
  
  if (cardNumber.length < 16) {
    confirmMessage.textContent = 'Please enter a valid 16-digit card number';
    confirmMessage.style.color = 'var(--discount-color)';
    return;
  }
  
  // Validate expiry date (MM/YY format)
  const [month, year] = expiry.split('/');
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    confirmMessage.textContent = 'Please enter a valid expiry date (MM/YY)';
    confirmMessage.style.color = 'var(--discount-color)';
    return;
  }
  
  // Validate CVV (3-4 digits)
  if (cvv.length < 3 || cvv.length > 4) {
    confirmMessage.textContent = 'Please enter a valid CVV (3-4 digits)';
    confirmMessage.style.color = 'var(--discount-color)';
    return;
  }
  
  // Create order summary before clearing cart
  const orderSummary = {
    id: 'ORD' + Math.floor(Math.random() * 1000000),
    items: [...cart],
    date: new Date().toISOString(),
    total: document.querySelector('.total-row span:last-child').textContent,
    delivery: document.querySelector('.delivery-row span:last-child').textContent,
    estimatedDelivery: calculateDeliveryDate(),
    customer: {
      name: document.getElementById('card-name').value, // Using card name as customer name
      email: document.getElementById('email')?.value || 'not-provided@example.com' // Add email field to your form
    },
    paymentMethod: 'Credit Card', // or get from payment processor
    shipping: {
      method: document.querySelector('.delivery-option.selected h4').textContent
    }
  };
  
  // Save order to history
  const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  orderHistory.push(orderSummary);
  localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

  // Save to session storage for thank-you page
  sessionStorage.setItem('lastOrder', JSON.stringify(orderSummary));
  
  // Clear cart and show confirmation
  localStorage.removeItem('cart');
  cart = [];
  renderCheckout();
  
  // Show success message
  confirmMessage.textContent = '✅ Thank you! Your order has been placed. A confirmation email has been sent.';
  confirmMessage.style.color = 'var(--success-color)';
  confirmBtn.style.display = 'none';

  const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
  orderSummary.id = orderId;
  sessionStorage.setItem('lastOrder', JSON.stringify(orderSummary));

  setTimeout(() => {
    window.location.href = `thank-you.html?order_id=${orderId}`;
  }, 1500);
  
  // Scroll to confirmation message
  confirmMessage.scrollIntoView({ behavior: 'smooth' });
});

// Initialize the page
renderCheckout();
