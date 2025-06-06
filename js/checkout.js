// // checkout.js
// const checkoutContainer = document.getElementById('checkout-container');
// const totalElem = document.getElementById('total-checkout-price');
// const confirmMessage = document.getElementById('confirmation-message');
// const confirmBtn = document.getElementById('confirm-checkout');
// const deliveryOptions = document.querySelectorAll('.delivery-option');

// let cart = JSON.parse(localStorage.getItem('cart')) || [];
// let deliveryCharge = 20.00;
// const freeDeliveryThreshold = 300.00;

// // Delivery option selection
// deliveryOptions.forEach(option => {
//   option.addEventListener('click', function () {
//     deliveryOptions.forEach(opt => opt.classList.remove('selected'));
//     this.classList.add('selected');
//     const priceText = this.querySelector('.price').textContent;
//     deliveryCharge = priceText.includes('35') ? 35.00 : 20.00;
//     renderCheckout();
//   });
// });

// // Input restrictions and validation
// function validateField(id, isValid) {
//   const input = document.getElementById(id);
//   const icon = document.getElementById(`icon-${id}`);
//   if (!input || !icon) return;

//   input.classList.remove('valid', 'invalid');
//   icon.classList.remove('valid', 'invalid');

//   if (isValid) {
//     input.classList.add('valid');
//     icon.classList.add('valid');
//     icon.innerHTML = '✔';
//   } else {
//     input.classList.add('invalid');
//     icon.classList.add('invalid');
//     icon.innerHTML = '✖';
//   }
// }

// document.getElementById('card-name')?.addEventListener('input', function () {
//   this.value = this.value.replace(/[0-9]/g, '');
//   validateField('card-name', /^[A-Za-z\s]{2,}$/.test(this.value));
// });

// document.getElementById('email')?.addEventListener('input', function () {
//   const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
//   validateField('email', valid);
// });

// document.getElementById('card-number')?.addEventListener('input', function () {
//   this.value = this.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
//   const valid = this.value.replace(/\s/g, '').length === 16;
//   validateField('card-number', valid);
// });

// document.getElementById('expiry')?.addEventListener('input', function () {
//   this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substring(0, 5);
//   const valid = isValidExpiry(this.value);
//   validateField('expiry', valid);
// });

// document.getElementById('cvv')?.addEventListener('input', function () {
//   this.value = this.value.replace(/\D/g, '').substring(0, 4);
//   const valid = /^[0-9]{3,4}$/.test(this.value);
//   validateField('cvv', valid);
// });

// function isValidExpiry(expiry) {
//   if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
//   const [month, year] = expiry.split('/').map(Number);
//   const fullYear = 2000 + year;
//   return month >= 1 && month <= 12 && fullYear <= 2040 && fullYear >= new Date().getFullYear();
// }

// function renderCheckout() {
//   checkoutContainer.innerHTML = '';
//   let subtotal = 0;
//   let totalDiscount = 0;

//   if (cart.length === 0) {
//     checkoutContainer.innerHTML = `
//       <div class="empty-cart">
//         <i class="fas fa-shopping-cart"></i>
//         <p>Your cart is empty.</p>
//         <a href="index.html" class="continue-shopping">Continue Shopping</a>
//       </div>`;
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
//       </div>`;
//     checkoutContainer.appendChild(div);
//   });

//   let delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
//   const total = (subtotal - totalDiscount) + delivery;

//   totalElem.innerHTML = `
//     <div class="price-summary">
//       <div class="price-row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
//       ${totalDiscount > 0 ? `<div class="price-row discount-row"><span>Discount:</span><span>-$${totalDiscount.toFixed(2)}</span></div>` : ''}
//       <div class="price-row delivery-row"><span>Delivery:</span>
//         <span>${delivery > 0 ? `$${delivery.toFixed(2)}` : 'FREE <span class="free-delivery-badge">($300+)'}</span>
//       </div>
//       <div class="price-row total-row"><span>Total:</span><span>$${total.toFixed(2)}</span></div>
//       ${subtotal < freeDeliveryThreshold ? `<div class="free-delivery-notice"><i class="fas fa-truck"></i> Spend $${(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery!</div>` : ''}
//       <div class="estimated-delivery"><i class="fas fa-calendar-alt"></i> Estimated delivery: ${calculateDeliveryDate()}</div>
//     </div>`;
// }

// function calculateDeliveryDate() {
//   const today = new Date();
//   let daysToAdd = 3 + Math.floor(Math.random() * 3);
//   let deliveryDate = new Date(today);
//   let added = 0;

//   while (added < daysToAdd) {
//     deliveryDate.setDate(deliveryDate.getDate() + 1);
//     if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) added++;
//   }

//   return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
// }

// confirmBtn.addEventListener('click', () => {
//   const cardName = document.getElementById('card-name')?.value;
//   const cardNumber = document.getElementById('card-number')?.value.replace(/\s/g, '');
//   const expiry = document.getElementById('expiry')?.value;
//   const cvv = document.getElementById('cvv')?.value;
//   const email = document.getElementById('email')?.value;

//   if (!cardName || !cardNumber || !expiry || !cvv || !email) {
//     confirmMessage.textContent = 'Please fill in all payment details';
//     confirmMessage.style.color = 'var(--discount-color)';
//     return;
//   }

//   if (
//     cardNumber.length < 16 ||
//     cvv.length < 3 ||
//     cvv.length > 4 ||
//     expiry.length !== 5 ||
//     !isValidExpiry(expiry)
//   ) {
//     confirmMessage.textContent = 'Please check your card details';
//     confirmMessage.style.color = 'var(--discount-color)';
//     return;
//   }

//   const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
//   const orderSummary = {
//     id: orderId,
//     items: [...cart],
//     date: new Date().toISOString(),
//     total: document.querySelector('.total-row span:last-child').textContent,
//     delivery: document.querySelector('.delivery-row span:last-child').textContent,
//     estimatedDelivery: calculateDeliveryDate(),
//     promoCode: null,
//     customer: { name: cardName, email },
//     shipping: {
//       method: document.querySelector('.delivery-option.selected h4')?.textContent || 'Standard Delivery'
//     }
//   };

//   const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
//   orderHistory.push(orderSummary);
//   localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
//   sessionStorage.setItem('lastOrder', JSON.stringify(orderSummary));

//   localStorage.removeItem('cart');
//   cart = [];
//   renderCheckout();

//   confirmMessage.textContent = '✅ Thank you! Your order has been placed.';
//   confirmMessage.style.color = 'var(--success-color)';
//   confirmBtn.style.display = 'none';

//   setTimeout(() => {
//     window.location.href = `thank-you.html?order_id=${orderId}`;
//   }, 1500);
// });

// // Initial render on page load
// renderCheckout();


const checkoutContainer = document.getElementById('checkout-container');
const totalElem = document.getElementById('total-checkout-price');
const confirmMessage = document.getElementById('confirmation-message');
const confirmBtn = document.getElementById('confirm-checkout');
const deliveryOptions = document.querySelectorAll('.delivery-option');
const checkoutMain = document.querySelector('.checkout-main');
const checkoutGrid = document.querySelector('.checkout-grid');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let deliveryCharge = 20.00;
const freeDeliveryThreshold = 300.00;

// Delivery option selection
deliveryOptions.forEach(option => {
  option.addEventListener('click', function () {
    deliveryOptions.forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');
    const priceText = this.querySelector('.price').textContent;
    deliveryCharge = priceText.includes('35') ? 35.00 : 20.00;
    renderCheckout();
  });
});

// Input restrictions and validation
function validateField(id, isValid) {
  const input = document.getElementById(id);
  const icon = document.getElementById(`icon-${id}`);
  if (!input || !icon) return;

  input.classList.remove('valid', 'invalid');
  icon.classList.remove('valid', 'invalid');

  if (isValid) {
    input.classList.add('valid');
    icon.classList.add('valid');
    icon.innerHTML = '✔';
  } else {
    input.classList.add('invalid');
    icon.classList.add('invalid');
    icon.innerHTML = '✖';
  }
}

document.getElementById('card-name')?.addEventListener('input', function () {
  this.value = this.value.replace(/[0-9]/g, '');
  validateField('card-name', /^[A-Za-z\s]{2,}$/.test(this.value));
});

document.getElementById('email')?.addEventListener('input', function () {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
  validateField('email', valid);
});

document.getElementById('card-number')?.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
  const valid = this.value.replace(/\s/g, '').length === 16;
  validateField('card-number', valid);
});

document.getElementById('expiry')?.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substring(0, 5);
  const valid = isValidExpiry(this.value);
  validateField('expiry', valid);
});

document.getElementById('cvv')?.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').substring(0, 4);
  const valid = /^[0-9]{3,4}$/.test(this.value);
  validateField('cvv', valid);
});

function isValidExpiry(expiry) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [month, year] = expiry.split('/').map(Number);
  const fullYear = 2000 + year;
  return month >= 1 && month <= 12 && fullYear <= 2040 && fullYear >= new Date().getFullYear();
}

function renderCheckout() {
  // Remove any existing empty cart message
  const existingEmpty = document.getElementById('empty-cart-message');
  if (existingEmpty) existingEmpty.remove();
  
  // Hide checkout grid by default
  checkoutGrid.style.display = 'none';
  
  if (cart.length === 0) {
    // Create and show empty cart message
    const emptyCartDiv = document.createElement('div');
    emptyCartDiv.id = 'empty-cart-message';
    emptyCartDiv.className = 'text-center py-5';
    emptyCartDiv.innerHTML = `
      <i class="fas fa-shopping-cart fa-3x mb-3 text-secondary"></i>
      <h2 class="mb-3">Your cart is empty.</h2>
      <a href="shop.html" class="btn btn-primary btn-lg contShopping">Continue Shopping</a>
    `;
    checkoutMain.appendChild(emptyCartDiv);
    return;
  }
  
  // Show checkout grid when cart has items
  checkoutGrid.style.display = 'grid';
  
  // Render cart items
  checkoutContainer.innerHTML = '';
  let subtotal = 0;
  let totalDiscount = 0;

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
      </div>`;
    checkoutContainer.appendChild(div);
  });

  // Calculate and display totals
  let delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
  const total = (subtotal - totalDiscount) + delivery;

  totalElem.innerHTML = `
    <div class="price-summary">
      <div class="price-row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
      ${totalDiscount > 0 ? `<div class="price-row discount-row"><span>Discount:</span><span>-$${totalDiscount.toFixed(2)}</span></div>` : ''}
      <div class="price-row delivery-row"><span>Delivery:</span>
        <span>${delivery > 0 ? `$${delivery.toFixed(2)}` : 'FREE <span class="free-delivery-badge">($300+)'}</span>
      </div>
      <div class="price-row total-row"><span>Total:</span><span>$${total.toFixed(2)}</span></div>
      ${subtotal < freeDeliveryThreshold ? `<div class="free-delivery-notice"><i class="fas fa-truck"></i> Spend $${(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery!</div>` : ''}
      <div class="estimated-delivery"><i class="fas fa-calendar-alt"></i> Estimated delivery: ${calculateDeliveryDate()}</div>
    </div>`;
}

function calculateDeliveryDate() {
  const today = new Date();
  let daysToAdd = 3 + Math.floor(Math.random() * 3);
  let deliveryDate = new Date(today);
  let added = 0;

  while (added < daysToAdd) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) added++;
  }

  return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

confirmBtn.addEventListener('click', () => {
  const cardName = document.getElementById('card-name')?.value;
  const cardNumber = document.getElementById('card-number')?.value.replace(/\s/g, '');
  const expiry = document.getElementById('expiry')?.value;
  const cvv = document.getElementById('cvv')?.value;
  const email = document.getElementById('email')?.value;

  if (!cardName || !cardNumber || !expiry || !cvv || !email) {
    confirmMessage.textContent = 'Please fill in all payment details';
    confirmMessage.style.color = 'var(--discount-color)';
    return;
  }

  if (
    cardNumber.length < 16 ||
    cvv.length < 3 ||
    cvv.length > 4 ||
    expiry.length !== 5 ||
    !isValidExpiry(expiry)
  ) {
    confirmMessage.textContent = 'Please check your card details';
    confirmMessage.style.color = 'var(--discount-color)';
    return;
  }

  const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
  const orderSummary = {
    id: orderId,
    items: [...cart],
    date: new Date().toISOString(),
    total: document.querySelector('.total-row span:last-child').textContent,
    delivery: document.querySelector('.delivery-row span:last-child').textContent,
    estimatedDelivery: calculateDeliveryDate(),
    promoCode: null,
    customer: { name: cardName, email },
    shipping: {
      method: document.querySelector('.delivery-option.selected h4')?.textContent || 'Standard Delivery'
    }
  };

  const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  orderHistory.push(orderSummary);
  localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  sessionStorage.setItem('lastOrder', JSON.stringify(orderSummary));

  localStorage.removeItem('cart');
  cart = [];
  renderCheckout();

  confirmMessage.textContent = '✅ Thank you! Your order has been placed.';
  confirmMessage.style.color = 'var(--success-color)';
  confirmBtn.style.display = 'none';

  setTimeout(() => {
    window.location.href = `thank-you.html?order_id=${orderId}`;
  }, 1500);
});

// Initial render on page load
renderCheckout();