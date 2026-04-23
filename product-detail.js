(function () {
  const C = window.GT_CatalogCore;
  if (!C) return;

  const { readProducts, formatBRL, productDetailHref, enrichProduct } = C;

  function T(key) {
    return window.GT_i18n ? window.GT_i18n.t(key) : key;
  }

  function getIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function renderNotFound() {
    const crumbs = document.getElementById("breadcrumbs");
    if (crumbs) {
      crumbs.innerHTML = `
        <a href="./index.html">${T("bc_home")}</a>
        <span class="bc-sep" aria-hidden="true">/</span>
        <a href="./catalogo.html">${T("bc_catalog")}</a>
        <span class="bc-sep" aria-hidden="true">/</span>
        <span>${T("nf_error")}</span>
      `;
    }
    const root = document.getElementById("productRoot");
    if (!root) return;
    root.innerHTML = `
      <div class="container product-missing">
        <p class="eyebrow">${T("nf_eyebrow")}</p>
        <h1>${T("nf_title")}</h1>
        <p>${T("nf_desc")}</p>
        <a class="btn btn-primary" href="./catalogo.html">${T("nf_btn")}</a>
      </div>
    `;
    document.title = T("nf_title_doc");
  }

  function setMainImage(src, alt) {
    const main = document.getElementById("productMainImg");
    if (main) {
      main.src = src;
      main.alt = alt;
    }
  }

  function render(product) {
    const p = enrichProduct(product);
    const root = document.getElementById("productRoot");
    if (!root) return;

    document.title = `${p.name} ${T("product_suffix")}`;

    const crumbs = document.getElementById("breadcrumbs");
    if (crumbs) {
      crumbs.innerHTML = `
        <a href="./index.html">${T("bc_home")}</a>
        <span class="bc-sep" aria-hidden="true">/</span>
        <a href="./catalogo.html">${T("bc_catalog")}</a>
        <span class="bc-sep" aria-hidden="true">/</span>
        <span>${p.name}</span>
      `;
    }

    root.innerHTML = `
      <div class="container product-detail">
        <header class="product-detail__head">
          <p class="eyebrow">${p.category}</p>
          <h1>${p.name}</h1>
          <p class="product-detail__meta">${p.dosage} · <span class="product-price">${formatBRL(p.price)}</span></p>
          <p class="product-detail__lead">${p.description}</p>
          <div class="product-detail__cta">
            <button type="button" class="btn btn-primary" data-add-cart="${p.id}">${T("pd_add_cart")}</button>
            <a class="btn btn-outline" href="./catalogo.html">${T("pd_continue")}</a>
          </div>
        </header>

        <div class="product-detail__grid">
          <div class="product-gallery glass-card">
            <div class="product-gallery__main">
              <img id="productMainImg" src="${p.images[0]}" alt="${p.name}" width="1200" height="675" loading="eager">
            </div>
            <div class="product-gallery__thumbs" id="productThumbs" role="tablist" aria-label="${T("pd_gallery_aria")}"></div>
          </div>

          <aside class="product-aside">
            <div class="glass-card product-specs">
              <h2>${T("pd_specs")}</h2>
              <dl class="spec-list">
                <div><dt>${T("dt_category")}</dt><dd>${p.category}</dd></div>
                <div><dt>${T("dt_dose")}</dt><dd>${p.dosage}</dd></div>
                <div><dt>${T("dt_price")}</dt><dd>${formatBRL(p.price)}</dd></div>
                <div><dt>${T("dt_badge")}</dt><dd>${p.badge}</dd></div>
                <div><dt>${T("dt_focus")}</dt><dd>${p.benefit}</dd></div>
                <div><dt>${T("dt_context")}</dt><dd>${p.application}</dd></div>
              </dl>
            </div>
            <div class="glass-card product-chars">
              <h2>${T("pd_chars")}</h2>
              <ul class="char-list" id="charList"></ul>
            </div>
          </aside>
        </div>
      </div>
    `;

    const thumbs = document.getElementById("productThumbs");
    if (thumbs) {
      p.images.forEach((src, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "product-gallery__thumb" + (i === 0 ? " is-active" : "");
        b.innerHTML = `<img src="${src}" alt="" loading="lazy" width="200" height="112">`;
        b.addEventListener("click", () => {
          setMainImage(src, p.name);
          [...thumbs.querySelectorAll(".product-gallery__thumb")].forEach((t) => t.classList.remove("is-active"));
          b.classList.add("is-active");
        });
        thumbs.appendChild(b);
      });
    }

    const list = document.getElementById("charList");
    if (list) {
      p.characteristics.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        list.appendChild(li);
      });
    }
  }

  const id = getIdFromQuery();

  function boot() {
    if (!id) {
      renderNotFound();
      return;
    }
    const products = readProducts();
    const found = products.find((x) => x.id === id);
    if (!found) {
      renderNotFound();
      return;
    }
    render(found);
  }

  boot();
  window.addEventListener("gt:locale", boot);
})();
