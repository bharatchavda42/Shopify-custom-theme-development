/* ===================================================
   AMARI HORIZON — PRODUCT FORM JS
   Variant picker, price update, availability
   =================================================== */

(function () {
  'use strict';

  var form = document.getElementById('ProductForm');
  if (!form) return;

  var variantInput = document.getElementById('ProductVariantId');
  var priceEl      = document.getElementById('ProductPrice');
  var addToCart    = document.getElementById('AddToCart');
  var variantBtns  = document.querySelectorAll('.variant-btn');

  if (!variantInput) return;

  /* Build a map of option combinations → variant data */
  var variants = JSON.parse(document.getElementById('ProductVariantsJson') ? document.getElementById('ProductVariantsJson').textContent : '[]');

  /* Inject hidden script tag with variants JSON if needed */
  if (!variants.length) {
    // Variants data embedded by Liquid — fallback gracefully
    return;
  }

  var selectedOptions = [];

  function getSelectedOptions() {
    var opts = [];
    var maxIndex = -1;
    variantBtns.forEach(function (btn) {
      if (btn.classList.contains('is-selected')) {
        var idx = parseInt(btn.dataset.optionIndex, 10);
        opts[idx] = btn.dataset.optionValue;
        if (idx > maxIndex) maxIndex = idx;
      }
    });
    return opts;
  }

  function findVariant(options) {
    return variants.find(function (v) {
      return v.options.every(function (opt, i) {
        return opt === options[i];
      });
    });
  }

  function updateUI(variant) {
    if (!variant) return;

    variantInput.value = variant.id;

    // Price
    if (priceEl) {
      var price = formatMoney(variant.price);
      var compare = variant.compare_at_price && variant.compare_at_price > variant.price;
      var html = '<span class="price__current' + (compare ? '' : '') + '">' + price + '</span>';
      if (compare) html += '<span class="price__compare">' + formatMoney(variant.compare_at_price) + '</span>';
      priceEl.innerHTML = '<div class="price' + (compare ? ' price--on-sale' : '') + '">' + html + '</div>';
    }

    // Add to cart button
    if (addToCart) {
      addToCart.disabled = !variant.available;
      addToCart.textContent = variant.available ? 'Add to Cart' : 'Sold Out';
    }

    // URL update
    var url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url.toString());
  }

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  // Handle variant button clicks
  variantBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var index = parseInt(btn.dataset.optionIndex, 10);
      // Deselect siblings
      document.querySelectorAll('.variant-btn[data-option-index="' + index + '"]').forEach(function (b) {
        b.classList.remove('is-selected');
      });
      btn.classList.add('is-selected');

      var opts = getSelectedOptions();
      var variant = findVariant(opts);
      if (variant) updateUI(variant);
    });
  });

})();
