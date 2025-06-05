const productId = new URLSearchParams(window.location.search).get('id');

// Function to generate star rating HTML
function generateStarRating(rating) {
  if (!rating) return '';
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }
  
  return starsHtml;
}

// Wishlist helper functions
function isInWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  return wishlist.map(String).includes(String(productId));
}

function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const idStr = String(productId);
  const index = wishlist.map(String).indexOf(idStr);

  if (index === -1) {
    wishlist.push(idStr);
  } else {
    wishlist.splice(index, 1);
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  return index === -1;
}

function updateWishlistButton(btn, isAdded, animate = false) {
  const icon = btn.querySelector('i');
  if (!icon) return;

  icon.classList.remove('fa-regular', 'fa-solid', 'liked');

  if (isAdded) {
    icon.classList.add('fa-solid', 'liked');
    if (animate) {
      icon.style.animation = 'pulse 0.4s ease';
      icon.addEventListener('animationend', () => {
        icon.style.animation = '';
      }, { once: true });
    }
  } else {
    icon.classList.add('fa-regular');
  }
}

if (productId) {
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id == productId);
      const container = document.getElementById('product-detail');

      if (product) {
        const price = parseFloat(product.price);
        const discount = product.discount || 0;
        const discountedPrice = price - (price * discount / 100);
        const discountBadge = discount > 0
          ? `<span class="discount-badge">${discount}% OFF</span>`
          : '';
        const priceHTML = discount > 0
          ? `<div class="price-container">
               <span class="discounted-price discPrice">$${discountedPrice.toFixed(2)}</span>
               <span class="original-price">$${price.toFixed(2)}</span>
               <span class="discount-badge beside-price">-${discount}%</span>
             </div>`
          : `<span>$${price.toFixed(2)}</span>`;

          container.innerHTML = `
          <div class="productDetails_area">
              <div class="product-gallery">
                  <img id="main-image" class="image-preview image-preview-js" src="${product.image}" alt="${product.name}" />
                  <div class="thumbnail-container">
                      ${(product.thumbnails || [product.image]).map(thumb => `
                      <img class="thumb" src="${thumb}" onclick="document.getElementById('main-image').src='${thumb}'" />
                      `).join('')}
                  </div>
              </div>
              <div class="productDetails_right">
                  <h2 class="product_name">${product.name}</h2>
                  <div class="product-rating">
                      <div class="star-rating">
                          ${generateStarRating(product.rating)}
                      </div>
                      <span class="review-count productPage_rviw">${product.reviewCount || '100+'}+ reviews</span>
                  </div>
                  <h3>${priceHTML}</h3>
                  <p class="product-description">${product.description}</p>
                  <p class="productSize">Size: <span>${product.size} ML</span></p>
                  <div class="quantity-controls">
                      <label>Quantity:</label>
                      <div class="atcAction_btn">
                        <div class="quantity-input">
                            <button class="quantity-btn minus">-</button>
                            <input type="text" id="qty" value="1" min="1" readonly/>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button id="add-to-cart">Add to Cart</button>
                        <button id="add-to-wishlist" class="wishlist-btn" data-product-id="${product.id}">
                          <i class="fa-regular fa-heart"></i>
                        </button>
                      </div>
                  </div>
                  <p id="cart-message" style="color: green;"></p>

                  <div class="product-badges">
                      <div class="badge-item">
                          <img src="./images/lab-1.png" alt="Non-toxic">
                          <span>Safe & <br>Non-toxic</span>
                      </div>
                      <div class="badge-item">
                          <img src="./images/lab-2.png" alt="Dermatologist Tested">
                          <span>Dermatologist <br>Tested</span>
                      </div>
                      <div class="badge-item">
                          <img src="./images/lab-3.png" alt="Biodegradable Ingredients">
                          <span>Biodegradable <br>Ingredients</span>
                      </div>
                      <div class="badge-item">
                          <img src="./images/lab-4.png" alt="Vegan & Cruelty-free">
                          <span>Vegan & <br> Cruelty-free</span>
                      </div>
                  </div>

                  <div class="product-info-sections">
                      <div class="info-section">
                          <h4 class="info-toggle active" data-target="details">Details</h4>
                          <div class="info-content details" style="display: block;">
                              <p>${product.details || 'No details available.'}</p>
                          </div>
                      </div>
                      <div class="info-section">
                          <h4 class="info-toggle" data-target="benefits">Benefits</h4>
                          <div class="info-content benefits">
                              <ul>
                                  ${(product.benefits || ['No benefits listed']).map(benefit => `
                                  <li>${benefit}</li>`).join('')}
                              </ul>
                          </div>
                      </div>
                      <div class="info-section">
                          <h4 class="info-toggle" data-target="howToUse">How To Use</h4>
                          <div class="info-content howToUse">
                              <ol>
                                  ${(product.howToUse || ['No usage instructions provided']).map(step => `
                                  <li>${step}</li>`).join('')}
                              </ol>
                          </div>
                      </div>
                      <div class="info-section">
                          <h4 class="info-toggle" data-target="ingredients">Ingredients</h4>
                          <div class="info-content ingredients">
                              <ul class="ingredients-list">
                                  ${(product.ingredients || ['No ingredients listed']).map(ingredient => `
                                  <li>${ingredient}</li>`).join('')}
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <h2>Related Products</h2>
          <div id="related-products" class="related-list"></div>
      `;

        // Set initial wishlist state
        const wishlistBtn = document.getElementById('add-to-wishlist');
        if (wishlistBtn) {
          const isIn = isInWishlist(product.id);
          updateWishlistButton(wishlistBtn, isIn);
        }

        document.querySelectorAll('.info-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                document.querySelectorAll('.info-content').forEach(content => content.style.display = 'none');
                document.querySelectorAll('.info-toggle').forEach(t => t.classList.remove('active'));
                const target = this.getAttribute('data-target');
                document.querySelector(`.info-content.${target}`).style.display = 'block';
                this.classList.add('active');
            });
        });

        document.getElementById('add-to-cart').addEventListener('click', () => {
          const quantity = parseInt(document.getElementById('qty').value);
          addToCart(product, quantity);
          
          // Show success message
          const msg = document.getElementById('cart-message');
          if (msg) {
            msg.textContent = 'Product added to cart!';
            setTimeout(() => msg.textContent = '', 3000);
          }
        });

        document.querySelector('.quantity-btn.minus').addEventListener('click', () => {
          const qtyInput = document.getElementById('qty');
          let value = parseInt(qtyInput.value);
          if (value > 1) qtyInput.value = value - 1;
        });

        document.querySelector('.quantity-btn.plus').addEventListener('click', () => {
          const qtyInput = document.getElementById('qty');
          let value = parseInt(qtyInput.value);
          qtyInput.value = value + 1;
        });

        renderRelatedProducts(product.id, products, product.category);
        updateCartCount();
        updateWishlistCount();
      } else {
        container.textContent = 'Product not found.';
      }
    });
} else {
  document.getElementById('product-detail').textContent = 'No product ID specified.';
}

function addToCart(product, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function renderRelatedProducts(currentId, products, category) {
  const container = document.getElementById('related-products');
  const related = products.filter(p => p.id != currentId && p.category === category).slice(0, 7);
  container.innerHTML = '';

  const carousel = document.createElement('div');
  carousel.className = 'owl-carousel owl-theme';
  container.appendChild(carousel);

  // Create custom navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'custom-nav-container';
  container.appendChild(navContainer);

  // Create custom navigation buttons
  const prevButton = document.createElement('button');
  prevButton.className = 'custom-prev';
  prevButton.innerHTML = '<img src="./images/previous.png" alt="Previous">';
  
  const nextButton = document.createElement('button');
  nextButton.className = 'custom-next';
  nextButton.innerHTML = '<img src="./images/previous.png" alt="Next">';
  
  navContainer.appendChild(prevButton);
  navContainer.appendChild(nextButton);

  related.forEach(product => {
    const price = parseFloat(product.price) || 0;
    const discount = product.discount || 0;
    const discountedPrice = price - (price * discount / 100);

    const finalPriceText = discount > 0
      ? `<span class="discounted-price">$${discountedPrice.toFixed(2)}</span><span class="discount-badge">${discount}% OFF</span>`
      : `<span>$${price.toFixed(2)}</span>`;

    const card = document.createElement('div');
    card.className = 'product-card item';
    card.innerHTML = `
      ${discount > 0 ? '<div class="ribbon">SALE</div>' : ''}
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="title_price">
        <h3>${product.name}</h3>
        <p>${finalPriceText}</p>
      </div>
      <div class="star-rating">
        ${generateStarRating(product.rating)}
      </div>
      <a href="product.html?id=${product.id}" class="view-product">View Product</a>
      <button class="add-btn">
        <img src="https://supriyoghosh-cmd.github.io/naturla-skincare/images/add-to-cart-btn.png" class="shopping_bag" />
      </button>
    `;

    card.querySelector('.add-btn').addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(product, 1);

      const btn = card.querySelector('.add-btn');
      btn.classList.add('added');
      setTimeout(() => btn.classList.remove('added'), 1000);

      const notification = document.createElement('div');
      notification.className = 'cart-notification';
      notification.innerHTML = `<span>${product.name} added to cart!</span>`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
      }, 2000);
    });

    carousel.appendChild(card);
  });

  // Initialize Owl Carousel and store reference
  const owl = $(carousel).owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 }
    }
  });

  // Hide default navigation
  $(carousel).find('.owl-nav').hide();

  // Add event listeners to custom buttons
  prevButton.addEventListener('click', () => {
    owl.trigger('prev.owl.carousel');
  });
  
  nextButton.addEventListener('click', () => {
    owl.trigger('next.owl.carousel');
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartInfo = document.getElementById('cart-info');
  if (cartInfo) {
    cartInfo.textContent = `${total}`;
    cartInfo.style.display = total > 0 ? 'flex' : 'none';
  }
}

// Update wishlist count
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const wishlistInfo = document.getElementById('wishlist-info');
  if (wishlistInfo) {
    wishlistInfo.textContent = `${wishlist.length}`;
    wishlistInfo.style.display = wishlist.length > 0 ? 'flex' : 'none';
  }
}

// Event delegation for wishlist buttons
document.addEventListener('click', function (event) {
  if (event.target.closest('.wishlist-btn')) {
    const btn = event.target.closest('.wishlist-btn');
    const productId = btn.dataset.productId;
    
    if (productId) {
      const added = toggleWishlist(productId);
      updateWishlistButton(btn, added, true);
      updateWishlistCount();

      // Trigger sidebar update immediately
      if (typeof renderWishlist === 'function') {
        renderWishlist();
      }
    }
  }
});

updateCartCount();
updateWishlistCount();


// zoom effect //
// most efficient way to add HTML, faster than innerHTML
const parseHTML = htmlStr => {
  const range = document.createRange()
  range.selectNode(document.body) // required in Safari
  return range.createContextualFragment(htmlStr)
}

// pass this function any image element to add magnifying functionality
const makeImgMagnifiable = img => {
  const id = `_${crypto.randomUUID()}`;
  const magnifierFragment = parseHTML(`
    <div id=${id} class="magnifier-container">
      <div class="magnifier">
        <img class="magnifier__img" src="${product.image}"/>
      </div>
    </div>
  `)
  
  // This preserves the original element reference instead of cloning it.
  img.parentElement.insertBefore(magnifierFragment, img)
  const magnifierContainerEl = document.querySelector(`#${id}`)
  img.remove()
  magnifierContainerEl.appendChild(img)
  
  // query the DOM for the newly added elements
  const magnifierEl = magnifierContainerEl.querySelector('.magnifier')
  const magnifierImg = magnifierEl.querySelector('.magnifier__img')
  
  // set up the transform object to be mutated as mouse events occur
  const transform = {
    translate: [0, 0],
    scale: 1,
  }
  
  // shortcut function to set the transform css property
  const setTransformStyle = (el, {translate, scale}) => {
    const [xPercent, yRawPercent] = translate
    const yPercent = yRawPercent < 0 ? 0 : yRawPercent
    
    // make manual pixel adjustments to better center
    // the magnified area over the cursor.
    const [xOffset, yOffset] = [
      `calc(-${xPercent}% + 250px)`,
      `calc(-${yPercent}% + 70px)`,
    ]

    el.style = `
      transform: scale(${scale}) translate(${xOffset}, ${yOffset});
    `
  }
  
  // show magnified thumbnail on hover
  img.addEventListener('mousemove', event => {
    const [mouseX, mouseY] = [event.pageX + 40, event.pageY - 20]
    const {top, left, bottom, right} = img.getBoundingClientRect()
    transform.translate = [
      ((mouseX - left) / right) * 100,
      ((mouseY - top) / bottom) * 100,
    ]
    magnifierEl.style = `
      display: block;
      top: ${mouseY}px;
      left: ${mouseX}px;
    `
    setTransformStyle(magnifierImg, transform)
  })
  
  // zoom in/out with mouse wheel
  img.addEventListener('wheel', event => {
    event.preventDefault()
    const scrollingUp = event.deltaY < 0
    const {scale} = transform
    transform.scale = scrollingUp && scale < 3
      ? scale + 0.1
      : !scrollingUp && scale > 1
      ? scale - 0.1
      : scale
    setTransformStyle(magnifierImg, transform)
  })
  
  // reset after mouse leaves
  img.addEventListener('mouseleave', () => {
    magnifierEl.style = ''
    magnifierImg.style = ''
  })
  
  
}

const img = document.querySelector('.image-preview-js')
makeImgMagnifiable(img)
