/**
 * Carrinho (localStorage) + montagem da mensagem de pedido para WhatsApp.
 * Depende de window.GT_CatalogCore (readProducts, formatBRL).
 */
(function () {
  const CART_KEY = "gt_cart_v1";
  const WA_PHONE = "5545998432312";

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.filter(
        (x) => x && typeof x.productId === "string" && typeof x.qty === "number" && x.qty > 0
      );
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    const count = items.reduce((s, x) => s + x.qty, 0);
    window.dispatchEvent(new CustomEvent("gt-cart-changed", { detail: { count } }));
  }

  function addItem(productId, qty) {
    const q = Math.min(99, Math.max(1, Math.floor(Number(qty)) || 1));
    const items = readCart();
    const idx = items.findIndex((i) => i.productId === productId);
    if (idx >= 0) {
      items[idx].qty = Math.min(99, items[idx].qty + q);
    } else {
      items.push({ productId, qty: q });
    }
    writeCart(items);
  }

  function setQty(productId, qty) {
    const q = Math.floor(Number(qty));
    let items = readCart();
    if (q <= 0) {
      items = items.filter((i) => i.productId !== productId);
    } else {
      const idx = items.findIndex((i) => i.productId === productId);
      if (idx >= 0) items[idx].qty = Math.min(99, q);
    }
    writeCart(items);
  }

  function removeItem(productId) {
    writeCart(readCart().filter((i) => i.productId !== productId));
  }

  function clearCart() {
    writeCart([]);
  }

  function countItems() {
    return readCart().reduce((s, x) => s + x.qty, 0);
  }

  function getLinesDetailed() {
    const C = window.GT_CatalogCore;
    const cart = readCart();
    if (!C) {
      return { lines: [], invalid: cart, total: 0, count: 0, formatBRL: null };
    }
    const { readProducts, formatBRL } = C;
    const products = readProducts();
    const map = new Map(products.map((p) => [p.id, p]));
    const lines = [];
    const invalid = [];
    let total = 0;
    let count = 0;

    for (const row of cart) {
      const p = map.get(row.productId);
      if (!p) {
        invalid.push(row);
        continue;
      }
      const lineTotal = Number(p.price) * row.qty;
      if (!Number.isFinite(lineTotal)) continue;
      total += lineTotal;
      count += row.qty;
      lines.push({ product: p, qty: row.qty, lineTotal });
    }

    return { lines, invalid, total, count, formatBRL: C.formatBRL };
  }

  function buildCheckoutMessage() {
    const { lines, invalid, total, formatBRL } = getLinesDetailed();
    const C = window.GT_CatalogCore;
    const fmt = formatBRL || (C && C.formatBRL) || ((n) => String(n));

    const header = "Olá! Gostaria de finalizar este pedido (site GT GenTrust):\n\n";
    if (lines.length === 0 && invalid.length === 0) {
      return header + "(Carrinho vazio)";
    }

    const body = lines
      .map(
        ({ product, qty, lineTotal }) =>
          `• ${qty}x ${product.name} (${product.dosage}) — ${fmt(lineTotal)}`
      )
      .join("\n");

    const invalidBlock =
      invalid.length > 0
        ? `\n\n(Itens no carrinho não encontrados no catálogo: ${invalid
            .map((i) => i.productId)
            .join(", ")})`
        : "";

    const footer = `\n\nTotal estimado: ${fmt(total)}\n\nAguardo confirmação de disponibilidade e próximos passos. Obrigado(a)!`;

    return header + body + invalidBlock + footer;
  }

  function checkoutWhatsAppUrl() {
    const text = encodeURIComponent(buildCheckoutMessage());
    return `https://wa.me/${WA_PHONE}?text=${text}`;
  }

  window.GT_Cart = {
    CART_KEY,
    readCart,
    addItem,
    setQty,
    removeItem,
    clearCart,
    countItems,
    getLinesDetailed,
    buildCheckoutMessage,
    checkoutWhatsAppUrl
  };

  window.dispatchEvent(
    new CustomEvent("gt-cart-changed", { detail: { count: countItems() } })
  );
})();
