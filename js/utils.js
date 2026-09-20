/* TKJ Toolkit — utils.js
   Shared helpers: IPv4 math, formatting, DOM result builders. */
"use strict";

const TKJUtils = {

    /* ---------- IPv4 helpers ---------- */

    isValidIPv4(ip) {
        if (typeof ip !== "string") return false;
        const parts = ip.trim().split(".");
        if (parts.length !== 4) return false;
        return parts.every(function (p) {
            if (!/^\d{1,3}$/.test(p)) return false;
            if (p.length > 1 && p.charAt(0) === "0") return false;
            const n = Number(p);
            return n >= 0 && n <= 255;
        });
    },

    ipv4ToInt(ip) {
        return ip.trim().split(".").reduce(function (acc, octet) {
            return ((acc << 8) >>> 0) + Number(octet);
        }, 0) >>> 0;
    },

    intToIPv4(int) {
        return [
            (int >>> 24) & 255,
            (int >>> 16) & 255,
            (int >>> 8) & 255,
            int & 255
        ].join(".");
    },

    isValidCIDR(cidr) {
        const n = Number(cidr);
        return Number.isInteger(n) && n >= 0 && n <= 32;
    },

    cidrToMaskInt(cidr) {
        if (cidr === 0) return 0;
        return (0xFFFFFFFF << (32 - cidr)) >>> 0;
    },

    cidrToMask(cidr) {
        return this.intToIPv4(this.cidrToMaskInt(cidr));
    },

    cidrToWildcard(cidr) {
        return this.intToIPv4((~this.cidrToMaskInt(cidr)) >>> 0);
    },

    /* Full IPv4 calculation for ip/cidr. Returns null on invalid input. */
    calcIPv4(ip, cidr) {
        if (!this.isValidIPv4(ip) || !this.isValidCIDR(cidr)) return null;
        const ipInt = this.ipv4ToInt(ip);
        const maskInt = this.cidrToMaskInt(cidr);
        const networkInt = (ipInt & maskInt) >>> 0;
        const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;
        const total = Math.pow(2, 32 - cidr);

        let usable, firstHost, lastHost;
        if (cidr === 32) {
            usable = 1;
            firstHost = this.intToIPv4(networkInt);
            lastHost = this.intToIPv4(networkInt);
        } else if (cidr === 31) {
            usable = 2; // point-to-point link (RFC 3021)
            firstHost = this.intToIPv4(networkInt);
            lastHost = this.intToIPv4(broadcastInt);
        } else {
            usable = total - 2;
            firstHost = this.intToIPv4((networkInt + 1) >>> 0);
            lastHost = this.intToIPv4((broadcastInt - 1) >>> 0);
        }

        return {
            ip: ip.trim(),
            cidr: cidr,
            network: this.intToIPv4(networkInt),
            broadcast: this.intToIPv4(broadcastInt),
            mask: this.cidrToMask(cidr),
            wildcard: this.cidrToWildcard(cidr),
            firstHost: firstHost,
            lastHost: lastHost,
            usableHosts: usable,
            total: total
        };
    },

    /* ---------- Formatting ---------- */

    formatNumber(n) {
        return Number(n).toLocaleString("en-US");
    },

    debounce(fn, wait) {
        let timer = null;
        return function () {
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () { fn.apply(null, args); }, wait || 200);
        };
    },

    /* ---------- DOM helpers ---------- */

    showError(container, message) {
        container.innerHTML = "";
        const box = document.createElement("div");
        box.className = "error-box";
        box.setAttribute("role", "alert");
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-circle-exclamation";
        icon.setAttribute("aria-hidden", "true");
        const text = document.createElement("span");
        text.textContent = message;
        box.appendChild(icon);
        box.appendChild(text);
        container.appendChild(box);
    },

    clearChildren(el) {
        while (el.firstChild) el.removeChild(el.firstChild);
    },

    /* Build a result card: label + mono value + copy button */
    resultCard(label, value, wide) {
        const card = document.createElement("div");
        card.className = "result-card" + (wide ? " result-wide" : "");

        const left = document.createElement("div");
        const lab = document.createElement("span");
        lab.className = "result-label";
        lab.textContent = label;
        const val = document.createElement("span");
        val.className = "result-value";
        val.textContent = value;
        left.appendChild(lab);
        left.appendChild(val);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.setAttribute("aria-label", "Copy " + label);
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-copy";
        icon.setAttribute("aria-hidden", "true");
        btn.appendChild(icon);
        btn.addEventListener("click", function () { copyToClipboard(value); });

        card.appendChild(left);
        card.appendChild(btn);
        return card;
    },

    renderResultGrid(container, entries) {
        this.clearChildren(container);
        const grid = document.createElement("div");
        grid.className = "result-grid";
        const self = this;
        entries.forEach(function (e) {
            grid.appendChild(self.resultCard(e.label, e.value, e.wide));
        });
        container.appendChild(grid);
    },

    /* Cryptographically strong random byte (0-255) */
    randomByte() {
        if (window.crypto && typeof window.crypto.getRandomValues === "function") {
            const buf = new Uint8Array(1);
            window.crypto.getRandomValues(buf);
            return buf[0];
        }
        return Math.floor(Math.random() * 256);
    }
};
