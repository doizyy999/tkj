/* TKJ Toolkit — color-converter.js (HEX / RGB / HSL) */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("color-input");
    const preview = document.getElementById("color-preview");
    const results = document.getElementById("results");
    const resultBody = document.getElementById("result-body");

    function hexToRgb(hex) {
        let h = hex.replace("#", "").trim();
        if (/^[0-9a-fA-F]{3}$/.test(h)) {
            h = h.split("").map(function (c) { return c + c; }).join("");
        }
        if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16)
        };
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4;
            }
            h *= 60;
        }
        return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function convert() {
        const raw = input.value.trim();
        const rgb = hexToRgb(raw);
        if (!rgb) {
            results.style.display = "none";
            TKJUtils.showError(resultBody, "Invalid HEX color. Use #RGB or #RRGGBB, e.g. #6F42C1.");
            return;
        }
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hex = ("#" + [rgb.r, rgb.g, rgb.b].map(function (n) {
            return n.toString(16).padStart(2, "0");
        }).join("")).toUpperCase();

        preview.style.background = hex;
        results.style.display = "";
        TKJUtils.renderResultGrid(resultBody, [
            { label: "HEX", value: hex },
            { label: "RGB", value: "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")" },
            { label: "HSL", value: "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)" },
            { label: "RGB Values", value: "R:" + rgb.r + " G:" + rgb.g + " B:" + rgb.b }
        ]);
    }

    document.getElementById("convert-btn").addEventListener("click", convert);
    input.addEventListener("input", TKJUtils.debounce(convert, 250));
    convert();
});
