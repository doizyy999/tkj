/* TKJ Toolkit — hash-generator.js (Web Crypto API) */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("hash-input");
    const algo = document.getElementById("hash-algo");
    const output = document.getElementById("hash-output");
    const errorArea = document.getElementById("hash-error");
    const generateBtn = document.getElementById("generate-btn");

    if (!window.crypto || !window.crypto.subtle) {
        generateBtn.disabled = true;
        TKJUtils.showError(errorArea, "Web Crypto API is not available in this browser. Hashing requires a secure context (HTTPS or localhost).");
        return;
    }

    async function digest(name, text) {
        const data = new TextEncoder().encode(text);
        const buffer = await crypto.subtle.digest(name, data);
        return Array.from(new Uint8Array(buffer))
            .map(function (b) { return b.toString(16).padStart(2, "0"); })
            .join("");
    }

    generateBtn.addEventListener("click", async function () {
        TKJUtils.clearChildren(errorArea);
        output.value = "";
        if (!input.value) {
            TKJUtils.showError(errorArea, "Enter text to hash.");
            return;
        }
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Hashing...';
        try {
            output.value = await digest(algo.value, input.value);
        } catch (err) {
            TKJUtils.showError(errorArea, "Unable to generate the hash.");
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fa-solid fa-hashtag" aria-hidden="true"></i> Generate';
        }
    });

    document.getElementById("copy-btn").addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
        else TKJToast.error("Generate a hash first.");
    });
});
