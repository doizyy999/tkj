/* TKJ Toolkit — http-headers.js
   Honest implementation: browsers expose almost no response headers
   cross-origin due to CORS, so this tool explains the limitation and
   shows only what fetch() can legitimately read. */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("header-url");
    const checkBtn = document.getElementById("check-btn");
    const results = document.getElementById("results");
    const resultBody = document.getElementById("result-body");
    const noticeArea = document.getElementById("header-notice");

    const INTERESTING = ["content-type", "server", "cache-control",
        "content-security-policy", "x-frame-options", "strict-transport-security"];

    checkBtn.addEventListener("click", async function () {
        let url = input.value.trim();
        TKJUtils.clearChildren(resultBody);
        TKJUtils.clearChildren(noticeArea);
        results.style.display = "none";

        if (!url) {
            TKJUtils.showError(noticeArea, "Enter a URL first.");
            return;
        }
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        try { new URL(url); } catch (e) {
            TKJUtils.showError(noticeArea, "Invalid URL. Example: https://example.com");
            return;
        }

        checkBtn.disabled = true;
        checkBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Checking...';

        try {
            const controller = new AbortController();
            const timeout = setTimeout(function () { controller.abort(); }, 10000);
            const resp = await fetch(url, { method: "GET", mode: "cors", signal: controller.signal, redirect: "follow" });
            clearTimeout(timeout);

            const entries = [{ label: "Status Code", value: resp.status + " " + resp.statusText }];
            INTERESTING.forEach(function (name) {
                const v = resp.headers.get(name);
                if (v) entries.push({ label: name, value: v, wide: v.length > 40 });
            });

            results.style.display = "";
            if (entries.length === 1) {
                TKJUtils.renderResultGrid(resultBody, entries);
                const p = document.createElement("p");
                p.className = "hint";
                p.textContent = "The server did not expose additional headers to browsers (CORS). Full header inspection requires a server-side proxy or a compatible API.";
                resultBody.appendChild(p);
            } else {
                TKJUtils.renderResultGrid(resultBody, entries);
            }
        } catch (err) {
            TKJUtils.showError(noticeArea,
                "Unable to read headers. The target server likely blocks cross-origin browser requests (CORS). " +
                "HTTP header inspection requires a server-side proxy or compatible API for most websites.");
        } finally {
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Check Headers';
        }
    });
});
