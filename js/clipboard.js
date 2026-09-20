/* TKJ Toolkit — clipboard.js
   copyToClipboard helper with legacy fallback. */
"use strict";

function copyToClipboard(text) {
    const value = String(text == null ? "" : text);

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        return navigator.clipboard.writeText(value).then(function () {
            TKJToast.success("Copied to clipboard");
        }).catch(function () {
            return legacyCopy(value);
        });
    }
    return legacyCopy(value);
}

function legacyCopy(value) {
    return new Promise(function (resolve, reject) {
        const area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
            const ok = document.execCommand("copy");
            document.body.removeChild(area);
            if (ok) {
                TKJToast.success("Copied to clipboard");
                resolve();
            } else {
                TKJToast.error("Copy failed. Please copy manually.");
                reject(new Error("execCommand failed"));
            }
        } catch (err) {
            document.body.removeChild(area);
            TKJToast.error("Copy failed. Please copy manually.");
            reject(err);
        }
    });
}
