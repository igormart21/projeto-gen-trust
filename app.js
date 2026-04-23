(function () {
  const C = window.GT_CatalogCore;
  if (!C) return;

  const { readProducts, formatBRL, productDetailHref } = C;

  const FEATURED_COUNT = 6;

  function T(key) {
    return window.GT_i18n ? window.GT_i18n.t(key) : key;
  }

  function renderFeatured() {
    const grid = document.getElementById("featuredProducts");
    if (!grid) return;

    const products = readProducts();
    const slice = products.slice(0, FEATURED_COUNT);

    grid.innerHTML = "";
    slice.forEach((product) => {
      const thumb = product.images[0];
      const card = document.createElement("article");
      const nudgedCoverClass = product.id === "gt-p014" ? " product-card--cover-up" : "";
      card.className = `product-card product-card--clickable product-card--compact${nudgedCoverClass}`;
      card.innerHTML = `
        <a class="product-card__cover" href="${productDetailHref(product.id)}">
          <img src="${thumb}" alt="" loading="lazy" width="640" height="360">
        </a>
        <div class="product-card__body">
          <div class="product-top">
            <span class="badge">${product.badge}</span>
          </div>
          <h3><a href="${productDetailHref(product.id)}">${product.name}</a></h3>
          <p class="product-meta">${product.dosage} · <span class="product-price">${formatBRL(product.price)}</span></p>
          <div class="product-card__actions">
            <a class="btn btn-primary" href="${productDetailHref(product.id)}">${T("btn_view_product")}</a>
            <button type="button" class="btn btn-outline" data-add-cart="${product.id}">${T("btn_add_cart")}</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderFeatured();
  window.addEventListener("gt:locale", renderFeatured);
})();
