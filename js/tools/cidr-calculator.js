/* TKJ Toolkit — cidr-calculator.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cidr-form");
    const input = document.getElementById("cidr-input");
    const results = document.getElementById("results");
    const resultBody = document.getElementById("result-body");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const raw = input.value.trim();
        const match = raw.match(/^(\d{1,3}(?:\.\d{1,3}){3})\s*\/\s*(\d{1,2})$/);

        if (!match) {
            results.style.display = "none";
            TKJUtils.showError(resultBody, "Invalid CIDR notation. Use the format 192.168.1.10/24.");
            return;
        }

        const r = TKJUtils.calcIPv4(match[1], Number(match[2]));
        if (!r) {
            results.style.display = "none";
            TKJUtils.showError(resultBody, "Invalid CIDR notation. Octets must be 0-255 and prefix must be /0 to /32.");
            return;
        }

        results.style.display = "";
        TKJUtils.renderResultGrid(resultBody, [
            { label: "IP Address", value: r.ip },
            { label: "CIDR Prefix", value: "/" + r.cidr },
            { label: "Network", value: r.network },
            { label: "Broadcast", value: r.broadcast },
            { label: "Subnet Mask", value: r.mask },
            { label: "Wildcard", value: r.wildcard },
            { label: "Host Range", value: r.firstHost + " - " + r.lastHost },
            { label: "Total Hosts", value: TKJUtils.formatNumber(r.total) }
        ]);
    });

    document.getElementById("reset-btn").addEventListener("click", function () {
        input.value = "192.168.1.10/24";
        results.style.display = "none";
        TKJUtils.clearChildren(resultBody);
        input.focus();
    });
});
