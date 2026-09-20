/* TKJ Toolkit — qr-generator.js
   Uses the lightweight qrcodejs library loaded via CDN on the page. */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("qr-input");
    const box = document.getElementById("qr-box");
    const resultArea = document.getElementById("qr-result");
    const errorArea = document.getElementById("qr-error");
    const downloadBtn = document.getElementById("download-btn");
    let currentDataUrl = null;

    document.getElementById("generate-btn").addEventListener("click", function () {
        const text = input.value.trim();
        TKJUtils.clearChildren(errorArea);

        if (!text) {
            TKJUtils.showError(errorArea, "Enter some text or a URL first.");
            return;
        }
        if (typeof QRCode === "undefined") {
            TKJUtils.showError(errorArea, "QR library failed to load. Check your connection and reload the page.");
            return;
        }

        TKJUtils.clearChildren(box);
        try {
            new QRCode(box, {
                text: text,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
            resultArea.style.display = "";

            // qrcodejs renders into canvas + img; capture PNG when ready
            setTimeout(function () {
                const canvas = box.querySelector("canvas");
                const img = box.querySelector("img");
                if (canvas) currentDataUrl = canvas.toDataURL("image/png");
                else if (img) currentDataUrl = img.src;
            }, 120);
        } catch (err) {
            resultArea.style.display = "none";
            TKJUtils.showError(errorArea, "Unable to generate a QR code for this input.");
        }
    });

    downloadBtn.addEventListener("click", function () {
        if (!currentDataUrl) {
            TKJToast.error("Generate a QR code first.");
            return;
        }
        const a = document.createElement("a");
        a.href = currentDataUrl;
        a.download = "qr-code.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        TKJToast.success("QR code downloaded");
    });

    document.getElementById("reset-btn").addEventListener("click", function () {
        input.value = "";
        TKJUtils.clearChildren(box);
        TKJUtils.clearChildren(errorArea);
        resultArea.style.display = "none";
        currentDataUrl = null;
        input.focus();
    });
});
