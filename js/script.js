// // Header js start //

// // Menu toggle for Mobile version
// function toggleSidebar() {
//   const sidebar = document.getElementById('sidebarMenu');
//   sidebar.classList.toggle('active');
//   if (sidebar.classList.contains('active')) {
//     document.addEventListener('click', handleOutsideClick);
//   } else {
//     document.removeEventListener('click', handleOutsideClick);
//   }
// }

// function handleOutsideClick(event) {
//   const sidebar = document.getElementById('sidebarMenu');
//   const isClickInside = sidebar.contains(event.target);
//   const isToggleButton = event.target.closest('.hamburger');

//   if (!isClickInside && !isToggleButton) {
//     sidebar.classList.remove('active');
//     document.removeEventListener('click', handleOutsideClick);
//   }
// }

// // Active menu link //
// $(document).ready(function () {
//   const currentPath = window.location.pathname.split("/").pop();

//   $('.nav-link').each(function () {
//     const linkPath = $(this).attr('href');
//     if (
//       linkPath === currentPath ||
//       (currentPath === '' && linkPath === 'index.html')
//     ) {
//       $(this).css('color', '#cf0115');
//     }
//   });
// });

// // Sticky Header with Scroll Animations
// let lastScroll = 0;
// const navbar = document.querySelector('.navbar');
// const scrollOffset = 50; // Adjust this value to change when effects trigger

// window.addEventListener('scroll', function () {
//   const currentScroll = window.pageYOffset;

//   if (currentScroll > scrollOffset) {
//     navbar.classList.add('scrolled');

//     if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
//       navbar.classList.add('hidden');
//     } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
//       navbar.classList.remove('hidden');
//       navbar.style.animation = 'headerSlideDown 0.3s ease-out';
//     }
//   } else {
//     navbar.classList.remove('scrolled', 'hidden');
//   }

//   lastScroll = currentScroll;
// });

// navbar.addEventListener('animationend', function () {
//   this.style.animation = '';
// });

// // Header js end //

// // Testimonial start
// $(document).ready(function () {
//   var owl = $('.testimonial-slider');
//   owl.owlCarousel({
//     loop: true,
//     margin: 0,
//     nav: false,
//     dots: false,
//     responsive: {
//       0: { items: 1 },
//       768: { items: 2 },
//       1024: { items: 2 },
//       1200: { items: 2 }
//     }
//   });

//   $('.owl-next').click(function () {
//     owl.trigger('next.owl.carousel');
//   });
//   $('.owl-prev').click(function () {
//     owl.trigger('prev.owl.carousel');
//   });
// });
// // Testimonial end

// // FAQ start
// $(document).ready(function () {
//   $('.faq-question').click(function () {
//     $('.faq-item').not($(this).parent()).removeClass('active');
//     $('.faq-item').not($(this).parent()).find('.faq-answer').css('max-height', '0').css('padding-bottom', '0');

//     $(this).parent().toggleClass('active');
//     if ($(this).parent().hasClass('active')) {
//       $(this).next('.faq-answer').css('max-height', '500px').css('padding-bottom', '20px');
//     } else {
//       $(this).next('.faq-answer').css('max-height', '0').css('padding-bottom', '0');
//     }
//   });

//   $('.faq-item:first').addClass('active');
//   $('.faq-item:first .faq-answer').css('max-height', '500px').css('padding-bottom', '20px');
// });
// // FAQ end

// // ============== WISHLIST FUNCTIONALITY (ADDED) ============== //

// // Add to wishlist function (global)
// function addToWishlist(product) {
//   let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//   const existing = wishlist.find(item => item.id === product.id);

//   if (!existing) {
//     wishlist.push(product);
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//     updateWishlistCount();

//     const msg = document.getElementById('cart-message');
//     if (msg) {
//       msg.textContent = 'Added to wishlist!';
//       setTimeout(() => msg.textContent = '', 3000);
//     }
//   } else {
//     const msg = document.getElementById('cart-message');
//     if (msg) {
//       msg.textContent = 'Already in wishlist!';
//       setTimeout(() => msg.textContent = '', 3000);
//     }
//   }
// }

// // Update wishlist count in header
// function updateWishlistCount() {
//   const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//   const wishlistInfo = document.getElementById('wishlist-info');
//   if (wishlistInfo) {
//     wishlistInfo.textContent = `${wishlist.length}`;
//     wishlistInfo.style.display = wishlist.length > 0 ? 'flex' : 'none';
//   }
// }

// // Initialize wishlist count and add click handlers
// document.addEventListener('DOMContentLoaded', () => {
//   updateWishlistCount();

//   document.querySelectorAll('.wishlist-btn').forEach(button => {
//     button.addEventListener('click', function () {
//       const productId = this.dataset.productId;
//       const products = JSON.parse(localStorage.getItem('products') || []);
//       const product = products.find(p => p.id == productId);

//       if (product) {
//         addToWishlist(product);

//         const icon = this.querySelector('i');
//         if (icon) {
//           // Swap regular to solid and animate
//           icon.classList.remove('fa-regular');
//           icon.classList.add('fa-solid', 'liked');

//           icon.style.animation = 'pulse 0.4s ease';
//           icon.addEventListener('animationend', () => {
//             icon.style.animation = '';
//           }, { once: true });
//         }
//       }
//       if (typeof renderWishlist === 'function') {
//         renderWishlist();
//       }  
//     });
//   });
// });

// // ============== END WISHLIST FUNCTIONALITY ============== //


// // Wishlist sidebar //
// // Add this to the existing script.js
// function toggleWishlistSidebar() {
//   const sidebar = document.getElementById('wishlistSidebar');
//   const overlay = document.getElementById('overlay');
//   if (sidebar && overlay) {
//       sidebar.classList.toggle('open');
//       overlay.classList.toggle('show');
//       document.body.classList.toggle('no-scroll', sidebar.classList.contains('open'));
//   }
// }


// ========== Sidebar Toggle (Updated Version) ========== //
// function toggleSidebar() {
//   const sidebar = document.getElementById('sidebarMenu');
//   const overlay = document.getElementById('sidebarOverlay');

//   if (sidebar && overlay) {
//     const isActive = sidebar.classList.contains('active');
//     sidebar.classList.toggle('active');
//     overlay.classList.toggle('show', !isActive);
//     document.body.classList.toggle('no-scroll', !isActive);
//   }
// }

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

