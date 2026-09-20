/* TKJ Toolkit — json-formatter.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("json-input");
    const output = document.getElementById("json-output");
    const errorArea = document.getElementById("json-error");
    const status = document.getElementById("json-status");

    function parseInput() {
        TKJUtils.clearChildren(errorArea);
        status.textContent = "";
        const raw = input.value;
        if (!raw.trim()) {
            TKJUtils.showError(errorArea, "Input is empty.");
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (err) {
            TKJUtils.showError(errorArea, "Invalid JSON. Please check your syntax. " + err.message);
            return undefined;
        }
    }

    document.getElementById("format-btn").addEventListener("click", function () {
        const data = parseInput();
        if (data === null || data === undefined) return;
        output.value = JSON.stringify(data, null, 2);
        status.textContent = "Valid JSON — formatted.";
    });

    document.getElementById("minify-btn").addEventListener("click", function () {
        const data = parseInput();
        if (data === null || data === undefined) return;
        output.value = JSON.stringify(data);
        status.textContent = "Valid JSON — minified.";
    });

    document.getElementById("validate-btn").addEventListener("click", function () {
        const data = parseInput();
        if (data === null || data === undefined) return;
        output.value = "";
        status.textContent = "Valid JSON.";
        TKJToast.success("Valid JSON");
    });

    document.getElementById("copy-btn").addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
        else TKJToast.error("Nothing to copy yet.");
    });
    document.getElementById("clear-btn").addEventListener("click", function () {
        input.value = "";
        output.value = "";
        status.textContent = "";
        TKJUtils.clearChildren(errorArea);
        input.focus();
    });
});
