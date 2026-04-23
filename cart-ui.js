(function () {
  const Cart = window.GT_Cart;
  const Core = window.GT_CatalogCore;
  if (!Cart || !Core) return;

  const { formatBRL } = Core;

  function T(key) {
    return window.GT_i18n ? window.GT_i18n.t(key) : key;
  }

  let rootEl = null;
  let drawerEl = null;
  let backdropEl = null;
  let badgeEl = null;
  let linesEl = null;
  let totalEl = null;
  let toastTimer = null;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function refreshCartChrome() {
    if (!window.GT_i18n) return;
    const title = document.getElementById("cartDrawerTitle");
    if (title) title.textContent = T("cart_title");
    const closeBtn = document.getElementById("cartClose");
    if (closeBtn) closeBtn.setAttribute("aria-label", T("cart_close"));
    const fab = document.getElementById("cartFab");
    if (fab) fab.setAttribute("aria-label", T("cart_open"));
    const totalLbl = document.getElementById("cartTotalLabel");
    if (totalLbl) totalLbl.textContent = T("cart_total_lbl");
    const checkout = document.getElementById("cartCheckout");
    if (checkout) checkout.textContent = T("cart_checkout");
    const clearBtn = document.getElementById("cartClear");
    if (clearBtn) clearBtn.textContent = T("cart_clear");
  }

  function showToast() {
    let toast = document.querySelector(".cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "cart-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = T("cart_toast");
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function updateBadge(count) {
    if (!badgeEl) return;
    badgeEl.textContent = String(count);
    badgeEl.hidden = count <= 0;
  }

  function renderLines() {
    if (!linesEl || !totalEl) return;
    const { lines, invalid, total } = Cart.getLinesDetailed();

    const checkoutBtn = document.getElementById("cartCheckout");

    if (lines.length === 0) {
      linesEl.innerHTML = `<p class="cart-empty">${escapeHtml(T("cart_empty"))}</p>`;
      totalEl.textContent = formatBRL(0);
      if (checkoutBtn) {
        checkoutBtn.classList.add("is-disabled");
        checkoutBtn.setAttribute("href", "#");
      }
      return;
    }

    if (checkoutBtn) {
      checkoutBtn.classList.remove("is-disabled");
      checkoutBtn.href = Cart.checkoutWhatsAppUrl();
    }

    const invalidNote =
      invalid.length > 0 ? `<p class="cart-invalid">${escapeHtml(T("cart_invalid"))}</p>` : "";

    const perUnit = escapeHtml(T("cart_per_unit"));
    const alDec = escapeHtml(T("cart_dec"));
    const alInc = escapeHtml(T("cart_inc"));
    const alRem = escapeHtml(T("cart_remove"));
    const remLabel = escapeHtml(T("cart_remove_short"));

    linesEl.innerHTML =
      invalidNote +
      lines
        .map(({ product, qty, lineTotal }) => {
          const id = escapeHtml(product.id);
          const name = escapeHtml(product.name);
          const dose = escapeHtml(product.dosage);
          return `
        <article class="cart-line" data-product-id="${id}">
          <div class="cart-line__info">
            <p class="cart-line__name">${name}</p>
            <p class="cart-line__meta">${dose} · ${formatBRL(product.price)} ${perUnit}</p>
          </div>
          <div class="cart-line__controls">
            <button type="button" class="cart-qty-btn" data-cart-dec="${id}" aria-label="${alDec}">−</button>
            <span class="cart-qty-val" aria-live="polite">${qty}</span>
            <button type="button" class="cart-qty-btn" data-cart-inc="${id}" aria-label="${alInc}">+</button>
          </div>
          <p class="cart-line__sub">${formatBRL(lineTotal)}</p>
          <button type="button" class="cart-remove" data-cart-remove="${id}" aria-label="${alRem}">${remLabel}</button>
        </article>`;
        })
        .join("");

    totalEl.textContent = formatBRL(total);
  }

  function syncFabAria() {
    const fab = document.getElementById("cartFab");
    if (!fab || !drawerEl) return;
    fab.setAttribute("aria-expanded", drawerEl.classList.contains("is-open") ? "true" : "false");
  }

  function openDrawer() {
    if (!drawerEl || !backdropEl) return;
    drawerEl.classList.add("is-open");
    backdropEl.classList.add("is-open");
    drawerEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-drawer-open");
    renderLines();
    syncFabAria();
  }

  function closeDrawer() {
    if (!drawerEl || !backdropEl) return;
    drawerEl.classList.remove("is-open");
    backdropEl.classList.remove("is-open");
    drawerEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-drawer-open");
    syncFabAria();
  }

  function toggleDrawer() {
    if (drawerEl?.classList.contains("is-open")) closeDrawer();
    else openDrawer();
  }

  function inject() {
    if (document.querySelector(".cart-root")) return;

    rootEl = document.createElement("div");
    rootEl.className = "cart-root";
    rootEl.innerHTML = `
      <button type="button" class="cart-fab" id="cartFab" aria-label="${escapeHtml(T("cart_open"))}" aria-expanded="false" aria-controls="cartDrawer">
        <i class="bi bi-cart3" aria-hidden="true"></i>
        <span class="cart-fab__badge" id="cartBadge" hidden>0</span>
      </button>
      <div class="cart-backdrop" id="cartBackdrop" aria-hidden="true"></div>
      <aside class="cart-drawer" id="cartDrawer" aria-hidden="true" aria-labelledby="cartDrawerTitle">
        <div class="cart-drawer__head">
          <h2 id="cartDrawerTitle" class="cart-drawer__title">${escapeHtml(T("cart_title"))}</h2>
          <button type="button" class="cart-drawer__close" id="cartClose" aria-label="${escapeHtml(T("cart_close"))}">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <div class="cart-drawer__body">
          <div id="cartLines"></div>
        </div>
        <div class="cart-drawer__footer">
          <div class="cart-total-row">
            <span id="cartTotalLabel">${escapeHtml(T("cart_total_lbl"))}</span>
            <strong id="cartTotal">${formatBRL(0)}</strong>
          </div>
          <a class="btn btn-primary cart-checkout is-disabled" id="cartCheckout" href="#" target="_blank" rel="noreferrer">
            ${escapeHtml(T("cart_checkout"))}
          </a>
          <button type="button" class="btn btn-ghost cart-clear" id="cartClear">${escapeHtml(T("cart_clear"))}</button>
        </div>
      </aside>
    `;

    document.body.appendChild(rootEl);
    drawerEl = rootEl.querySelector("#cartDrawer");
    backdropEl = rootEl.querySelector("#cartBackdrop");
    badgeEl = rootEl.querySelector("#cartBadge");
    linesEl = rootEl.querySelector("#cartLines");
    totalEl = rootEl.querySelector("#cartTotal");
    const fab = rootEl.querySelector("#cartFab");
    const closeBtn = rootEl.querySelector("#cartClose");
    const checkout = rootEl.querySelector("#cartCheckout");
    const clearBtn = rootEl.querySelector("#cartClear");

    fab.addEventListener("click", () => {
      toggleDrawer();
    });
    closeBtn.addEventListener("click", closeDrawer);
    backdropEl.addEventListener("click", closeDrawer);

    checkout.addEventListener("click", (e) => {
      const { lines } = Cart.getLinesDetailed();
      if (lines.length === 0) {
        e.preventDefault();
        return;
      }
      checkout.href = Cart.checkoutWhatsAppUrl();
    });

    clearBtn.addEventListener("click", () => {
      if (window.confirm(T("cart_confirm_clear"))) {
        Cart.clearCart();
        renderLines();
      }
    });

    linesEl.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const inc = t.closest("[data-cart-inc]");
      const dec = t.closest("[data-cart-dec]");
      const rem = t.closest("[data-cart-remove]");
      if (inc) {
        const id = inc.getAttribute("data-cart-inc");
        const row = Cart.readCart().find((r) => r.productId === id);
        if (id) Cart.setQty(id, (row ? row.qty : 0) + 1);
      } else if (dec) {
        const id = dec.getAttribute("data-cart-dec");
        const row = Cart.readCart().find((r) => r.productId === id);
        if (id && row) Cart.setQty(id, row.qty - 1);
      } else if (rem) {
        const id = rem.getAttribute("data-cart-remove");
        if (id) Cart.removeItem(id);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  function onCartChanged(e) {
    const count = e && e.detail && typeof e.detail.count === "number" ? e.detail.count : Cart.countItems();
    updateBadge(count);
    if (drawerEl?.classList.contains("is-open")) renderLines();
    const checkout = document.getElementById("cartCheckout");
    if (checkout) {
      const { lines } = Cart.getLinesDetailed();
      if (lines.length === 0) {
        checkout.classList.add("is-disabled");
        checkout.setAttribute("href", "#");
      } else {
        checkout.classList.remove("is-disabled");
        checkout.href = Cart.checkoutWhatsAppUrl();
      }
    }
  }

  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("[data-add-cart]") : null;
    if (!btn) return;
    const id = btn.getAttribute("data-add-cart");
    if (!id) return;
    e.preventDefault();
    Cart.addItem(id, 1);
    showToast();
  });

  function onLocale() {
    refreshCartChrome();
    renderLines();
  }

  function init() {
    inject();
    refreshCartChrome();
    updateBadge(Cart.countItems());
    onCartChanged({ detail: { count: Cart.countItems() } });
    window.addEventListener("gt-cart-changed", onCartChanged);
    window.addEventListener("gt:locale", onLocale);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
