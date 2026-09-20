/* TKJ Toolkit — ping.js
   HTTP connectivity check (browsers cannot perform ICMP ping). */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("ping-target");
    const checkBtn = document.getElementById("check-btn");
    const results = document.getElementById("results");
    const resultBody = document.getElementById("result-body");
    const errorArea = document.getElementById("ping-error");

    checkBtn.addEventListener("click", async function () {
        let url = input.value.trim();
        TKJUtils.clearChildren(errorArea);
        results.style.display = "none";
        TKJUtils.clearChildren(resultBody);

        if (!url) {
            TKJUtils.showError(errorArea, "Enter a target URL or host first.");
            return;
        }
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        try { new URL(url); } catch (e) {
            TKJUtils.showError(errorArea, "Invalid target. Example: https://example.com");
            return;
        }

        checkBtn.disabled = true;
        checkBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Checking...';

        const start = performance.now();
        try {
            const controller = new AbortController();
            const timeout = setTimeout(function () { controller.abort(); }, 10000);
            // no-cors: we can't read the status, but a resolved promise = host reachable over HTTP(S)
            await fetch(url, { mode: "no-cors", cache: "no-store", signal: controller.signal });
            clearTimeout(timeout);
            const ms = Math.round(performance.now() - start);

            results.style.display = "";
            TKJUtils.renderResultGrid(resultBody, [
                { label: "Target", value: url },
                { label: "HTTP Status", value: "Reachable (opaque response)" },
                { label: "Response Time", value: ms + " ms" }
            ]);
            const note = document.createElement("p");
            note.className = "hint";
            note.textContent = "The exact status code is hidden by the browser in no-cors mode; a resolved request confirms the host accepted an HTTP(S) connection.";
            resultBody.appendChild(note);
        } catch (err) {
            const ms = Math.round(performance.now() - start);
            results.style.display = "";
            TKJUtils.renderResultGrid(resultBody, [
                { label: "Target", value: url },
                { label: "HTTP Status", value: err.name === "AbortError" ? "Timeout" : "Unreachable / blocked" },
                { label: "Response Time", value: ms + " ms" }
            ]);
        } finally {
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fa-solid fa-satellite-dish" aria-hidden="true"></i> Check';
        }
    });
});
