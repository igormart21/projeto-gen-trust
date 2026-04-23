(function () {
  const concMgEl = document.getElementById("concMg");
  const concMlEl = document.getElementById("concMl");
  const concOutEl = document.getElementById("concOut");
  const doseValueEl = document.getElementById("doseValue");
  const doseInputLabel = document.getElementById("doseInputLabel");
  const unitButtons = Array.from(document.querySelectorAll(".dose-calc-seg__btn"));
  const rangeEl = document.getElementById("syringeRange");
  const fluidEl = document.getElementById("syringeFluid");
  const liveLineEl = document.getElementById("liveLine");
  const capNoteEl = document.getElementById("capNote");
  const outMg = document.getElementById("outMg");
  const outUi = document.getElementById("outUi");
  const outMl = document.getElementById("outMl");
  const outPct = document.getElementById("outPct");
  const btnClear = document.getElementById("btnClear");
  const btnCopy = document.getElementById("btnCopy");
  const btnExample = document.getElementById("btnExample");
  const copyHintEl = document.getElementById("copyHint");

  const UI_PER_ML = 100;

  let activeUnit = "mg";
  let suppressRange = false;

  function T(key) {
    return window.GT_i18n ? window.GT_i18n.t(key) : key;
  }

  function localeTag() {
    const L = window.GT_i18n ? window.GT_i18n.getLang() : "pt";
    return L === "en" ? "en-US" : L === "es" ? "es-ES" : "pt-BR";
  }

  function inject(template, vals) {
    return String(template).replace(/\{\{(\w+)\}\}/g, (_, k) =>
      vals && Object.prototype.hasOwnProperty.call(vals, k) && vals[k] != null ? String(vals[k]) : ""
    );
  }

  function fmt(n, opts) {
    if (!Number.isFinite(n)) return "—";
    const o = opts || {};
    const min = o.minFractionDigits != null ? o.minFractionDigits : 0;
    const max = o.maxFractionDigits != null ? o.maxFractionDigits : 3;
    return n.toLocaleString(localeTag(), {
      minimumFractionDigits: min,
      maximumFractionDigits: max
    });
  }

  function getMgPerMl() {
    const mg = Number(concMgEl && concMgEl.value);
    const ml = Number(concMlEl && concMlEl.value);
    if (!Number.isFinite(mg) || !Number.isFinite(ml) || mg <= 0 || ml <= 0) return null;
    return mg / ml;
  }

  function setActiveUnit(unit) {
    activeUnit = unit;
    unitButtons.forEach((b) => {
      const u = b.getAttribute("data-unit");
      const on = u === unit;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    const labels = {
      mg: T("calc_val_mg"),
      ui: T("calc_val_ui"),
      ml: T("calc_val_ml")
    };
    if (doseInputLabel) doseInputLabel.textContent = labels[unit] || labels.mg;
  }

  function readTriplet() {
    const c = getMgPerMl();
    const raw = parseFloat(String(doseValueEl && doseValueEl.value).replace(",", "."));
    if (!c || !Number.isFinite(raw) || raw < 0) return null;

    let mg = 0;
    let ml = 0;
    let ui = 0;
    if (activeUnit === "mg") {
      mg = raw;
      ml = mg / c;
      ui = ml * UI_PER_ML;
    } else if (activeUnit === "ui") {
      ui = raw;
      ml = ui / UI_PER_ML;
      mg = ml * c;
    } else {
      ml = raw;
      mg = ml * c;
      ui = ml * UI_PER_ML;
    }
    return { mg, ml, ui, c };
  }

  function fixInputNumberDisplay(t) {
    if (!doseValueEl || !t) return;
    const v = activeUnit === "mg" ? t.mg : activeUnit === "ui" ? t.ui : t.ml;
    if (!Number.isFinite(v)) return;
    const rounded =
      activeUnit === "ui"
        ? Math.round(v * 100) / 100
        : activeUnit === "mg"
          ? Math.round(v * 1000) / 1000
          : Math.round(v * 10000) / 10000;
    doseValueEl.value = String(rounded);
  }

  function updateOutputs(t) {
    if (!t) {
      if (concOutEl) concOutEl.textContent = T("calc_conc_out_none");
      if (liveLineEl) liveLineEl.textContent = T("calc_live_none");
      if (outMg) outMg.textContent = "—";
      if (outUi) outUi.textContent = "—";
      if (outMl) outMl.textContent = "—";
      if (outPct) outPct.textContent = "—";
      if (fluidEl) fluidEl.style.height = "0%";
      if (capNoteEl) capNoteEl.hidden = true;
      return;
    }

    const { mg, ml, ui, c } = t;
    const insulinUnit = T("calc_insulin_unit");
    if (concOutEl) {
      concOutEl.textContent = `${T("calc_conc_prefix")} ${fmt(c, { maxFractionDigits: 4, minFractionDigits: 1 })} mg/ml`;
    }
    if (liveLineEl) {
      liveLineEl.textContent = inject(T("calc_live_line"), {
        mg: fmt(mg, { maxFractionDigits: 3 }),
        ui: fmt(ui, { maxFractionDigits: 2 }),
        ml: fmt(ml, { maxFractionDigits: 4 }),
        unit: insulinUnit
      });
    }

    if (outMg) outMg.textContent = fmt(mg, { maxFractionDigits: 3 });
    if (outUi) outUi.textContent = fmt(ui, { maxFractionDigits: 2 });
    if (outMl) outMl.textContent = fmt(ml, { maxFractionDigits: 4 });
    const pctDisplay = ui > 100 ? `${fmt(100, { maxFractionDigits: 1 })}%+` : `${fmt(ui, { maxFractionDigits: 1 })}%`;
    if (outPct) outPct.textContent = pctDisplay;

    const vis = Math.min(100, ui);
    if (fluidEl) fluidEl.style.height = `${vis}%`;

    if (rangeEl) {
      suppressRange = true;
      rangeEl.value = String(Math.min(100, Math.max(0, ui)));
      suppressRange = false;
    }

    if (capNoteEl) {
      if (ui > 100) {
        capNoteEl.hidden = false;
        capNoteEl.textContent = inject(T("calc_cap_note"), {
          ui: fmt(ui, { maxFractionDigits: 2 }),
          unit: insulinUnit
        });
      } else {
        capNoteEl.hidden = true;
      }
    }
  }

  function updateAll() {
    const t = readTriplet();
    updateOutputs(t);
    if (t) fixInputNumberDisplay(t);
  }

  function setTripletFromUi(ui) {
    const c = getMgPerMl();
    if (!c || !Number.isFinite(ui) || ui < 0) return;
    activeUnit = "ui";
    setActiveUnit("ui");
    doseValueEl.value = String(Math.round(ui * 100) / 100);
    updateAll();
  }

  if (!concMgEl || !concMlEl || !doseValueEl) return;

  unitButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const prev = readTriplet();
      const next = btn.getAttribute("data-unit");
      if (!next || !prev) {
        setActiveUnit(next || "mg");
        updateAll();
        return;
      }
      setActiveUnit(next);
      if (next === "mg") doseValueEl.value = String(prev.mg);
      else if (next === "ui") doseValueEl.value = String(prev.ui);
      else doseValueEl.value = String(prev.ml);
      updateAll();
    });
  });

  [concMgEl, concMlEl, doseValueEl].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => updateAll());
    el.addEventListener("change", () => updateAll());
  });

  if (rangeEl) {
    rangeEl.addEventListener("input", () => {
      if (suppressRange) return;
      const ui = Number(rangeEl.value);
      if (!Number.isFinite(ui)) return;
      setTripletFromUi(ui);
    });
  }

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      concMgEl.value = "30";
      concMlEl.value = "1";
      activeUnit = "mg";
      setActiveUnit("mg");
      doseValueEl.value = "2.5";
      if (copyHintEl) copyHintEl.textContent = "";
      updateAll();
    });
  }

  if (btnExample) {
    btnExample.addEventListener("click", () => {
      concMgEl.value = "30";
      concMlEl.value = "1";
      activeUnit = "mg";
      setActiveUnit("mg");
      doseValueEl.value = "2.5";
      if (copyHintEl) copyHintEl.textContent = "";
      updateAll();
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener("click", async () => {
      const t = readTriplet();
      if (!t) {
        if (copyHintEl) copyHintEl.textContent = T("calc_copy_invalid");
        return;
      }
      const { mg, ml, ui, c } = t;
      const unit = T("calc_insulin_unit");
      const pctLine =
        ui > 100
          ? inject(T("calc_copy_vis_over"), {
              p: fmt(100, { maxFractionDigits: 1 }),
              ui: fmt(ui, { maxFractionDigits: 2 }),
              unit
            })
          : inject(T("calc_copy_vis_ok"), {
              p: fmt(ui, { maxFractionDigits: 1 }),
              unit
            });
      const text = [
        T("calc_copy_header"),
        inject(T("calc_copy_conc"), {
          c: fmt(c, { maxFractionDigits: 4 }),
          a: concMgEl.value,
          b: concMlEl.value
        }),
        inject(T("calc_copy_dose"), {
          mg: fmt(mg, { maxFractionDigits: 3 }),
          ui: fmt(ui, { maxFractionDigits: 2 }),
          ml: fmt(ml, { maxFractionDigits: 4 }),
          unit
        }),
        pctLine,
        "",
        T("calc_copy_edu")
      ].join("\n");
      try {
        await navigator.clipboard.writeText(text);
        if (copyHintEl) copyHintEl.textContent = T("calc_copy_ok");
      } catch {
        if (copyHintEl) copyHintEl.textContent = T("calc_copy_fail");
      }
    });
  }

  window.addEventListener("gt:locale", () => {
    setActiveUnit(activeUnit);
    if (copyHintEl) copyHintEl.textContent = "";
    updateAll();
  });

  setActiveUnit("mg");
  updateAll();
})();
