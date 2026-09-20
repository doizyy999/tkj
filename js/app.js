/* TKJ Toolkit — app.js
   Global UI: mobile menu, search dropdown styles injection,
   related tools rendering. */
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Mobile menu ---------- */
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            const open = menu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            const icon = toggle.querySelector("i");
            if (icon) icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && menu.classList.contains("open")) {
                menu.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
                const icon = toggle.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
                toggle.focus();
            }
        });
    }

    /* ---------- Search dropdown styles (kept here to keep CSS files tool-agnostic) ---------- */
    if (!document.getElementById("tkj-search-styles")) {
        const style = document.createElement("style");
        style.id = "tkj-search-styles";
        style.textContent =
            ".search-dropdown{position:absolute;top:calc(100% + 8px);right:0;min-width:260px;" +
            "background:var(--surface);border:1px solid var(--border);border-radius:10px;" +
            "box-shadow:var(--shadow-md);padding:6px;z-index:200}" +
            ".search-item{display:flex;align-items:center;gap:10px;padding:9px 10px;" +
            "border-radius:8px;color:var(--text);font-size:0.9rem;font-weight:500}" +
            ".search-item:hover{background:var(--primary-soft);color:var(--text)}" +
            ".search-item i{color:var(--primary);width:16px;text-align:center}" +
            ".search-empty{padding:12px;color:var(--muted);font-size:0.875rem;text-align:center}";
        document.head.appendChild(style);
    }

    /* ---------- Related tools (tool pages) ---------- */
    const related = document.getElementById("related-tools");
    if (related && typeof TKJTools !== "undefined") {
        const slug = related.getAttribute("data-slug");
        const tools = TKJTools.related(slug, 3);
        const grid = related.querySelector(".card-grid");
        if (grid) {
            grid.innerHTML = tools.map(function (t) {
                return TKJTools.cardHTML(t, "");
            }).join("");
        }
    }
});
