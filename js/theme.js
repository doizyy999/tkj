/* TKJ Toolkit — theme.js
   Light / Dark / System theme with localStorage persistence.
   Loaded in <head> (no defer) to prevent flashing. */
"use strict";

(function () {
    const STORAGE_KEY = "tkj-theme";
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function stored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function resolve(pref) {
        if (pref === "light" || pref === "dark") return pref;
        return media.matches ? "dark" : "light";
    }

    function apply(pref) {
        document.documentElement.setAttribute("data-theme", resolve(pref));
        document.documentElement.setAttribute("data-theme-pref", pref || "system");
    }

    function set(pref) {
        try {
            if (pref === "system") localStorage.removeItem(STORAGE_KEY);
            else localStorage.setItem(STORAGE_KEY, pref);
        } catch (e) { /* storage unavailable */ }
        apply(pref);
        updateIcons(pref);
    }

    function current() {
        const s = stored();
        return (s === "light" || s === "dark") ? s : "system";
    }

    function cycle() {
        const order = ["light", "dark", "system"];
        const next = order[(order.indexOf(current()) + 1) % order.length];
        set(next);
        return next;
    }

    function iconFor(pref) {
        if (pref === "light") return "fa-solid fa-sun";
        if (pref === "dark") return "fa-solid fa-moon";
        return "fa-solid fa-circle-half-stroke";
    }

    function labelFor(pref) {
        if (pref === "light") return "Light theme";
        if (pref === "dark") return "Dark theme";
        return "System theme";
    }

    function updateIcons(pref) {
        const p = pref || current();
        document.querySelectorAll(".theme-toggle").forEach(btn => {
            const icon = btn.querySelector("i");
            if (icon) icon.className = iconFor(p);
            const label = btn.querySelector("[data-theme-label]");
            if (label) label.textContent = labelFor(p);
            btn.setAttribute("aria-label", "Theme: " + labelFor(p) + ". Activate to switch theme.");
            btn.setAttribute("title", labelFor(p));
        });
    }

    // Apply immediately to avoid flash of incorrect theme
    apply(stored());

    if (typeof media.addEventListener === "function") {
        media.addEventListener("change", function () {
            if (current() === "system") apply("system");
        });
    }

    window.TKJTheme = { cycle: cycle, set: set, current: current, updateIcons: updateIcons };

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".theme-toggle").forEach(btn => {
            btn.addEventListener("click", function () { cycle(); });
        });
        updateIcons(current());
    });
})();
