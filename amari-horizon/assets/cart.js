/* ===================================================
   AMARI HORIZON — CART JS
   AJAX add-to-cart, drawer update, page cart
   =================================================== */

(function () {
  'use strict';

  /* ── ADD TO CART (PDP form) ─────────────────────── */
  var form = document.getElementById('ProductForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (window.theme && window.theme.cartType === 'drawer') {
        e.preventDefault();
        var btn = document.getElementById('AddToCart');
        if (btn) { btn.disabled = true; btn.textContent = 'Adding...'; }

        var formData = new FormData(form);
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          body: formData
        })
        .then(function (r) { return r.json(); })
        .then(function (item) {
          if (item.status === 422) throw new Error(item.description);
          return fetch('/cart.js');
        })
        .then(function (r) { return r.json(); })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          openCartDrawer();
          if (btn) { btn.disabled = false; btn.textContent = 'Add to Cart'; }
        })
        .catch(function (err) {
          alert(err.message || 'Could not add to cart');
          if (btn) { btn.disabled = false; btn.textContent = 'Add to Cart'; }
        });
      }
    });
  }

  function updateCartCount(count) {
    var el = document.getElementById('CartCount');
    if (el) el.textContent = count;
    var el2 = document.getElementById('DrawerCartCount');
    if (el2) el2.textContent = count;
  }

  function openCartDrawer() {
    var drawer = document.getElementById('CartDrawer');
    if (!drawer) return;
    // Reload drawer content
    fetch('/?section_id=cart-drawer')
      .catch(function () {});
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /* ── CART PAGE FORM (remove buttons) ─────────────── */
  var cartForm = document.getElementById('CartForm');
  if (cartForm) {
    cartForm.addEventListener('click', function (e) {
      if (e.target.classList.contains('cart-item__remove')) {
        e.preventDefault();
        var idx = e.target.dataset.index;
        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line: idx, quantity: 0 })
        })
        .then(function (r) { return r.json(); })
        .then(function () { window.location.reload(); });
      }
    });
  }

})();
