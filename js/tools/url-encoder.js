/* TKJ Toolkit — url-encoder.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const input = document.getElementById("url-input");
    const output = document.getElementById("url-output");
    const errorArea = document.getElementById("url-error");
    let mode = "encode";

    function setMode(next) {
        mode = next;
        tabs.forEach(function (t) {
            t.setAttribute("aria-selected", t.getAttribute("data-mode") === mode ? "true" : "false");
        });
        input.value = "";
        output.value = "";
        TKJUtils.clearChildren(errorArea);
        input.placeholder = mode === "encode"
            ? "https://example.com/?name=John Doe"
            : "https%3A%2F%2Fexample.com%2F%3Fname%3DJohn%20Doe";
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
            output.value = mode === "encode"
                ? encodeURIComponent(value)
                : decodeURIComponent(value.trim());
        } catch (err) {
            TKJUtils.showError(errorArea, "Invalid URL encoding. The input contains malformed percent sequences.");
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
