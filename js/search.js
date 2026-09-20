/* TKJ Toolkit — search.js
   Navbar global search (dropdown) + tools directory search & filtering. */
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Navbar global search ---------- */
    const navInput = document.getElementById("nav-search-input");
    if (navInput && typeof TKJTools !== "undefined") {
        const dropdown = document.createElement("div");
        dropdown.className = "search-dropdown";
        dropdown.setAttribute("role", "listbox");
        dropdown.hidden = true;
        navInput.closest(".nav-search").style.position = "relative";
        navInput.closest(".nav-search").appendChild(dropdown);

        const render = TKJUtils.debounce(function () {
            const q = navInput.value;
            const results = TKJTools.search(q).slice(0, 6);
            TKJUtils.clearChildren(dropdown);

            if (!q.trim()) { dropdown.hidden = true; return; }
            dropdown.hidden = false;

            if (results.length === 0) {
                const empty = document.createElement("div");
                empty.className = "search-empty";
                empty.textContent = "No tools found.";
                dropdown.appendChild(empty);
                return;
            }

            results.forEach(function (tool) {
                const item = document.createElement("a");
                item.className = "search-item";
                item.setAttribute("role", "option");
                item.href = navInput.getAttribute("data-tool-path") + tool.slug + ".html";
                const icon = document.createElement("i");
                icon.className = tool.icon;
                icon.setAttribute("aria-hidden", "true");
                const name = document.createElement("span");
                name.textContent = tool.name;
                item.appendChild(icon);
                item.appendChild(name);
                dropdown.appendChild(item);
            });
        }, 150);

        navInput.addEventListener("input", render);
        navInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const first = dropdown.querySelector("a");
                if (first) { e.preventDefault(); window.location.href = first.href; }
            } else if (e.key === "Escape") {
                dropdown.hidden = true;
                navInput.blur();
            }
        });
        document.addEventListener("click", function (e) {
            if (!dropdown.contains(e.target) && e.target !== navInput) dropdown.hidden = true;
        });
    }

    /* ---------- Tools directory: search + category filter ---------- */
    const directory = document.getElementById("tools-directory");
    if (!directory || typeof TKJTools === "undefined") return;

    const searchInput = document.getElementById("directory-search-input");
    const pills = directory.querySelectorAll(".pill[data-category]");
    const sections = directory.querySelectorAll(".directory-category");
    const emptyState = document.getElementById("directory-empty");

    let activeCategory = "all";
    let query = "";

    function applyFilter() {
        const q = query.trim().toLowerCase();
        let anyVisible = false;

        sections.forEach(function (section) {
            const cat = section.getAttribute("data-category");
            const matchesCategory = (activeCategory === "all" || activeCategory === cat);
            let visibleCards = 0;

            section.querySelectorAll(".tool-card-link").forEach(function (card) {
                const tool = TKJTools.find(card.getAttribute("data-slug"));
                if (!tool) return;
                const matchesQuery = !q ||
                    tool.name.toLowerCase().includes(q) ||
                    tool.description.toLowerCase().includes(q) ||
                    tool.category.toLowerCase().includes(q) ||
                    tool.keywords.some(function (k) { return k.includes(q); });
                const show = matchesCategory && matchesQuery;
                card.style.display = show ? "" : "none";
                if (show) visibleCards++;
            });

            const countEl = section.querySelector(".count");
            if (countEl) countEl.textContent = visibleCards + (visibleCards === 1 ? " tool" : " tools");
            section.style.display = visibleCards > 0 ? "" : "none";
            if (visibleCards > 0) anyVisible = true;
        });

        if (emptyState) emptyState.style.display = anyVisible ? "none" : "";
    }

    if (searchInput) {
        searchInput.addEventListener("input", TKJUtils.debounce(function () {
            query = searchInput.value;
            applyFilter();
        }, 120));
    }

    pills.forEach(function (pill) {
        pill.addEventListener("click", function () {
            activeCategory = pill.getAttribute("data-category");
            pills.forEach(function (p) {
                p.setAttribute("aria-pressed", p === pill ? "true" : "false");
            });
            applyFilter();
        });
    });

    // Deep-link support: ?category=Networking
    try {
        const param = new URLSearchParams(window.location.search).get("category");
        if (param) {
            const target = directory.querySelector('.pill[data-category="' + param + '"]');
            if (target) target.click();
        }
    } catch (e) { /* ignore */ }
});
