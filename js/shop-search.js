// 📄 shop-search.js (updated for products.json structure)

let allProducts = [];

async function loadProductsForSearch() {
  const res = await fetch('./products.json');
  const data = await res.json();
  allProducts = data;

  const keyword = getSearchKeywordFromURL();
  if (keyword) {
    document.getElementById('search-input').value = keyword;
    const filtered = filterProducts(keyword);
    renderSearchResults(filtered);
  } else {
    renderSearchResults(allProducts);
  }
}

function filterProducts(keyword) {
  keyword = keyword.toLowerCase();
  return allProducts.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    p.category?.toLowerCase().includes(keyword)
  );
}

function renderSearchResults(filtered) {
  const container = document.getElementById('all-products');
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-center">No products match your search.</p>';
    return;
  }

  filtered.forEach(product => {
    const price = parseFloat(product.price);
    const discount = product.discount || 0;
    const discountedPrice = price - (price * discount / 100);

    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <div class="card">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text title_price">
            ${discount > 0 ? `<span class="discounted-price">$${discountedPrice.toFixed(2)}</span><span class="original-price">$${price.toFixed(2)}</span>` : `$${price.toFixed(2)}`}
          </p>
          <a href="product.html?id=${product.id}" class="btn btn-sm btn-outline-dark">View Details</a>
        </div>
      </div>`;

    container.appendChild(div);
  });
}

function setupSearchHandler() {
  const input = document.getElementById('search-input');

  input.addEventListener('input', () => {
    const keyword = input.value.trim();
    const filtered = filterProducts(keyword);
    renderSearchResults(filtered);
  });
}

function getSearchKeywordFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('search')?.toLowerCase() || '';
}

window.addEventListener('DOMContentLoaded', () => {
  loadProductsForSearch();
  setupSearchHandler();
});
