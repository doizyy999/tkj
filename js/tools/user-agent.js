/* TKJ Toolkit — user-agent.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const ua = navigator.userAgent || "";
    document.getElementById("ua-string").textContent = ua || "Unavailable";

    function detectBrowser(s) {
        if (/edg\//i.test(s)) return "Microsoft Edge";
        if (/opr\/|opera/i.test(s)) return "Opera";
        if (/chrome\//i.test(s) && !/chromium/i.test(s)) return "Google Chrome";
        if (/chromium/i.test(s)) return "Chromium";
        if (/firefox\//i.test(s)) return "Mozilla Firefox";
        if (/safari\//i.test(s) && /version\//i.test(s)) return "Safari";
        return "Unknown browser";
    }

    function detectOS(s) {
        if (/windows nt 10/i.test(s)) return "Windows 10 / 11";
        if (/windows nt/i.test(s)) return "Windows";
        if (/android/i.test(s)) return "Android";
        if (/iphone|ipad|ipod/i.test(s)) return "iOS";
        if (/mac os x/i.test(s)) return "macOS";
        if (/linux/i.test(s)) return "Linux";
        if (/cros/i.test(s)) return "ChromeOS";
        return "Unknown OS";
    }

    function detectDevice(s) {
        if (/ipad|tablet/i.test(s)) return "Tablet";
        if (/mobi|iphone|android/i.test(s)) return "Mobile";
        return "Desktop";
    }

    const rows = [
        ["Browser", detectBrowser(ua)],
        ["Operating System", detectOS(ua)],
        ["Device", detectDevice(ua)],
        ["Language", navigator.language || "Unknown"],
        ["Platform", (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "Unknown"]
    ];

    const list = document.getElementById("ua-details");
    rows.forEach(function (pair) {
        const row = document.createElement("div");
        row.className = "kv-row";
        const dt = document.createElement("dt");
        dt.textContent = pair[0];
        const dd = document.createElement("dd");
        dd.textContent = pair[1];
        row.appendChild(dt);
        row.appendChild(dd);
        list.appendChild(row);
    });

    document.getElementById("copy-ua-btn").addEventListener("click", function () {
        if (ua) copyToClipboard(ua);
        else TKJToast.error("User-Agent is not available.");
    });
});
