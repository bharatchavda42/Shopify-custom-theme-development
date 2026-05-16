/* ===================================================
   AMARI HORIZON — PREDICTIVE SEARCH JS
   =================================================== */

(function () {
  'use strict';

  if (!window.theme || !window.theme.predictiveSearch) return;

  var input   = document.getElementById('SearchInput');
  var results = document.getElementById('SearchResults');
  if (!input || !results) return;

  var timer = null;
  var MIN_CHARS = 2;

  input.addEventListener('input', function () {
    clearTimeout(timer);
    var query = input.value.trim();
    if (query.length < MIN_CHARS) { results.innerHTML = ''; return; }
    timer = setTimeout(function () { fetchResults(query); }, 300);
  });

  function fetchResults(query) {
    var url = '/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product&resources[limit]=6&resources[options][fields]=title,product_type,variants.title';
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) { renderResults(data.resources && data.resources.results && data.resources.results.products || []); })
      .catch(function (err) { console.error('Search error:', err); });
  }

  function renderResults(products) {
    if (!products.length) {
      results.innerHTML = '<p style="padding:var(--space-4);color:var(--color-text-muted);">No results found.</p>';
      return;
    }
    var html = '';
    products.forEach(function (p) {
      var price = p.price ? '$' + (p.price / 100).toFixed(2) : '';
      var img = p.featured_image ? '<img src="' + p.featured_image.url + '&width=128" alt="' + (p.featured_image.alt || p.title) + '" class="search-result-item__image" width="64" height="64" loading="lazy">' : '<div style="width:64px;height:64px;background:var(--color-bg-alt);"></div>';
      html += '<a href="' + p.url + '" class="search-result-item">';
      html += img;
      html += '<div><p style="font-weight:var(--weight-bold);font-size:var(--text-base);">' + p.title + '</p>';
      if (price) html += '<p style="font-size:var(--text-sm);color:var(--color-text-muted);">' + price + '</p>';
      html += '</div></a>';
    });
    html += '<div style="padding:var(--space-4);border-top:1px solid var(--color-border);">';
    html += '<a href="/search?type=product&q=' + encodeURIComponent(input.value) + '" style="font-size:var(--text-sm);font-weight:var(--weight-bold);">View all results for "' + input.value + '" &rarr;</a>';
    html += '</div>';
    results.innerHTML = html;
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.innerHTML = '';
    }
  });

})();
