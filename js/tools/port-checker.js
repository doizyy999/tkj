/* TKJ Toolkit — port-checker.js
   Browsers cannot open arbitrary TCP sockets, so a static site cannot
   truly test ports. This tool validates input and explains the real
   limitation instead of faking results. */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const host = document.getElementById("port-host");
    const port = document.getElementById("port-number");
    const form = document.getElementById("port-form");
    const infoArea = document.getElementById("port-info");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        TKJUtils.clearChildren(infoArea);
        const h = host.value.trim();
        const p = Number(port.value);

        const hostOk = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(h) || TKJUtils.isValidIPv4(h);
        if (!hostOk) {
            TKJUtils.showError(infoArea, "Invalid host. Use a domain (example.com) or IPv4 address.");
            return;
        }
        if (!Number.isInteger(p) || p < 1 || p > 65535) {
            TKJUtils.showError(infoArea, "Invalid port. Use a number between 1 and 65535.");
            return;
        }

        const notice = document.createElement("div");
        notice.className = "notice notice-warning";
        notice.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>' +
            "<div><strong>Port checking requires a server-side TCP connection check.</strong><br>" +
            "Web browsers are not allowed to open raw TCP connections to arbitrary hosts and ports, " +
            "so a static website like this one cannot test whether a port is open — and we will not fake a result. " +
            "To check a port from your own machine, run: <code>nc -zv " +
            h.replace(/</g, "&lt;") + " " + p + "</code> (Linux/macOS) or " +
            "<code>Test-NetConnection " + h.replace(/</g, "&lt;") + " -Port " + p + "</code> (Windows PowerShell).</div>";
        infoArea.appendChild(notice);
    });
});
