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

// // Format inputs
// document.getElementById('card-number')?.addEventListener('input', function () {
//   this.value = this.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
// });
// document.getElementById('expiry')?.addEventListener('input', function () {
//   this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substring(0, 5);
// });
// document.getElementById('cvv')?.addEventListener('input', function () {
//   this.value = this.value.replace(/\D/g, '').substring(0, 4);
// });

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

//   if (cardNumber.length < 16 || cvv.length < 3 || cvv.length > 4 || expiry.length !== 5) {
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
//       method: document.querySelector('.delivery-option.selected h4').textContent
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

// Initial render on page load
// renderCheckout();



// checkout.js
const checkoutContainer = document.getElementById('checkout-container');
const totalElem = document.getElementById('total-checkout-price');
const confirmMessage = document.getElementById('confirmation-message');
const confirmBtn = document.getElementById('confirm-checkout');
const deliveryOptions = document.querySelectorAll('.delivery-option');

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

// Input restrictions

document.getElementById('card-name')?.addEventListener('input', function () {
  this.value = this.value.replace(/[0-9]/g, '');
});

document.getElementById('card-number')?.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
});

document.getElementById('expiry')?.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substring(0, 5);
});

document.getElementById('cvv')?.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').substring(0, 4);
});

function isValidExpiry(expiry) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [month, year] = expiry.split('/').map(Number);
  const fullYear = 2000 + year;
  return month >= 1 && month <= 12 && fullYear <= 2040 && fullYear >= new Date().getFullYear();
}

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
      </div>`;
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
      </div>`;
    checkoutContainer.appendChild(div);
  });

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




