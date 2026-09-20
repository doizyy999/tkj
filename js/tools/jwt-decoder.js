/* TKJ Toolkit — jwt-decoder.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("jwt-input");
    const results = document.getElementById("jwt-results");
    const errorArea = document.getElementById("jwt-error");
    const headerOut = document.getElementById("jwt-header");
    const payloadOut = document.getElementById("jwt-payload");
    const signatureOut = document.getElementById("jwt-signature");

    function b64UrlDecode(segment) {
        let b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
        while (b64.length % 4 !== 0) b64 += "=";
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new TextDecoder("utf-8").decode(bytes);
    }

    document.getElementById("decode-btn").addEventListener("click", function () {
        TKJUtils.clearChildren(errorArea);
        results.style.display = "none";
        const token = input.value.trim();

        if (!token) {
            TKJUtils.showError(errorArea, "Paste a JWT first.");
            return;
        }
        const parts = token.split(".");
        if (parts.length !== 3) {
            TKJUtils.showError(errorArea, "Invalid JWT. A token must have three segments separated by dots.");
            return;
        }
        try {
            const header = JSON.parse(b64UrlDecode(parts[0]));
            const payload = JSON.parse(b64UrlDecode(parts[1]));
            headerOut.textContent = JSON.stringify(header, null, 2);
            payloadOut.textContent = JSON.stringify(payload, null, 2);
            signatureOut.textContent = parts[2];
            results.style.display = "";
        } catch (err) {
            TKJUtils.showError(errorArea, "Unable to decode this token. The header or payload is not valid Base64URL JSON.");
        }
    });

    document.getElementById("clear-btn").addEventListener("click", function () {
        input.value = "";
        results.style.display = "none";
        TKJUtils.clearChildren(errorArea);
        input.focus();
    });

    results.querySelectorAll(".copy-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const target = document.getElementById(btn.getAttribute("data-target"));
            if (target && target.textContent) copyToClipboard(target.textContent);
        });
    });
});
