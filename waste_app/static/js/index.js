/* EcoTrack frontend behaviours — vanilla JS, Django-compatible */
(function () {
  "use strict";
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  /* Sidebar toggle */
  function initSidebar() {
    const toggle = qs("[data-et-sidebar-toggle]");
    const closeBtns = qsa("[data-et-sidebar-close]");
    if (!toggle) return;
    const setOpen = (open) => {
      document.body.classList.toggle("sidebar-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", () => {
      setOpen(!document.body.classList.contains("sidebar-open"));
    });
    closeBtns.forEach((btn) => btn.addEventListener("click", () => setOpen(false)));
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) setOpen(false);
    });
  }
  /* Password visibility */
  function initPasswordToggle() {
    qsa("[data-et-toggle-password]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const wrap = btn.closest(".et-password-wrap") || btn.parentElement;
        const input = wrap && wrap.querySelector("input");
        if (!input) return;
        const hidden = input.type === "password";
        input.type = hidden ? "text" : "password";
        btn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
        const icon = btn.querySelector("i");
        if (icon) {
          icon.classList.toggle("bi-eye", !hidden);
          icon.classList.toggle("bi-eye-slash", hidden);
        }
      });
    });
  }
  /* Password strength */
  function scorePassword(value) {
    let score = 0;
    if (!value) return 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return Math.min(score, 4);
  }
  function initPasswordStrength() {
    const bar = qs("[data-et-strength]");
    const label = qs("[data-et-strength-label]");
    if (!bar) return;
    const words = ["Too weak", "Weak", "Fair", "Good", "Strong"];
    const update = (value) => {
      const score = scorePassword(value);
      bar.dataset.score = String(score);
      if (label) label.textContent = value ? words[score] : "";
    };
    document.addEventListener("input", (e) => {
      const t = e.target;
      if (!t || t.name !== "password1") return;
      update(t.value);
    });
    const existing = qs("input[name='password1']");
    if (existing) update(existing.value);
  }
  /* Image preview + drag and drop */
  function initImagePreview() {
    qsa("[data-et-dropzone]").forEach((zone) => {
      const input =
        qs("input[type='file']", zone) ||
        qs(zone.dataset.etDropzone || "input[type='file']");
      const previewWrap = qs("[data-et-preview]");
      const previewImg = previewWrap && qs("img", previewWrap);
      const show = (file) => {
        if (!file || !file.type.startsWith("image/") || !previewImg) return;
        const reader = new FileReader();
        reader.onload = () => {
          previewImg.src = reader.result;
          previewWrap.style.display = "block";
        };
        reader.readAsDataURL(file);
      };
      if (input) {
        input.addEventListener("change", () => {
          if (input.files && input.files[0]) show(input.files[0]);
        });
      }
      ["dragenter", "dragover"].forEach((ev) => {
        zone.addEventListener(ev, (e) => {
          e.preventDefault();
          zone.classList.add("is-dragover");
        });
      });
      ["dragleave", "drop"].forEach((ev) => {
        zone.addEventListener(ev, (e) => {
          e.preventDefault();
          zone.classList.remove("is-dragover");
        });
      });
      zone.addEventListener("drop", (e) => {
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (!file || !input) return;
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        show(file);
      });
      zone.addEventListener("click", (e) => {
        if (e.target.closest("input") || qs("input[type='file']", zone)) return;
        if (input) input.click();
      });
    });
    qsa("[data-et-file-preview]").forEach((input) => {
      input.addEventListener("change", () => {
        const target = qs(input.dataset.etFilePreview);
        if (!target || !input.files[0]) return;
        const img = qs("img", target) || target;
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
          target.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
      });
    });
  }
  /* Character counter */
  function initCharCounter() {
    qsa("[data-et-counter], #complaintForm textarea").forEach((field) => {
      const counter = qs(field.dataset.etCounter);
      if (!counter) return;
      const max = Number(field.getAttribute("maxlength")) || 500;
      const update = () => {
        counter.textContent = `${field.value.length} / ${max}`;
      };
      field.addEventListener("input", update);
      update();
    });
  }
  /* Loading buttons — do not block native submit */
  function initLoadingButtons() {
    qsa("form").forEach((form) => {
      form.addEventListener("submit", () => {
        const btn = qs("[data-et-loading], button[type='submit'], input[type='submit']", form);
        if (!btn || btn.dataset.skipLoading === "true") return;
        btn.classList.add("is-loading");
        btn.setAttribute("aria-busy", "true");
        if (btn.tagName === "BUTTON") {
          if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML;
          btn.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait…';
        }
      });
    });
  }
  /* Auto dismiss messages */
  function initMessages() {
    qsa(".alert[data-et-autohide], .et-toast-stack .alert").forEach((alert) => {
      window.setTimeout(() => {
        alert.classList.add("fade");
        window.setTimeout(() => alert.remove(), 400);
      }, 4500);
    });
  }
  /* Delete / status confirmation */
  function initConfirmations() {
    qsa("[data-et-confirm], .js-delete-form").forEach((el) => {
      const handler = (e) => {
        const message =
          el.getAttribute("data-et-confirm") ||
          "This action cannot be undone. Continue?";
        if (!window.confirm(message)) e.preventDefault();
      };
      if (el.tagName === "FORM") el.addEventListener("submit", handler);
      else el.addEventListener("click", handler);
    });
    qsa(".js-confirm-status, [data-et-status-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        const select = qs("select[name='status']", form);
        const status = select ? select.value : "the new status";
        if (!window.confirm(`Update this complaint to “${status}”?`)) {
          e.preventDefault();
        }
      });
    });
    qsa("select.js-status-select").forEach((select) => {
      select.addEventListener("change", () => {
        const form = select.form;
        if (!form) return;
        if (window.confirm(`Update this complaint to “${select.value}”?`)) {
          form.requestSubmit();
        } else {
          select.value = select.getAttribute("data-current") || select.value;
        }
      });
    });
  }
  /* Table search / status filter (client-side enhancement) */
  function initTableTools() {
    const search = qs("[data-et-table-search]");
    const filter = qs("[data-et-status-filter]");
    const rows = qsa("[data-et-row]");
    const cards = qsa("[data-et-card]");
    const apply = () => {
      const q = (search && search.value ? search.value : "").toLowerCase().trim();
      const status = filter ? filter.value : "";
      [...rows, ...cards].forEach((row) => {
        const hay = (row.dataset.search || row.textContent || "").toLowerCase();
        const rowStatus = row.dataset.status || "";
        const matchQ = !q || hay.includes(q);
        const matchS = !status || rowStatus === status;
        row.style.display = matchQ && matchS ? "" : "none";
      });
    };
    if (search) search.addEventListener("input", apply);
    if (filter) filter.addEventListener("change", apply);
  }
  /* Image preview modal */
  function initImageModal() {
    const modalEl = qs("#etImageModal");
    if (!modalEl || typeof bootstrap === "undefined") return;
    const img = qs("img", modalEl);
    qsa("[data-et-image]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (img) img.src = btn.getAttribute("data-et-image");
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
      });
    });
  }
  /* Smooth scrolling + back to top */
  function initScroll() {
    qsa('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = qs(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    const topBtn = qs("[data-et-back-top]");
    if (!topBtn) return;
    const onScroll = () => {
      topBtn.classList.toggle("is-visible", window.scrollY > 320);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    onScroll();
  }
  document.addEventListener("DOMContentLoaded", () => {
    initSidebar();
    initPasswordToggle();
    initPasswordStrength();
    initImagePreview();
    initCharCounter();
    initLoadingButtons();
    initMessages();
    initConfirmations();
    initTableTools();
    initImageModal();
    initScroll();
  });
})();