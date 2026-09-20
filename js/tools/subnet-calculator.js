/* TKJ Toolkit — subnet-calculator.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("subnet-form");
    const netInput = document.getElementById("network");
    const cidrSelect = document.getElementById("cidr");
    const results = document.getElementById("results");
    const resultBody = document.getElementById("result-body");

    for (let i = 0; i <= 32; i++) {
        const opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = "/" + i + "  (" + TKJUtils.cidrToMask(i) + ")";
        if (i === 26) opt.selected = true;
        cidrSelect.appendChild(opt);
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const ip = netInput.value.trim();
        const cidr = Number(cidrSelect.value);
        const r = TKJUtils.calcIPv4(ip, cidr);

        if (!r) {
            results.style.display = "none";
            TKJUtils.showError(resultBody, "Invalid network address. Use a valid IPv4 address, e.g. 192.168.1.0.");
            return;
        }

        results.style.display = "";
        TKJUtils.renderResultGrid(resultBody, [
            { label: "Network", value: r.network },
            { label: "Broadcast", value: r.broadcast },
            { label: "Subnet Mask", value: r.mask },
            { label: "Wildcard Mask", value: r.wildcard },
            { label: "Total Addresses", value: TKJUtils.formatNumber(r.total) },
            { label: "Usable Hosts", value: TKJUtils.formatNumber(r.usableHosts) },
            { label: "First Host", value: r.firstHost },
            { label: "Last Host", value: r.lastHost }
        ]);

        if (r.network !== ip) {
            const note = document.createElement("p");
            note.className = "hint";
            note.textContent = "Note: " + ip + " is a host address. The subnet base is " + r.network + "/" + cidr + ".";
            resultBody.appendChild(note);
        }
    });

    document.getElementById("reset-btn").addEventListener("click", function () {
        netInput.value = "192.168.1.0";
        cidrSelect.value = "26";
        results.style.display = "none";
        TKJUtils.clearChildren(resultBody);
        netInput.focus();
    });
});
