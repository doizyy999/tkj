/* TKJ Toolkit — base64.js (UTF-8 safe encode/decode) */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const input = document.getElementById("b64-input");
    const output = document.getElementById("b64-output");
    const errorArea = document.getElementById("b64-error");
    let mode = "encode";

    function utf8Encode(text) {
        const bytes = new TextEncoder().encode(text);
        let binary = "";
        bytes.forEach(function (b) { binary += String.fromCharCode(b); });
        return btoa(binary);
    }

    function utf8Decode(b64) {
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    }

    function setMode(next) {
        mode = next;
        tabs.forEach(function (t) {
            t.setAttribute("aria-selected", t.getAttribute("data-mode") === mode ? "true" : "false");
        });
        input.value = "";
        output.value = "";
        TKJUtils.clearChildren(errorArea);
        input.placeholder = mode === "encode" ? "Text to encode, e.g. Hello World" : "Base64 to decode, e.g. SGVsbG8gV29ybGQ=";
        input.focus();
    }

    tabs.forEach(function (t) {
        t.addEventListener("click", function () { setMode(t.getAttribute("data-mode")); });
    });

    document.getElementById("convert-btn").addEventListener("click", function () {
        const value = input.value;
        TKJUtils.clearChildren(errorArea);
        output.value = "";
        if (!value.trim()) {
            TKJUtils.showError(errorArea, "Input is empty.");
            return;
        }
        try {
            output.value = mode === "encode" ? utf8Encode(value) : utf8Decode(value.trim());
        } catch (err) {
            TKJUtils.showError(errorArea, mode === "encode"
                ? "Unable to encode this input."
                : "Invalid Base64. Please check your input.");
        }
    });

    document.getElementById("copy-btn").addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
        else TKJToast.error("Nothing to copy yet.");
    });
    document.getElementById("clear-btn").addEventListener("click", function () {
        input.value = "";
        output.value = "";
        TKJUtils.clearChildren(errorArea);
        input.focus();
    });
});
