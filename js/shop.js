document.addEventListener("DOMContentLoaded", function () {
  let allProducts = []; 
  let currentCategory = "all"; 
  let currentSort = "default"; 

  updateCartCount();

  fetch("products.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((products) => {
      allProducts = products;
      renderAllProducts(allProducts);

      // Setup filter event listener
      const filterSelect = document.getElementById('filter-select');
      if (filterSelect) {
        filterSelect.addEventListener('change', function () {
          currentSort = this.value;
          applyFilters();
        });
      }

      // Setup category tabs
      const categoryTabs = document.querySelectorAll('#categoryTabs .nav-link');
      categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
          categoryTabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          currentCategory = this.dataset.category;
          applyFilters();
          
          // Update mobile dropdown
          const mobileSelect = document.getElementById('mobile-category-select');
          if (mobileSelect) {
            mobileSelect.value = currentCategory;
          }
        });
      });

      // Setup mobile category dropdown
      const mobileCategorySelect = document.getElementById('mobile-category-select');
      if (mobileCategorySelect) {
        mobileCategorySelect.addEventListener('change', function() {
          currentCategory = this.value;
          applyFilters();
          
          // Update active tab
          categoryTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === currentCategory) {
              tab.classList.add('active');
            }
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });

  function applyFilters() {
    let filteredProducts = [...allProducts];
    
    // Apply category filter
    if (currentCategory !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    
    // Apply sort filter
    filteredProducts = sortProducts(filteredProducts, currentSort);
    
    renderAllProducts(filteredProducts);
  }

  function sortProducts(products, sortType) {
    let sorted = [...products];
    
    switch (sortType) {
      case 'discount':
        sorted = sorted.filter(p => p.discount > 0)
          .sort((a, b) => b.discount - a.discount);
        break;
      case 'price-low':
        sorted.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // No sorting, use original order
        break;
    }
    
    return sorted;
  }

  function renderAllProducts(products) {
    const container = document.getElementById('all-products');
    if (!container) return;

    container.innerHTML = '';

    products.forEach(p => {
      container.appendChild(createProductCard(p));
    });
  }

  function createProductCard(p) {
    const discounted = p.discount > 0;
    const discountPrice = discounted ? (p.price * (1 - p.discount / 100)).toFixed(2) : null;

    const priceHTML = discounted
      ? `<span class="discounted-price">$${discountPrice}</span><span class="original-price">$${p.price.toFixed(2)}</span>`
      : `<span class="price">$${p.price.toFixed(2)}</span>`;

    const badge = discounted
      ? `<div class="discount-badge">-${p.discount}%</div>`
      : "";

    const card = document.createElement("div");
    card.innerHTML = `
        <div class="product-card">
          ${badge}
          <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy" class="img-fluid"></a>
          <div class="title_price">
            <h3>${p.name}</h3>
            <p>${priceHTML}</p>
          </div>
          <div class="rating">
            ${renderRatingStars(p.rating)}
            <span class="shopCard_review">${p.reviewCount || 0}+ reviews</span>
          </div>
          <a href="product.html?id=${p.id}" class="view-product">View Product</a>
          <button class="add-btn">
            <img src="../images/add-to-cart-btn.png" class="shopping_bag" />
          </button>
        </div>
      `;

    card.querySelector(".add-btn").addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(p, 1);

      const btn = card.querySelector(".add-btn");
      btn.classList.add("added");
      setTimeout(() => btn.classList.remove("added"), 1000);

      const notification = document.createElement("div");
      notification.className = "cart-notification";
      notification.innerHTML = `<span>${p.name} added to cart!</span>`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add("fade-out");
        setTimeout(() => notification.remove(), 500);
      }, 2000);
    });

    return card;
  }

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

  function addToCart(product, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartInfo = document.getElementById("cart-info");

    if (cartInfo) {
      cartInfo.textContent = total > 0 ? total : '';
      cartInfo.style.display = total > 0 ? 'block' : 'none';
    }
  }

  // Add event listener for pageshow to update cart count when navigating back
  window.addEventListener('pageshow', function (event) {
    updateCartCount();
  });
});
