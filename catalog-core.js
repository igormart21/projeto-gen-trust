/**
 * Nucleo compartilhado: leitura do catalogo, formatacao e enriquecimento (imagens / caracteristicas).
 * Textos de fallback abaixo em PT-BR; enriquecimento e aplicado na vitrine (nao persiste no admin).
 */
(function () {
  const STORAGE_KEY = "gt_products_v5";

  const IMG = {
    peptideos: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1532187863486-deab9e343a18?auto=format&fit=crop&w=1200&q=80"
    ],
    hormonios: [
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
    ],
    medicamentos: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80"
    ],
    fallback: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80"
    ]
  };

  const IMAGE_BY_ID = {
    "gt-p014": ["./assets/capa.jpg"]
  };

  function catalogDefaults() {
    return Array.isArray(window.GT_CATALOG_DEFAULTS)
      ? window.GT_CATALOG_DEFAULTS.map((item) => ({ ...item }))
      : [];
  }

  function formatBRL(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function readProductsRaw() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return catalogDefaults();
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) return catalogDefaults();
      const first = parsed[0];
      if (!first || typeof first.price !== "number" || typeof first.dosage !== "string") {
        return catalogDefaults();
      }
      return parsed;
    } catch {
      return catalogDefaults();
    }
  }

  function categoryImageSet(category) {
    if (category === "Hormônios & CIA") return IMG.hormonios;
    if (category === "Medicamentos") return IMG.medicamentos;
    if (category === "Peptídeos") return IMG.peptideos;
    return IMG.fallback;
  }

  function defaultCharacteristics(p) {
    return [
      `Categoria: ${p.category}`,
      `Dosagem / apresentação: ${p.dosage}`,
      `Foco principal: ${p.benefit}`,
      `Contexto de uso: ${p.application}`,
      "Envio nacional com embalagem sigilosa (conforme política de atendimento).",
      "Preço e disponibilidade confirmados no WhatsApp com especialista GT."
    ];
  }

  function enrichProduct(p) {
    const images =
      Array.isArray(p.images) && p.images.length > 0
        ? [...p.images]
        : IMAGE_BY_ID[p.id]
          ? [...IMAGE_BY_ID[p.id]]
          : [...categoryImageSet(p.category)];
    const characteristics =
      Array.isArray(p.characteristics) && p.characteristics.length > 0
        ? [...p.characteristics]
        : defaultCharacteristics(p);
    return { ...p, images, characteristics };
  }

  function readProducts() {
    return readProductsRaw().map(enrichProduct);
  }

  function waLink(product) {
    const line = `${product.name} (${product.dosage}) — ${formatBRL(product.price)}`;
    const text = encodeURIComponent(`Olá! Tenho interesse no seguinte item: ${line}`);
    return `https://wa.me/5545998432312?text=${text}`;
  }

  function productDetailHref(id) {
    return `./produto.html?id=${encodeURIComponent(id)}`;
  }

  function orderedCategories(products) {
    const order = ["Peptídeos", "Hormônios & CIA", "Medicamentos"];
    const present = new Set(products.map((p) => p.category));
    return ["Todos", ...order.filter((c) => present.has(c)), ...[...present].filter((c) => !order.includes(c)).sort()];
  }

  window.GT_CatalogCore = {
    STORAGE_KEY,
    catalogDefaults,
    readProducts,
    readProductsRaw,
    formatBRL,
    waLink,
    productDetailHref,
    orderedCategories,
    enrichProduct
  };
})();
