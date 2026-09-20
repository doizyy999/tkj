/* TKJ Toolkit — tools-data.js
   Central registry of all tools. Used for search, cards,
   categories, homepage and related tools. */
"use strict";

const TKJ_TOOLS = [
    { slug: "ip-calculator", name: "IP Address Calculator", description: "Calculate IPv4 network, broadcast and host information.", category: "Networking", icon: "fa-solid fa-network-wired", keywords: ["ip", "ipv4", "network", "cidr", "broadcast", "mask", "host"] },
    { slug: "subnet-calculator", name: "Subnet Calculator", description: "Calculate subnet mask, hosts and address ranges.", category: "Networking", icon: "fa-solid fa-diagram-project", keywords: ["subnet", "mask", "network", "hosts", "wildcard", "vlan"] },
    { slug: "cidr-calculator", name: "CIDR Calculator", description: "Parse CIDR notation into full network details.", category: "Networking", icon: "fa-solid fa-calculator", keywords: ["cidr", "notation", "ip", "range", "prefix"] },
    { slug: "mac-generator", name: "MAC Address Generator", description: "Generate random MAC addresses in multiple formats.", category: "Networking", icon: "fa-solid fa-microchip", keywords: ["mac", "address", "hardware", "random", "nic"] },
    { slug: "password-generator", name: "Password Generator", description: "Generate strong random passwords with custom rules.", category: "Generators", icon: "fa-solid fa-key", keywords: ["password", "secure", "random", "passphrase", "strength"] },
    { slug: "qr-generator", name: "QR Code Generator", description: "Create scannable QR codes and download them as PNG.", category: "Generators", icon: "fa-solid fa-qrcode", keywords: ["qr", "code", "barcode", "scan", "url"] },
    { slug: "base64", name: "Base64 Encoder / Decoder", description: "Encode and decode Base64 with full UTF-8 support.", category: "Developer", icon: "fa-solid fa-file-code", keywords: ["base64", "encode", "decode", "utf8", "binary"] },
    { slug: "url-encoder", name: "URL Encoder / Decoder", description: "Percent-encode and decode URL components safely.", category: "Developer", icon: "fa-solid fa-link", keywords: ["url", "uri", "encode", "decode", "percent"] },
    { slug: "json-formatter", name: "JSON Formatter", description: "Format, minify and validate JSON data.", category: "Developer", icon: "fa-solid fa-code", keywords: ["json", "format", "minify", "validate", "pretty"] },
    { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode JSON Web Token headers and payloads.", category: "Developer", icon: "fa-solid fa-fingerprint", keywords: ["jwt", "token", "decode", "auth", "bearer"] },
    { slug: "hash-generator", name: "Hash Generator", description: "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes.", category: "Developer", icon: "fa-solid fa-hashtag", keywords: ["hash", "sha", "sha256", "checksum", "digest", "crypto"] },
    { slug: "color-converter", name: "Color Converter", description: "Convert colors between HEX, RGB and HSL.", category: "Utilities", icon: "fa-solid fa-palette", keywords: ["color", "hex", "rgb", "hsl", "css"] },
    { slug: "unit-converter", name: "Unit Converter", description: "Convert length, weight, temperature, data and more.", category: "Utilities", icon: "fa-solid fa-arrows-rotate", keywords: ["unit", "convert", "length", "weight", "temperature", "data"] },
    { slug: "http-headers", name: "HTTP Header Checker", description: "Inspect HTTP response headers of a URL.", category: "Networking", icon: "fa-solid fa-server", keywords: ["http", "headers", "response", "server", "status"] },
    { slug: "dns-lookup", name: "DNS Lookup", description: "Query DNS records using DNS-over-HTTPS.", category: "Networking", icon: "fa-solid fa-globe", keywords: ["dns", "lookup", "records", "domain", "mx", "txt", "ns"] },
    { slug: "ping", name: "HTTP Connectivity Check", description: "Check HTTP connectivity and measure response time.", category: "Networking", icon: "fa-solid fa-satellite-dish", keywords: ["ping", "connectivity", "latency", "http", "status"] },
    { slug: "port-checker", name: "Port Checker", description: "Understand port checking and browser limitations.", category: "Networking", icon: "fa-solid fa-plug", keywords: ["port", "tcp", "check", "open", "scan"] },
    { slug: "user-agent", name: "User-Agent Detector", description: "Detect your browser, OS and device information.", category: "Utilities", icon: "fa-solid fa-user-astronaut", keywords: ["user", "agent", "browser", "device", "os", "detect"] }
];

const TKJ_CATEGORIES = [
    { name: "Networking", icon: "fa-solid fa-network-wired", description: "IP, subnet, DNS and connectivity tools." },
    { name: "Developer", icon: "fa-solid fa-code", description: "Encoders, formatters and debugging utilities." },
    { name: "Generators", icon: "fa-solid fa-wand-magic-sparkles", description: "Passwords, QR codes and secure random values." },
    { name: "Utilities", icon: "fa-solid fa-toolbox", description: "Everyday converters and detectors." }
];

const TKJTools = {
    all() { return TKJ_TOOLS.slice(); },

    byCategory(category) {
        return TKJ_TOOLS.filter(t => t.category === category);
    },

    find(slug) {
        return TKJ_TOOLS.find(t => t.slug === slug) || null;
    },

    search(query) {
        const q = String(query || "").trim().toLowerCase();
        if (!q) return [];
        return TKJ_TOOLS.filter(t => {
            return t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.keywords.some(k => k.includes(q));
        });
    },

    related(slug, count) {
        const tool = this.find(slug);
        if (!tool) return [];
        const same = TKJ_TOOLS.filter(t => t.slug !== slug && t.category === tool.category);
        const others = TKJ_TOOLS.filter(t => t.slug !== slug && t.category !== tool.category);
        return same.concat(others).slice(0, count || 3);
    },

    cardHTML(tool, pathPrefix) {
        const prefix = pathPrefix || "";
        const href = prefix + tool.slug + ".html";
        return '<a class="tool-card-link" href="' + href + '">' +
            '<span class="tool-card-icon"><i class="' + tool.icon + '" aria-hidden="true"></i></span>' +
            '<h3>' + tool.name + '</h3>' +
            '<p>' + tool.description + '</p>' +
            '<span class="tool-card-meta"><span>' + tool.category + '</span>' +
            '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span></a>';
    }
};
