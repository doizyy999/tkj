/* TKJ Toolkit — mac-generator.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("mac-output");
    const formatInputs = document.querySelectorAll('input[name="mac-format"]');
    const unicastLocal = document.getElementById("mac-unicast-local");

    function currentSeparator() {
        let sep = ":";
        formatInputs.forEach(function (r) { if (r.checked) sep = r.value; });
        return sep;
    }

    function generate() {
        const bytes = [];
        for (let i = 0; i < 6; i++) bytes.push(TKJUtils.randomByte());
        if (unicastLocal && unicastLocal.checked) {
            bytes[0] = (bytes[0] & 0xFE) | 0x02; // unicast + locally administered
        }
        const hex = bytes.map(function (b) {
            return b.toString(16).padStart(2, "0").toUpperCase();
        });
        const sep = currentSeparator();
        output.textContent = sep === "" ? hex.join("") : hex.join(sep);
    }

    document.getElementById("generate-btn").addEventListener("click", generate);
    document.getElementById("copy-btn").addEventListener("click", function () {
        if (output.textContent.trim()) copyToClipboard(output.textContent.trim());
        else TKJToast.error("Generate a MAC address first.");
    });
    formatInputs.forEach(function (r) {
        r.addEventListener("change", function () {
            if (output.textContent.trim()) generate();
        });
    });

    generate();
});
