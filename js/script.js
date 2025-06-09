// Sidebar toggle logic
function openSidebar() {
  const sidebar = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.add('active');
  overlay.classList.add('show');
  document.body.classList.add('no-scroll');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('active');
  overlay.classList.remove('show');
  document.body.classList.remove('no-scroll');
}

// Bind events on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const overlay = document.getElementById('sidebarOverlay');

  if (hamburger) {
    hamburger.addEventListener('click', openSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
  }

  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebarMenu');
      sidebar.classList.remove('active');
      overlay.classList.remove('show');
      document.body.classList.remove('no-scroll');
    });
  }

  // ===== Wishlist Count Init ===== //
  updateWishlistCount();

  // ===== Wishlist Button Clicks ===== //
  document.querySelectorAll('.wishlist-btn').forEach(button => {
    button.addEventListener('click', function () {
      const productId = this.dataset.productId;
      const products = JSON.parse(localStorage.getItem('products') || []);
      const product = products.find(p => p.id == productId);

      if (product) {
        addToWishlist(product);

        const icon = this.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid', 'liked');
          icon.style.animation = 'pulse 0.4s ease';
          icon.addEventListener('animationend', () => {
            icon.style.animation = '';
          }, { once: true });
        }
      }
      if (typeof renderWishlist === 'function') {
        renderWishlist();
      }
    });
  });
});

// ========== Wishlist Sidebar Toggle ========== //
function toggleWishlistSidebar() {
  const sidebar = document.getElementById('wishlistSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    document.body.classList.toggle('no-scroll', sidebar.classList.contains('open'));
  }
}

// ========== Wishlist Logic ========== //
function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const existing = wishlist.find(item => item.id === product.id);

  if (!existing) {
    wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    const msg = document.getElementById('cart-message');
    if (msg) {
      msg.textContent = 'Added to wishlist!';
      setTimeout(() => msg.textContent = '', 3000);
    }
  } else {
    const msg = document.getElementById('cart-message');
    if (msg) {
      msg.textContent = 'Already in wishlist!';
      setTimeout(() => msg.textContent = '', 3000);
    }
  }
}

function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const wishlistInfo = document.getElementById('wishlist-info');
  if (wishlistInfo) {
    wishlistInfo.textContent = `${wishlist.length}`;
    wishlistInfo.style.display = wishlist.length > 0 ? 'flex' : 'none';
  }
}

// ========== Active Menu Highlight ========== //
$(document).ready(function () {
  const currentPath = window.location.pathname.split("/").pop();
  $('.nav-link').each(function () {
    const linkPath = $(this).attr('href');
    if (
      linkPath === currentPath ||
      (currentPath === '' && linkPath === 'index.html')
    ) {
      $(this).css('color', '#cf0115');
    }
  });

  // ========== FAQ Accordion ========== //
  $('.faq-question').click(function () {
    $('.faq-item').not($(this).parent()).removeClass('active');
    $('.faq-item').not($(this).parent()).find('.faq-answer').css('max-height', '0').css('padding-bottom', '0');

    $(this).parent().toggleClass('active');
    if ($(this).parent().hasClass('active')) {
      $(this).next('.faq-answer').css('max-height', '500px').css('padding-bottom', '20px');
    } else {
      $(this).next('.faq-answer').css('max-height', '0').css('padding-bottom', '0');
    }
  });

  $('.faq-item:first').addClass('active');
  $('.faq-item:first .faq-answer').css('max-height', '500px').css('padding-bottom', '20px');

  // ========== Owl Carousel (Testimonials) ========== //
  const owl = $('.testimonial-slider');
  owl.owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
    dots: false,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1024: { items: 2 },
      1200: { items: 2 }
    }
  });

  $('.owl-next').click(() => owl.trigger('next.owl.carousel'));
  $('.owl-prev').click(() => owl.trigger('prev.owl.carousel'));
});

// ========== Sticky Header ========== //
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
const scrollOffset = 50;

window.addEventListener('scroll', function () {
  const currentScroll = window.pageYOffset;

  if (currentScroll > scrollOffset) {
    navbar.classList.add('scrolled');
    if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
      navbar.classList.add('hidden');
    } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
      navbar.classList.remove('hidden');
      navbar.style.animation = 'headerSlideDown 0.3s ease-out';
    }
  } else {
    navbar.classList.remove('scrolled', 'hidden');
  }

  lastScroll = currentScroll;
});

navbar.addEventListener('animationend', function () {
  this.style.animation = '';
});

// search //
document.getElementById('global-search-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('global-search-input');
  const keyword = input?.value?.trim();
  if (keyword) {
    window.location.href = `shop.html?search=${encodeURIComponent(keyword)}`;
  }
});


$(document).ready(function() {
  $('#close-btn').click(function() {
    $('#search-overlay').fadeOut();
    $('#search-btn').show();
    $('body').css('overflow', 'unset');
  });
  $('#search-btn').click(function() {
    $(this).hide();
    $('#search-overlay').fadeIn();
    $('body').css('overflow', 'hidden');
  });
});


// Scroll to top //
$(document).ready(function(){
  $(window).scroll(function(){
    if ($(this).scrollTop() > 2000) {
      $("#scroll").fadeIn();
      } else {
      $("#scroll").fadeOut();
    }
  });
  
  $("#scroll").click(function(){
    $("html, body").animate({ scrollTop: 0 }, 900);
    return false;
  });
});