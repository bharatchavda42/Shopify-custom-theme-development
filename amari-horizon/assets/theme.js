/* ===================================================
   AMARI HORIZON — THEME JS
   Header sticky, drawer, accordion, tabs, countdown
   =================================================== */

(function () {
  'use strict';

  /* ── STICKY HEADER ─────────────────────────────── */
  var header = document.getElementById('SiteHeader');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 10) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
      lastScroll = y;
    }, { passive: true });
  }

  /* ── MOBILE DRAWER ─────────────────────────────── */
  var menuToggle  = document.getElementById('MenuToggle');
  var mobileDrawer = document.getElementById('MobileDrawer');
  var mobileOverlay = document.getElementById('MobileOverlay');
  var mobileClose  = document.getElementById('MobileDrawerClose');

  function openMobileMenu() {
    mobileDrawer.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileClose && mobileClose.focus();
  }
  function closeMobileMenu() {
    mobileDrawer.classList.remove('is-open');
    menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle && menuToggle.focus();
  }

  if (menuToggle)  menuToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  /* ── CART DRAWER ───────────────────────────────── */
  var cartToggle  = document.getElementById('CartToggle');
  var cartDrawer  = document.getElementById('CartDrawer');
  var cartOverlay = document.getElementById('CartOverlay');
  var cartClose   = document.getElementById('CartDrawerClose');
  var cartClose2  = document.getElementById('CartDrawerClose2');

  function openCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartToggle && cartToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartToggle && cartToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (cartToggle)  cartToggle.addEventListener('click', openCartDrawer);
  if (cartClose)   cartClose.addEventListener('click', closeCartDrawer);
  if (cartClose2)  cartClose2.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  /* ── SEARCH DRAWER ─────────────────────────────── */
  var searchToggle = document.getElementById('SearchToggle');
  var searchPanel  = document.getElementById('PredictiveSearch');
  var searchClose  = document.getElementById('SearchClose');
  var searchOverlay = searchPanel && searchPanel.querySelector('.predictive-search__overlay');

  function openSearch() {
    if (!searchPanel) return;
    searchPanel.classList.add('is-open');
    searchPanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var input = document.getElementById('SearchInput');
    if (input) input.focus();
  }
  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.classList.remove('is-open');
    searchPanel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (searchToggle)  searchToggle.addEventListener('click', openSearch);
  if (searchClose)   searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

  /* ── ESC KEY ────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (mobileDrawer && mobileDrawer.classList.contains('is-open')) closeMobileMenu();
    if (cartDrawer   && cartDrawer.classList.contains('is-open'))   closeCartDrawer();
    if (searchPanel  && searchPanel.classList.contains('is-open'))  closeSearch();
  });

  /* ── PRODUCT TABS (accordion on PDP) ───────────── */
  document.querySelectorAll('.product-tab__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.closest('.product-tab');
      var wasOpen = tab.classList.contains('is-open');
      // Close all
      document.querySelectorAll('.product-tab').forEach(function (t) { t.classList.remove('is-open'); });
      if (!wasOpen) tab.classList.add('is-open');
    });
  });

  /* ── GALLERY THUMBNAILS (PDP) ───────────────────── */
  var thumbs = document.querySelectorAll('.product-gallery__thumb');
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var id = thumb.dataset.mediaId;
      thumbs.forEach(function (t) { t.classList.remove('is-active'); });
      thumb.classList.add('is-active');
      document.querySelectorAll('.product-gallery__slide').forEach(function (slide) {
        slide.style.display = slide.dataset.mediaId === id ? '' : 'none';
        slide.classList.toggle('is-active', slide.dataset.mediaId === id);
      });
    });
  });

  /* ── QUANTITY BUTTONS (PDP) ─────────────────────── */
  var qtyMinus = document.getElementById('QtyMinus');
  var qtyPlus  = document.getElementById('QtyPlus');
  var qtyField = document.querySelector('.quantity-input__field');

  if (qtyMinus && qtyPlus && qtyField) {
    qtyMinus.addEventListener('click', function () {
      var v = Math.max(1, parseInt(qtyField.value, 10) - 1);
      qtyField.value = v;
    });
    qtyPlus.addEventListener('click', function () {
      qtyField.value = parseInt(qtyField.value, 10) + 1;
    });
  }

  /* ── CART DRAWER QTY BUTTONS ───────────────────── */
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('qty-minus') || e.target.classList.contains('qty-plus')) {
      var idx = e.target.dataset.index;
      var span = document.getElementById('DrawerQty-' + idx);
      if (!span) return;
      var qty = parseInt(span.textContent, 10);
      qty = e.target.classList.contains('qty-minus') ? Math.max(0, qty - 1) : qty + 1;
      updateCartItem(idx, qty);
    }
    if (e.target.classList.contains('cart-item__remove')) {
      var idx2 = e.target.dataset.index;
      updateCartItem(idx2, 0);
    }
  });

  function updateCartItem(index, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: index, quantity: qty })
    })
    .then(function (r) { return r.json(); })
    .then(function (cart) { refreshCartDrawer(cart); })
    .catch(function (err) { console.error('Cart update error:', err); });
  }

  function refreshCartDrawer(cart) {
    var countEl = document.getElementById('CartCount');
    var drawerCount = document.getElementById('DrawerCartCount');
    var totalEl = document.getElementById('DrawerCartTotal');
    var money = formatMoney(cart.total_price);

    if (countEl) countEl.textContent = cart.item_count;
    if (drawerCount) drawerCount.textContent = cart.item_count;
    if (totalEl) totalEl.textContent = money;

    // Reload drawer body via page fetch for full accuracy
    fetch('/?sections=cart-drawer')
      .then(function (r) { return r.json(); })
      .catch(function () {});
  }

  function formatMoney(cents) {
    var dollars = (cents / 100).toFixed(2);
    return '$' + dollars;
  }

  /* ── ANIMATIONS (scroll-in) ─────────────────────── */
  if (window.theme && window.theme.animations) {
    var animEls = document.querySelectorAll('.product-card, .section-header, .testimonial-card');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      animEls.forEach(function (el) {
        el.style.animation = 'fadeSlideUp 0.5s ease both paused';
        io.observe(el);
      });
    }
  }

  /* ── MARQUEE SPEED OVERRIDE ─────────────────────── */
  document.querySelectorAll('.marquee__track').forEach(function (track) {
    var section = track.closest('[data-speed]');
    if (section) {
      var speed = section.dataset.speed || 30;
      track.style.animationDuration = speed + 's';
    }
  });

})();

/* CSS animation keyframe injection */
(function () {
  var style = document.createElement('style');
  style.textContent = '@keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }';
  document.head.appendChild(style);
})();
