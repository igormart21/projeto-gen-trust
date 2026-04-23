(function () {
  const header = document.querySelector("[data-topbar]");
  const toggle = document.getElementById("topbarNavToggle");
  const nav = document.getElementById("topbarNav");
  if (!header || !toggle || !nav) return;

  const mq = window.matchMedia("(max-width: 720px)");

  function menuOpenLabel() {
    return window.GT_i18n ? window.GT_i18n.t("a11y_close_menu") : "Fechar menu";
  }

  function menuClosedLabel() {
    return window.GT_i18n ? window.GT_i18n.t("a11y_open_menu") : "Abrir menu";
  }

  function setOpen(open) {
    const isMobile = mq.matches;
    header.classList.toggle("topbar--nav-open", open && isMobile);
    toggle.setAttribute("aria-expanded", open && isMobile ? "true" : "false");
    toggle.setAttribute("aria-label", open && isMobile ? menuOpenLabel() : menuClosedLabel());
    document.body.classList.toggle("topbar-menu-open", Boolean(open && isMobile));
  }

  function close() {
    setOpen(false);
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!mq.matches) return;
    setOpen(!header.classList.contains("topbar--nav-open"));
  });

  nav.addEventListener("click", function (e) {
    if (e.target instanceof HTMLElement && e.target.closest("a")) close();
    if (e.target instanceof HTMLElement && e.target.closest(".lang-btn")) close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", function (e) {
    if (!mq.matches) return;
    if (!header.classList.contains("topbar--nav-open")) return;
    if (e.target instanceof Node && !header.contains(e.target)) close();
  });

  mq.addEventListener("change", function () {
    if (!mq.matches) close();
  });

  window.addEventListener("gt:locale", function () {
    const open = header.classList.contains("topbar--nav-open");
    setOpen(open);
  });

  close();
})();
