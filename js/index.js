// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  loadProducts();
  setupSkinTypeTabs();
});

// Setup skin type tabs functionality
function setupSkinTypeTabs() {
  const productsByTab = {
    dry: [0, 1, 2, 3],
    oily: [4, 5, 6, 7],
    sensitive: [8, 9, 10, 11],
    combination: [12, 13, 14, 15]
  };

  const tabButtons = document.querySelectorAll(".tab-btn");
  if (!tabButtons.length) return; // Exit if not on shop page

  fetch("products.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((products) => {
      // Render products for each tab
      for (const tab in productsByTab) {
        renderProducts(tab, productsByTab[tab], products);
      }
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });

  function renderProducts(tabId, productIndexes, allProducts) {
    const container = document.getElementById(`${tabId}-products`);
    if (!container) return;

    container.innerHTML = "";
    productIndexes.forEach((i) => {
      if (i < 0 || i >= allProducts.length) return;

      const p = allProducts[i];
      container.appendChild(createProductCard(p));
    });
  }

  // Add event listeners to tab buttons
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

// Update cart count in the UI
function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartInfo = document.getElementById('cart-info');

    if (cartInfo) {
      cartInfo.textContent = total;
      // Show/hide badge based on cart items
      cartInfo.style.display = total > 0 ? 'flex' : 'none';
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    localStorage.setItem('cart', JSON.stringify([]));
    if (document.getElementById('cart-info')) {
      document.getElementById('cart-info').textContent = '0';
    }
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === product.id);

  const maxQty = product.stock || 1; // fallback in case stock isn't defined

  if (existing) {
    if (existing.quantity >= maxQty) {
      showCartLimitWarning(product.name);
      return; // stop adding
    }
    existing.quantity += 1;
  } else {
    if (maxQty < 1) {
      showCartLimitWarning(product.name);
      return;
    }
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartNotification(product.name);
}

// Show temporary notification when item is added
function showCartNotification(productName) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
  <span>${productName} added to cart!</span>
`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

// Product stock 
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

// Render star rating HTML
function renderRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

// Create product card HTML
function createProductCard(product) {
  const price = parseFloat(product.price) || 0;
  const discount = product.discount || 0;
  const discountedPrice = price - (price * discount / 100);

  const finalPriceText = discount > 0
    ? `<span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
     <span class="discount-badge">-${discount}%</span>`
    : `<span>$${price.toFixed(2)}</span>`;

  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
  ${discount > 0 ? '<div class="ribbon">SALE</div>' : ''}
  <a href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy"></a>
  <div class="title_price">
    <h3>${product.name}</h3>
    <p>${finalPriceText}</p>
  </div>
  <div class="rating">
    ${renderRatingStars(product.rating || 0)}
    <span class="review-count">${product.reviewCount || 0}+ reviews</span>
  </div>
  <a href="product.html?id=${product.id}" class="view-product">View Product</a>
  <button class="add-btn">
    <img src="https://supriyoghosh-cmd.github.io/naturla-skincare/images/add-to-cart-btn.png" class="shopping_bag" />
  </button>
`;

  card.querySelector('.add-btn').addEventListener('click', () => {
    addToCart(product);
    // Add animation effect
    const btn = card.querySelector('.add-btn');
    btn.classList.add('added');
    setTimeout(() => btn.classList.remove('added'), 1000);
  });

  return card;
}

// Load and display products
function loadProducts() {
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      // Display featured products
      const featuredContainer = document.getElementById('featured-products');
      if (featuredContainer) {
        const featuredProductIds = getFeaturedProductIds(products, 4);

        const productMap = {};
        products.forEach(product => {
          productMap[product.id] = product;
        });

        const orderedProducts = featuredProductIds
          .map(id => productMap[id])
          .filter(product => product); // Filter out undefined if any ID is invalid
        featuredContainer.innerHTML = '';
        orderedProducts.forEach(product => {
          featuredContainer.appendChild(createProductCard(product));
        });
      }

      // Display all products (if on shop page)
      const allProductsContainer = document.getElementById('product-list');
      if (allProductsContainer) {
        products.forEach(product => {
          allProductsContainer.appendChild(createProductCard(product));
        });
      }
    })
    .catch(error => {
      console.error('Error loading products:', error);
    });
}

function getFeaturedProductIds(productList, count = 4) {
  const storageKey = 'featuredProductSelection';
  const saved = JSON.parse(localStorage.getItem(storageKey));
  const now = new Date();

  if (saved && saved.timestamp) {
    const savedTime = new Date(saved.timestamp);
    const timeDiff = (now - savedTime) / 1000; // seconds

    if (timeDiff < 60 && Array.isArray(saved.ids)) {
      return saved.ids; // reuse if less than 1 minute has passed
    }
  }

  // Pick new random unique product IDs
  const shuffled = [...productList].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count).map(p => p.id);

  // Save new selection
  localStorage.setItem(storageKey, JSON.stringify({
    ids: selected,
    timestamp: now.toISOString()
  }));

  return selected;
}

// Toggle mobile sidebar (if needed)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebarMenu');
  sidebar.classList.toggle('active');
}