/* TKJ Toolkit — dns-lookup.js
   Uses the public Cloudflare DNS-over-HTTPS API (no keys, client-side safe). */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("dns-domain");
    const typeSel = document.getElementById("dns-type");
    const lookupBtn = document.getElementById("lookup-btn");
    const results = document.getElementById("results");
    const resultBody = document.getElementById("result-body");
    const errorArea = document.getElementById("dns-error");

    const TYPE_NAMES = { 1: "A", 28: "AAAA", 5: "CNAME", 15: "MX", 16: "TXT", 2: "NS" };

    function isValidDomain(d) {
        return /^(?=.{1,253}$)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*\.?[a-zA-Z]{2,}$/.test(d);
    }

    lookupBtn.addEventListener("click", async function () {
        const domain = input.value.trim().toLowerCase();
        const type = typeSel.value;
        TKJUtils.clearChildren(errorArea);
        results.style.display = "none";
        TKJUtils.clearChildren(resultBody);

        if (!isValidDomain(domain)) {
            TKJUtils.showError(errorArea, "Invalid domain. Example: example.com");
            return;
        }

        lookupBtn.disabled = true;
        lookupBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Checking...';

        try {
            const controller = new AbortController();
            const timeout = setTimeout(function () { controller.abort(); }, 10000);
            const resp = await fetch(
                "https://cloudflare-dns.com/dns-query?name=" + encodeURIComponent(domain) + "&type=" + encodeURIComponent(type),
                { headers: { "Accept": "application/dns-json" }, signal: controller.signal }
            );
            clearTimeout(timeout);
            if (!resp.ok) throw new Error("API error");
            const data = await resp.json();

            results.style.display = "";
            const answers = data.Answer || [];
            if (answers.length === 0) {
                TKJUtils.showError(resultBody, "No " + type + " records found for " + domain + ".");
                return;
            }

            const wrap = document.createElement("div");
            wrap.className = "table-wrap";
            const table = document.createElement("table");
            const thead = document.createElement("thead");
            thead.innerHTML = "<tr><th>Record</th><th>Type</th><th>Value</th><th>TTL</th></tr>";
            table.appendChild(thead);
            const tbody = document.createElement("tbody");
            answers.forEach(function (a) {
                const tr = document.createElement("tr");
                [a.name, TYPE_NAMES[a.type] || String(a.type), a.data, String(a.TTL)].forEach(function (v, i) {
                    const td = document.createElement("td");
                    if (i === 2 || i === 0) td.className = "mono";
                    td.textContent = v;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            wrap.appendChild(table);
            resultBody.appendChild(wrap);

            const src = document.createElement("p");
            src.className = "hint";
            src.textContent = "Resolved via Cloudflare DNS-over-HTTPS (cloudflare-dns.com).";
            resultBody.appendChild(src);
        } catch (err) {
            TKJUtils.showError(errorArea,
                err.name === "AbortError"
                    ? "Request timed out. The DNS API did not respond in time."
                    : "DNS lookup failed. The public DNS-over-HTTPS API may be unavailable, or your network blocks it.");
        } finally {
            lookupBtn.disabled = false;
            lookupBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Lookup';
        }
    });
});
