/* TKJ Toolkit — password-generator.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("password-output");
    const lengthRange = document.getElementById("length");
    const lengthValue = document.getElementById("length-value");
    const optUpper = document.getElementById("opt-upper");
    const optLower = document.getElementById("opt-lower");
    const optNumbers = document.getElementById("opt-numbers");
    const optSymbols = document.getElementById("opt-symbols");
    const optAmbiguous = document.getElementById("opt-ambiguous");
    const strengthBar = document.getElementById("strength-bar-fill");
    const strengthLabel = document.getElementById("strength-label-text");

    const SETS = {
        upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
        lower: "abcdefghijkmnpqrstuvwxyz",
        numbers: "23456789",
        symbols: "!@#$%^&*()-_=+[]{};:,.<>?/"
    };
    const AMBIGUOUS = { upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", lower: "abcdefghijklmnopqrstuvwxyz", numbers: "0123456789" };

    function charset() {
        let chars = "";
        if (optUpper.checked) chars += optAmbiguous.checked ? SETS.upper : AMBIGUOUS.upper;
        if (optLower.checked) chars += optAmbiguous.checked ? SETS.lower : AMBIGUOUS.lower;
        if (optNumbers.checked) chars += optAmbiguous.checked ? SETS.numbers : AMBIGUOUS.numbers;
        if (optSymbols.checked) chars += SETS.symbols;
        return chars;
    }

    function generate() {
        const chars = charset();
        const len = Number(lengthRange.value);
        if (!chars) {
            output.value = "";
            updateStrength(0, "Select at least one character set.");
            TKJToast.error("Select at least one character set.");
            return;
        }
        const buf = new Uint32Array(len);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(buf);
        } else {
            for (let i = 0; i < len; i++) buf[i] = Math.floor(Math.random() * 4294967296);
        }
        let pw = "";
        for (let i = 0; i < len; i++) pw += chars.charAt(buf[i] % chars.length);
        output.value = pw;
        assess(pw, chars.length);
    }

    function assess(pw, poolSize) {
        const entropy = pw.length * Math.log2(poolSize);
        let label, pct, color;
        if (entropy < 45) { label = "Weak"; pct = 25; color = "var(--danger)"; }
        else if (entropy < 65) { label = "Fair"; pct = 50; color = "var(--warning)"; }
        else if (entropy < 90) { label = "Strong"; pct = 75; color = "var(--success)"; }
        else { label = "Very Strong"; pct = 100; color = "var(--success)"; }
        updateStrength(pct, label, color);
    }

    function updateStrength(pct, label, color) {
        strengthBar.style.width = pct + "%";
        strengthBar.style.background = color || "var(--danger)";
        strengthLabel.innerHTML = "";
        const strong = document.createElement("strong");
        strong.textContent = label;
        strengthLabel.appendChild(strong);
    }

    lengthRange.addEventListener("input", function () {
        lengthValue.textContent = lengthRange.value;
        if (output.value) generate();
    });
    [optUpper, optLower, optNumbers, optSymbols, optAmbiguous].forEach(function (el) {
        el.addEventListener("change", function () { if (output.value) generate(); });
    });

    document.getElementById("generate-btn").addEventListener("click", generate);
    document.getElementById("copy-btn").addEventListener("click", function () {
        if (output.value) copyToClipboard(output.value);
        else TKJToast.error("Generate a password first.");
    });
    document.getElementById("reset-btn").addEventListener("click", function () {
        output.value = "";
        lengthRange.value = 16;
        lengthValue.textContent = "16";
        optUpper.checked = optLower.checked = optNumbers.checked = optSymbols.checked = true;
        optAmbiguous.checked = false;
        updateStrength(0, "—");
    });

    generate();
});
