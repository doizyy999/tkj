/* TKJ Toolkit — toast.js
   Lightweight, accessible toast notifications. */
"use strict";

const TKJToast = (function () {
    let container = null;

    function ensureContainer() {
        if (container && document.body.contains(container)) return container;
        container = document.createElement("div");
        container.className = "toast-container";
        container.setAttribute("aria-live", "polite");
        container.setAttribute("role", "status");
        document.body.appendChild(container);
        return container;
    }

    function show(message, type, duration) {
        const box = ensureContainer();
        const toast = document.createElement("div");
        toast.className = "toast" + (type === "error" ? " toast-error" : "");

        const icon = document.createElement("i");
        icon.className = type === "error"
            ? "fa-solid fa-circle-exclamation"
            : "fa-solid fa-circle-check";
        icon.setAttribute("aria-hidden", "true");

        const text = document.createElement("span");
        text.textContent = message;

        toast.appendChild(icon);
        toast.appendChild(text);
        box.appendChild(toast);

        const ttl = duration || 2600;
        setTimeout(function () {
            toast.classList.add("toast-out");
            setTimeout(function () { toast.remove(); }, 200);
        }, ttl);
    }

    return {
        success: function (msg) { show(msg, "success"); },
        error: function (msg) { show(msg, "error", 3600); }
    };
})();
