const C = window.GT_CatalogCore;
const STORAGE_KEY = C ? C.STORAGE_KEY : "gt_products_v5";

const AUTH_SESSION_KEY = "gt_admin_auth_v3";
const USERNAME_KEY = "gt_admin_username_v3";
const PASSWORD_HASH_KEY = "gt_admin_password_hash_v3";
const DEFAULT_USERNAME = "admin.demo";
const DEFAULT_ADMIN_PASSWORD = "Demo@2026Admin!";
const LEGACY_ADMIN_KEYS = [
  "gt_admin_auth_v1",
  "gt_admin_username_v1",
  "gt_admin_password_hash_v1",
  "gt_admin_auth_v2",
  "gt_admin_username_v2",
  "gt_admin_password_hash_v2"
];

const loginGate = document.getElementById("adminLoginGate");
const loginForm = document.getElementById("adminLoginForm");
const loginUsernameInput = document.getElementById("adminUsername");
const loginPasswordInput = document.getElementById("adminPassword");
const loginHint = document.getElementById("adminLoginHint");

const adminApp = document.getElementById("adminApp");
const tabButtons = Array.from(document.querySelectorAll(".admin-tab"));
const panes = {
  overview: document.getElementById("pane-overview"),
  products: document.getElementById("pane-products"),
  add: document.getElementById("pane-add"),
  edit: document.getElementById("pane-edit"),
  security: document.getElementById("pane-security")
};

const resetDefaultsButton = document.getElementById("resetDefaultsButton");
const logoutButton = document.getElementById("logoutButton");
const productsSearch = document.getElementById("productsSearch");
const tableBody = document.getElementById("adminProductsTable");

const editProductSelect = document.getElementById("editProductSelect");
const refreshEditSelectButton = document.getElementById("refreshEditSelectButton");
const previewProductLink = document.getElementById("previewProductLink");
const deleteCurrentProductButton = document.getElementById("deleteCurrentProductButton");

const addForm = document.getElementById("addProductForm");
const editForm = document.getElementById("editProductForm");

const securityForm = document.getElementById("securityForm");
const newAdminUsername = document.getElementById("newAdminUsername");
const newAdminPassword = document.getElementById("newAdminPassword");
const confirmAdminPassword = document.getElementById("confirmAdminPassword");
const securityFeedback = document.getElementById("securityFeedback");

const metricTotalProducts = document.getElementById("metricTotalProducts");
const metricLimited = document.getElementById("metricLimited");
const metricPriceRange = document.getElementById("metricPriceRange");
const metricTopCategory = document.getElementById("metricTopCategory");
const categorySummary = document.getElementById("categorySummary");

const CATEGORY_OPTIONS = ["Peptídeos", "Hormônios & CIA", "Medicamentos"];
const BADGE_OPTIONS = ["Peptídeo", "Blend", "Hormonal", "Medicamento"];

let currentProducts = [];
let currentSearch = "";

function catalogDefaults() {
  return C ? C.catalogDefaults() : [];
}

function formatPriceCell(value) {
  if (C && typeof C.formatBRL === "function") return C.formatBRL(value);
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeAdminUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function purgeLegacyAdminCredentials() {
  LEGACY_ADMIN_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

async function getExpectedUsername() {
  const stored = localStorage.getItem(USERNAME_KEY);
  if (stored) return normalizeAdminUsername(stored);
  const initial = normalizeAdminUsername(DEFAULT_USERNAME);
  localStorage.setItem(USERNAME_KEY, initial);
  return initial;
}

async function getExpectedPasswordHash() {
  const stored = localStorage.getItem(PASSWORD_HASH_KEY);
  if (stored) return stored;
  const initial = await sha256Hex(DEFAULT_ADMIN_PASSWORD);
  localStorage.setItem(PASSWORD_HASH_KEY, initial);
  return initial;
}

function setHint(el, text, kind) {
  if (!el) return;
  el.textContent = text || "";
  el.classList.remove("is-error", "is-ok");
  if (kind === "error") el.classList.add("is-error");
  if (kind === "ok") el.classList.add("is-ok");
}

function readProducts() {
  if (C && typeof C.readProductsRaw === "function") return C.readProductsRaw();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return catalogDefaults();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : catalogDefaults();
  } catch {
    return catalogDefaults();
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function parseMultilineList(value) {
  return String(value || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function listToMultiline(arr) {
  return Array.isArray(arr) ? arr.join("\n") : "";
}

function normalizeProductPayload(payload, fallbackId) {
  const priceInt = Number.parseInt(String(payload.price || "0"), 10);
  return {
    id: payload.id || fallbackId || `gt-${Date.now()}`,
    name: String(payload.name || "").trim(),
    description: String(payload.description || "").trim(),
    badge: String(payload.badge || "").trim(),
    category: String(payload.category || "").trim(),
    dosage: String(payload.dosage || "").trim(),
    price: Number.isFinite(priceInt) && priceInt >= 0 ? priceInt : 0,
    benefit: String(payload.benefit || "").trim(),
    application: String(payload.application || "").trim(),
    images: parseMultilineList(payload.images),
    characteristics: parseMultilineList(payload.characteristics),
    limitedStock: Boolean(payload.limitedStock)
  };
}

function activateTab(tabKey) {
  tabButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tabTarget === tabKey);
  });
  Object.entries(panes).forEach(([key, pane]) => {
    if (!pane) return;
    pane.classList.toggle("is-active", key === tabKey);
  });
  if (tabKey === "security" && newAdminUsername) {
    void (async () => {
      await getExpectedUsername();
      newAdminUsername.value = localStorage.getItem(USERNAME_KEY) || normalizeAdminUsername(DEFAULT_USERNAME);
    })();
  }
}

function imageFileToStoredDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl.startsWith("data:image")) {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          const maxW = 1400;
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          if (String(file.type || "").toLowerCase() === "image/png") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

function bindImageUpload(prefix) {
  const ta = document.getElementById(`${prefix}Images`);
  const input = document.getElementById(`${prefix}ImagesFile`);
  const status = document.getElementById(`${prefix}ImagesStatus`);
  if (!ta || !input) return;

  function setStatus(msg, isError) {
    if (!status) return;
    status.textContent = msg || "";
    status.classList.toggle("is-error", Boolean(isError));
  }

  input.addEventListener("change", async () => {
    const files = Array.from(input.files || []);
    input.value = "";
    if (files.length === 0) return;

    const maxBytes = 8 * 1024 * 1024;
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].size > maxBytes) {
        setStatus(`O arquivo "${files[i].name}" passa de 8 MB. Reduza ou comprima antes de enviar.`, true);
        return;
      }
    }

    setStatus(`Processando ${files.length} imagem(ns)…`, false);
    try {
      const urls = [];
      for (let i = 0; i < files.length; i += 1) {
        urls.push(await imageFileToStoredDataUrl(files[i]));
      }
      const existing = ta.value.trim();
      const lines = existing ? existing.split("\n").map((x) => x.trim()).filter(Boolean) : [];
      urls.forEach((u) => lines.push(u));
      ta.value = lines.join("\n");
      setStatus(`${urls.length} imagem(ns) adicionada(s) ao campo acima.`, false);
    } catch {
      setStatus("Não foi possível ler uma das imagens. Tente outro formato.", true);
    }
  });
}

function createProductFormMarkup(prefix) {
  return `
    <input type="hidden" id="${prefix}Id">
    <label>
      Nome do produto
      <input id="${prefix}Name" type="text" required>
    </label>
    <label>
      Descrição curta
      <textarea id="${prefix}Description" rows="3" required></textarea>
    </label>
    <div class="admin-row">
      <label>
        Badge
        <input id="${prefix}Badge" type="text" list="${prefix}BadgeOptions" required>
        <datalist id="${prefix}BadgeOptions">
          ${BADGE_OPTIONS.map((x) => `<option value="${x}"></option>`).join("")}
        </datalist>
      </label>
      <label>
        Categoria
        <input id="${prefix}Category" type="text" list="${prefix}CategoryOptions" required>
        <datalist id="${prefix}CategoryOptions">
          ${CATEGORY_OPTIONS.map((x) => `<option value="${x}"></option>`).join("")}
        </datalist>
      </label>
    </div>
    <div class="admin-row">
      <label>
        Dosagem / apresentação
        <input id="${prefix}Dosage" type="text" required placeholder="ex: 10mg, 5000 UI, 10ml">
      </label>
      <label>
        Preço (R$)
        <input id="${prefix}Price" type="number" min="0" step="1" required>
      </label>
    </div>
    <label>
      Benefício
      <input id="${prefix}Benefit" type="text" required>
    </label>
    <label>
      Aplicação
      <input id="${prefix}Application" type="text" required>
    </label>
    <div class="admin-field-block">
      <label for="${prefix}Images">Imagens (URL ou caminho por linha, ou envie arquivos)</label>
      <textarea id="${prefix}Images" rows="4" placeholder="./assets/capa.jpg&#10;https://..."></textarea>
      <div class="admin-image-upload">
        <label class="btn btn-outline admin-upload-btn" for="${prefix}ImagesFile">Escolher imagens…</label>
        <input
          type="file"
          id="${prefix}ImagesFile"
          class="admin-upload-input"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
        >
        <p class="admin-image-upload__hint">
          Os arquivos são convertidos e gravados neste navegador (localStorage). Imagens grandes são reduzidas automaticamente; evite dezenas de fotos pesadas para não estourar o limite de armazenamento.
        </p>
        <p class="admin-image-upload__status" id="${prefix}ImagesStatus" role="status" aria-live="polite"></p>
      </div>
    </div>
    <label>
      Características (uma por linha)
      <textarea id="${prefix}Characteristics" rows="4" placeholder="Categoria: Peptídeos&#10;Envio sigiloso..."></textarea>
    </label>
    <label class="checkbox">
      <input id="${prefix}LimitedStock" type="checkbox">
      Estoque limitado
    </label>
    <div class="admin-form-actions">
      <button class="btn btn-primary" type="submit">${prefix === "add" ? "Cadastrar produto" : "Salvar alterações"}</button>
      ${
        prefix === "add"
          ? `<button class="btn btn-outline" type="button" id="clearAddFormButton">Limpar formulário</button>`
          : `<button class="btn btn-outline" type="button" id="reloadEditFormButton">Recarregar dados</button>`
      }
    </div>
  `;
}

function getFormRefs(prefix) {
  return {
    id: document.getElementById(`${prefix}Id`),
    name: document.getElementById(`${prefix}Name`),
    description: document.getElementById(`${prefix}Description`),
    badge: document.getElementById(`${prefix}Badge`),
    category: document.getElementById(`${prefix}Category`),
    dosage: document.getElementById(`${prefix}Dosage`),
    price: document.getElementById(`${prefix}Price`),
    benefit: document.getElementById(`${prefix}Benefit`),
    application: document.getElementById(`${prefix}Application`),
    images: document.getElementById(`${prefix}Images`),
    characteristics: document.getElementById(`${prefix}Characteristics`),
    limitedStock: document.getElementById(`${prefix}LimitedStock`)
  };
}

function fillForm(refs, product) {
  refs.id.value = product?.id || "";
  refs.name.value = product?.name || "";
  refs.description.value = product?.description || "";
  refs.badge.value = product?.badge || "";
  refs.category.value = product?.category || "";
  refs.dosage.value = product?.dosage || "";
  refs.price.value = product?.price != null ? String(product.price) : "";
  refs.benefit.value = product?.benefit || "";
  refs.application.value = product?.application || "";
  refs.images.value = listToMultiline(product?.images);
  refs.characteristics.value = listToMultiline(product?.characteristics);
  refs.limitedStock.checked = Boolean(product?.limitedStock);
}

function formToPayload(refs, fallbackId) {
  return normalizeProductPayload(
    {
      id: refs.id.value,
      name: refs.name.value,
      description: refs.description.value,
      badge: refs.badge.value,
      category: refs.category.value,
      dosage: refs.dosage.value,
      price: refs.price.value,
      benefit: refs.benefit.value,
      application: refs.application.value,
      images: refs.images.value,
      characteristics: refs.characteristics.value,
      limitedStock: refs.limitedStock.checked
    },
    fallbackId
  );
}

function renderOverview() {
  const list = currentProducts;
  const total = list.length;
  const limited = list.filter((p) => p.limitedStock).length;
  const prices = list.map((p) => Number(p.price)).filter((x) => Number.isFinite(x));
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  const byCategory = new Map();
  list.forEach((p) => {
    byCategory.set(p.category, (byCategory.get(p.category) || 0) + 1);
  });
  const topCategory = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];

  metricTotalProducts.textContent = String(total);
  metricLimited.textContent = `${limited} com estoque limitado`;
  metricPriceRange.textContent = prices.length ? `${formatPriceCell(min)} - ${formatPriceCell(max)}` : "—";
  metricTopCategory.textContent = topCategory ? topCategory[0] : "—";

  categorySummary.innerHTML = "";
  if (byCategory.size === 0) {
    categorySummary.innerHTML = `<p class="admin-card-desc">Sem produtos cadastrados.</p>`;
    return;
  }
  [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => {
      const item = document.createElement("div");
      item.className = "category-summary__item";
      item.innerHTML = `<p class="name">${name}</p><p class="count">${count}</p>`;
      categorySummary.appendChild(item);
    });
}

function renderProductsTable() {
  const term = currentSearch.trim().toLowerCase();
  tableBody.innerHTML = "";

  const filtered = currentProducts.filter((p) => {
    if (!term) return true;
    return [p.name, p.category, p.dosage, p.badge, p.description].join(" ").toLowerCase().includes(term);
  });

  filtered.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.dosage}</td>
      <td>${formatPriceCell(product.price)}</td>
      <td>${product.badge}</td>
      <td>
        <div class="admin-table-actions">
          <a class="btn btn-outline" href="./produto.html?id=${encodeURIComponent(product.id)}" target="_blank" rel="noreferrer">Ver</a>
          <button class="btn btn-outline" type="button" data-edit-open="${product.id}">Editar</button>
          <button class="btn btn-outline btn-danger" type="button" data-delete="${product.id}">Excluir</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function renderEditSelect() {
  const selected = editProductSelect.value;
  editProductSelect.innerHTML = "";
  currentProducts.forEach((p) => {
    const op = document.createElement("option");
    op.value = p.id;
    op.textContent = `${p.name} - ${p.dosage}`;
    editProductSelect.appendChild(op);
  });

  if (!currentProducts.length) {
    const op = document.createElement("option");
    op.value = "";
    op.textContent = "Sem produtos";
    editProductSelect.appendChild(op);
    fillForm(editRefs, null);
    return;
  }

  if (selected && currentProducts.some((p) => p.id === selected)) {
    editProductSelect.value = selected;
  }

  loadEditForm(editProductSelect.value || currentProducts[0].id);
}

function loadEditForm(productId) {
  const product = currentProducts.find((p) => p.id === productId);
  if (!product) {
    fillForm(editRefs, null);
    previewProductLink.href = "./catalogo.html";
    return;
  }
  fillForm(editRefs, product);
  previewProductLink.href = `./produto.html?id=${encodeURIComponent(product.id)}`;
}

function refreshAll() {
  currentProducts = readProducts();
  renderOverview();
  renderProductsTable();
  renderEditSelect();
}

function saveAll(nextProducts) {
  currentProducts = nextProducts;
  saveProducts(nextProducts);
  refreshAll();
}

addForm.innerHTML = createProductFormMarkup("add");
editForm.innerHTML = createProductFormMarkup("edit");

bindImageUpload("add");
bindImageUpload("edit");

const addRefs = getFormRefs("add");
const editRefs = getFormRefs("edit");

const clearAddFormButton = document.getElementById("clearAddFormButton");
const reloadEditFormButton = document.getElementById("reloadEditFormButton");

function validateProduct(data) {
  return (
    data.name &&
    data.description &&
    data.badge &&
    data.category &&
    data.dosage &&
    data.benefit &&
    data.application &&
    Number.isFinite(data.price)
  );
}

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = formToPayload(addRefs);
  if (!validateProduct(data)) return;
  saveAll([data, ...currentProducts]);
  fillForm(addRefs, null);
  activateTab("products");
});

clearAddFormButton.addEventListener("click", () => fillForm(addRefs, null));

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = formToPayload(editRefs, editProductSelect.value);
  if (!data.id || !validateProduct(data)) return;
  const next = currentProducts.map((p) => (p.id === data.id ? data : p));
  saveAll(next);
  editProductSelect.value = data.id;
  loadEditForm(data.id);
});

reloadEditFormButton.addEventListener("click", () => loadEditForm(editProductSelect.value));

editProductSelect.addEventListener("change", () => loadEditForm(editProductSelect.value));
refreshEditSelectButton.addEventListener("click", () => renderEditSelect());

deleteCurrentProductButton.addEventListener("click", () => {
  const id = editProductSelect.value;
  if (!id) return;
  const selected = currentProducts.find((p) => p.id === id);
  if (!selected) return;
  const ok = window.confirm(`Excluir o produto "${selected.name}"?`);
  if (!ok) return;
  saveAll(currentProducts.filter((p) => p.id !== id));
});

productsSearch.addEventListener("input", () => {
  currentSearch = productsSearch.value;
  renderProductsTable();
});

tableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const editId = target.closest("[data-edit-open]")?.getAttribute("data-edit-open");
  const deleteId = target.closest("[data-delete]")?.getAttribute("data-delete");

  if (editId) {
    activateTab("edit");
    editProductSelect.value = editId;
    loadEditForm(editId);
    return;
  }

  if (deleteId) {
    const item = currentProducts.find((p) => p.id === deleteId);
    if (!item) return;
    const ok = window.confirm(`Excluir o produto "${item.name}"?`);
    if (!ok) return;
    saveAll(currentProducts.filter((p) => p.id !== deleteId));
  }
});

resetDefaultsButton.addEventListener("click", () => {
  const ok = window.confirm("Restaurar catálogo padrão? Isso substitui os dados atuais do painel.");
  if (!ok) return;
  saveAll(catalogDefaults());
  fillForm(addRefs, null);
});

securityForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nextUser = normalizeAdminUsername(newAdminUsername.value);
  const a = newAdminPassword.value.trim();
  const b = confirmAdminPassword.value.trim();

  if (nextUser.length < 3) {
    setHint(securityFeedback, "O usuário precisa ter pelo menos 3 caracteres.", "error");
    return;
  }
  if (a.length < 6) {
    setHint(securityFeedback, "A senha precisa ter pelo menos 6 caracteres.", "error");
    return;
  }
  if (a !== b) {
    setHint(securityFeedback, "A confirmação da senha não confere.", "error");
    return;
  }

  const hash = await sha256Hex(a);
  localStorage.setItem(USERNAME_KEY, nextUser);
  localStorage.setItem(PASSWORD_HASH_KEY, hash);
  newAdminPassword.value = "";
  confirmAdminPassword.value = "";
  setHint(securityFeedback, "Login e senha atualizados com sucesso.", "ok");
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  window.location.reload();
});

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activateTab(btn.dataset.tabTarget);
  });
});

async function unlockAdmin() {
  loginGate.style.display = "none";
  adminApp.classList.remove("is-hidden");
  currentProducts = readProducts();
  fillForm(addRefs, null);
  refreshAll();
  activateTab("overview");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userInput = normalizeAdminUsername(loginUsernameInput.value);
  const passInput = loginPasswordInput.value;
  const expectedUser = await getExpectedUsername();
  const expectedHash = await getExpectedPasswordHash();
  const currentHash = await sha256Hex(passInput);

  if (userInput !== expectedUser || currentHash !== expectedHash) {
    setHint(loginHint, "Usuário ou senha incorretos.", "error");
    return;
  }

  sessionStorage.setItem(AUTH_SESSION_KEY, "1");
  setHint(loginHint, "Acesso autorizado.", "ok");
  loginUsernameInput.value = "";
  loginPasswordInput.value = "";
  unlockAdmin();
});

async function init() {
  purgeLegacyAdminCredentials();
  const expectedHash = await getExpectedPasswordHash();
  if (!expectedHash) return;
  if (sessionStorage.getItem(AUTH_SESSION_KEY) === "1") {
    unlockAdmin();
    return;
  }
  loginGate.style.display = "grid";
  adminApp.classList.add("is-hidden");
}

init();
