/* TKJ Toolkit — ip-calculator.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ip-form");
    const ipInput = document.getElementById("ip-address");
    const cidrSelect = document.getElementById("cidr");
    const results = document.getElementById("results");
    const resultBody = document.getElementById("result-body");

    // Populate CIDR /0 - /32
    for (let i = 0; i <= 32; i++) {
        const opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = "/" + i + "  (" + TKJUtils.cidrToMask(i) + ")";
        if (i === 24) opt.selected = true;
        cidrSelect.appendChild(opt);
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const ip = ipInput.value.trim();
        const cidr = Number(cidrSelect.value);
        const r = TKJUtils.calcIPv4(ip, cidr);

        if (!r) {
            results.style.display = "none";
            TKJUtils.showError(resultBody, "Invalid IPv4 address. Use four octets between 0 and 255, e.g. 192.168.1.10.");
            return;
        }

        results.style.display = "";
        TKJUtils.renderResultGrid(resultBody, [
            { label: "Network Address", value: r.network },
            { label: "Broadcast Address", value: r.broadcast },
            { label: "Subnet Mask", value: r.mask },
            { label: "Wildcard Mask", value: r.wildcard },
            { label: "First Usable Host", value: r.firstHost },
            { label: "Last Usable Host", value: r.lastHost },
            { label: "Usable Hosts", value: TKJUtils.formatNumber(r.usableHosts) },
            { label: "Total Addresses", value: TKJUtils.formatNumber(r.total) }
        ]);
    });

    document.getElementById("reset-btn").addEventListener("click", function () {
        ipInput.value = "192.168.1.10";
        cidrSelect.value = "24";
        results.style.display = "none";
        TKJUtils.clearChildren(resultBody);
        ipInput.focus();
    });
});
