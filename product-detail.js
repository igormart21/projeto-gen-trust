(function () {
  const C = window.GT_CatalogCore;
  if (!C) return;

  const { readProducts, formatBRL, productDetailHref, enrichProduct } = C;

  function getIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function renderNotFound() {
    const crumbs = document.getElementById("breadcrumbs");
    if (crumbs) {
      crumbs.innerHTML = `
        <a href="./index.html">Início</a>
        <span class="bc-sep" aria-hidden="true">/</span>
        <a href="./catalogo.html">Catálogo</a>
        <span class="bc-sep" aria-hidden="true">/</span>
        <span>Erro</span>
      `;
    }
    const root = document.getElementById("productRoot");
    if (!root) return;
    root.innerHTML = `
      <div class="container product-missing">
        <p class="eyebrow">Produto</p>
        <h1>Item não encontrado</h1>
        <p>O link pode estar incorreto ou o produto foi removido do catálogo.</p>
        <a class="btn btn-primary" href="./catalogo.html">Voltar ao catálogo</a>
      </div>
    `;
    document.title = "Produto não encontrado | GT GenTrust";
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

    document.title = `${p.name} — GT GenTrust`;

    const crumbs = document.getElementById("breadcrumbs");
    if (crumbs) {
      crumbs.innerHTML = `
        <a href="./index.html">Início</a>
        <span class="bc-sep" aria-hidden="true">/</span>
        <a href="./catalogo.html">Catálogo</a>
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
            <button type="button" class="btn btn-primary" data-add-cart="${p.id}">Adicionar ao carrinho</button>
            <a class="btn btn-outline" href="./catalogo.html">Continuar comprando</a>
          </div>
        </header>

        <div class="product-detail__grid">
          <div class="product-gallery glass-card">
            <div class="product-gallery__main">
              <img id="productMainImg" src="${p.images[0]}" alt="${p.name}" width="1200" height="675" loading="eager">
            </div>
            <div class="product-gallery__thumbs" id="productThumbs" role="tablist" aria-label="Imagens do produto"></div>
          </div>

          <aside class="product-aside">
            <div class="glass-card product-specs">
              <h2>Ficha técnica</h2>
              <dl class="spec-list">
                <div><dt>Categoria</dt><dd>${p.category}</dd></div>
                <div><dt>Dosagem</dt><dd>${p.dosage}</dd></div>
                <div><dt>Preço</dt><dd>${formatBRL(p.price)}</dd></div>
                <div><dt>Badge</dt><dd>${p.badge}</dd></div>
                <div><dt>Foco</dt><dd>${p.benefit}</dd></div>
                <div><dt>Contexto</dt><dd>${p.application}</dd></div>
              </dl>
            </div>
            <div class="glass-card product-chars">
              <h2>Características</h2>
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
})();
