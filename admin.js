const C = window.GT_CatalogCore;
const STORAGE_KEY = C ? C.STORAGE_KEY : "gt_products_v5";

function catalogDefaults() {
  return C ? C.catalogDefaults() : [];
}

const form = document.getElementById("productForm");
const tableBody = document.getElementById("adminProductsTable");
const cancelEditButton = document.getElementById("cancelEditButton");
const resetDefaultsButton = document.getElementById("resetDefaultsButton");

const fields = {
  productId: document.getElementById("productId"),
  name: document.getElementById("name"),
  description: document.getElementById("description"),
  badge: document.getElementById("badge"),
  category: document.getElementById("category"),
  dosage: document.getElementById("dosage"),
  price: document.getElementById("price"),
  benefit: document.getElementById("benefit"),
  application: document.getElementById("application"),
  limitedStock: document.getElementById("limitedStock")
};

function readProducts() {
  if (C && typeof C.readProductsRaw === "function") {
    return C.readProductsRaw();
  }
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

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function resetForm() {
  form.reset();
  fields.productId.value = "";
}

function formatPriceCell(value) {
  if (C && typeof C.formatBRL === "function") return C.formatBRL(value);
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderTable() {
  const products = readProducts();
  tableBody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.dosage}</td>
      <td>${formatPriceCell(product.price)}</td>
      <td>${product.badge}</td>
      <td>
        <div class="admin-table-actions">
          <a class="btn btn-outline" href="./produto.html?id=${encodeURIComponent(product.id)}">Ver</a>
          <button class="btn btn-outline" type="button" data-edit="${product.id}">Editar</button>
          <button class="btn btn-outline btn-danger" type="button" data-delete="${product.id}">Excluir</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function getFormData() {
  const priceRaw = Number.parseInt(String(fields.price.value), 10);
  return {
    id: fields.productId.value || `gt-${Date.now()}`,
    name: fields.name.value.trim(),
    description: fields.description.value.trim(),
    badge: fields.badge.value.trim(),
    category: fields.category.value.trim(),
    dosage: fields.dosage.value.trim(),
    price: Number.isFinite(priceRaw) && priceRaw >= 0 ? priceRaw : 0,
    benefit: fields.benefit.value.trim(),
    application: fields.application.value.trim(),
    limitedStock: fields.limitedStock.checked
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = getFormData();
  const products = readProducts();
  const index = products.findIndex((item) => item.id === data.id);

  if (index >= 0) {
    products[index] = data;
  } else {
    products.unshift(data);
  }

  saveProducts(products);
  renderTable();
  resetForm();
});

cancelEditButton.addEventListener("click", resetForm);

tableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const editId = target.dataset.edit;
  const deleteId = target.dataset.delete;

  const products = readProducts();

  if (editId) {
    const selected = products.find((item) => item.id === editId);
    if (!selected) return;

    fields.productId.value = selected.id;
    fields.name.value = selected.name;
    fields.description.value = selected.description;
    fields.badge.value = selected.badge;
    fields.category.value = selected.category;
    fields.dosage.value = selected.dosage;
    fields.price.value = String(selected.price);
    fields.benefit.value = selected.benefit;
    fields.application.value = selected.application;
    fields.limitedStock.checked = !!selected.limitedStock;
    fields.name.focus();
    return;
  }

  if (deleteId) {
    const next = products.filter((item) => item.id !== deleteId);
    saveProducts(next);
    renderTable();
    resetForm();
  }
});

resetDefaultsButton.addEventListener("click", () => {
  saveProducts(catalogDefaults());
  renderTable();
  resetForm();
});

renderTable();
