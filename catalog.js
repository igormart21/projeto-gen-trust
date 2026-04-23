(function () {
  const C = window.GT_CatalogCore;
  if (!C) return;

  const { readProducts, formatBRL, productDetailHref, orderedCategories } = C;

  function T(key) {
    return window.GT_i18n ? window.GT_i18n.t(key) : key;
  }

  function labelCategory(cat) {
    if (cat === "Todos") return T("cat_all");
    return cat;
  }

  let filterListenerAttached = false;

  function renderFilters(products, onFiltered) {
    const filterContainer = document.getElementById("categoryFilters");
    if (!filterContainer) return;

    const categories = orderedCategories(products);
    filterContainer.innerHTML = "";
    categories.forEach((category, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-chip${index === 0 ? " active" : ""}`;
      button.textContent = labelCategory(category);
      button.dataset.category = category;
      filterContainer.appendChild(button);
    });

    if (!filterListenerAttached) {
      filterListenerAttached = true;
      filterContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement) || !target.dataset.category) return;
        const selected = target.dataset.category;

        [...filterContainer.querySelectorAll(".filter-chip")].forEach((chip) => {
          chip.classList.remove("active");
        });
        target.classList.add("active");

        const filtered =
          selected === "Todos" ? products : products.filter((product) => product.category === selected);
        onFiltered(filtered);
      });
    }
  }

  function renderCards(products) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    products.forEach((product) => {
      const thumb = product.images[0];
      const card = document.createElement("article");
      const nudgedCoverClass = product.id === "gt-p014" ? " product-card--cover-up" : "";
      card.className = `product-card product-card--clickable${nudgedCoverClass}`;
      const stockText = product.limitedStock ? T("stock_low") : T("stock_on_request");
      card.innerHTML = `
        <a class="product-card__cover" href="${productDetailHref(product.id)}">
          <img src="${thumb}" alt="" loading="lazy" width="640" height="360">
        </a>
        <div class="product-card__body">
          <div class="product-top">
            <span class="badge">${product.badge}</span>
            <span class="stock-pill ${product.limitedStock ? "low" : ""}">
              ${stockText}
            </span>
          </div>
          <h3><a href="${productDetailHref(product.id)}">${product.name}</a></h3>
          <p class="product-meta">${product.dosage} · <span class="product-price">${formatBRL(product.price)}</span></p>
          <p class="product-card__excerpt">${product.description}</p>
          <div class="product-card__actions">
            <a class="btn btn-primary" href="${productDetailHref(product.id)}">${T("btn_view_details")}</a>
            <button type="button" class="btn btn-outline" data-add-cart="${product.id}">${T("btn_add_cart")}</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderTable(products) {
    const body = document.getElementById("productsTableBody");
    if (!body) return;
    body.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");
      const summary = product.benefit + " · " + product.application;
      row.innerHTML = `
        <td><a class="table-link" href="${productDetailHref(product.id)}">${product.name}</a></td>
        <td>${product.category}</td>
        <td>${product.dosage}</td>
        <td>${formatBRL(product.price)}</td>
        <td>${summary}</td>
        <td>
          <div class="table-actions-cell">
            <a class="btn btn-outline" href="${productDetailHref(product.id)}">${T("tbl_details")}</a>
            <button type="button" class="btn btn-outline" data-add-cart="${product.id}">${T("tbl_add")}</button>
          </div>
        </td>
      `;
      body.appendChild(row);
    });
  }

  function init() {
    const products = readProducts();
    renderFilters(products, (filtered) => {
      renderCards(filtered);
    });
    renderCards(products);
    renderTable(products);
  }

  init();
  window.addEventListener("gt:locale", init);
})();
