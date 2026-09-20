/* TKJ Toolkit — unit-converter.js */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const categorySel = document.getElementById("uc-category");
    const fromSel = document.getElementById("uc-from");
    const toSel = document.getElementById("uc-to");
    const valueInput = document.getElementById("uc-value");
    const resultOut = document.getElementById("uc-result");

    // factor = value in base unit; temperature uses custom functions
    const DATA = {
        length: { base: "m", label: "Length", units: {
            mm: { name: "Millimeters (mm)", f: 0.001 }, cm: { name: "Centimeters (cm)", f: 0.01 },
            m: { name: "Meters (m)", f: 1 }, km: { name: "Kilometers (km)", f: 1000 },
            "in": { name: "Inches (in)", f: 0.0254 }, ft: { name: "Feet (ft)", f: 0.3048 },
            yd: { name: "Yards (yd)", f: 0.9144 }, mi: { name: "Miles (mi)", f: 1609.344 } } },
        weight: { base: "kg", label: "Weight", units: {
            mg: { name: "Milligrams (mg)", f: 0.000001 }, g: { name: "Grams (g)", f: 0.001 },
            kg: { name: "Kilograms (kg)", f: 1 }, t: { name: "Metric Tons (t)", f: 1000 },
            oz: { name: "Ounces (oz)", f: 0.028349523125 }, lb: { name: "Pounds (lb)", f: 0.45359237 } } },
        temperature: { label: "Temperature", units: {
            c: { name: "Celsius (°C)" }, f: { name: "Fahrenheit (°F)" }, k: { name: "Kelvin (K)" } } },
        data: { base: "B", label: "Data", units: {
            bit: { name: "Bits", f: 0.125 }, B: { name: "Bytes (B)", f: 1 },
            KB: { name: "Kilobytes (KB)", f: 1024 }, MB: { name: "Megabytes (MB)", f: 1048576 },
            GB: { name: "Gigabytes (GB)", f: 1073741824 }, TB: { name: "Terabytes (TB)", f: 1099511627776 } } },
        time: { base: "s", label: "Time", units: {
            ms: { name: "Milliseconds (ms)", f: 0.001 }, s: { name: "Seconds (s)", f: 1 },
            min: { name: "Minutes (min)", f: 60 }, h: { name: "Hours (h)", f: 3600 },
            d: { name: "Days (d)", f: 86400 }, wk: { name: "Weeks (wk)", f: 604800 } } },
        speed: { base: "mps", label: "Speed", units: {
            mps: { name: "Meters/second (m/s)", f: 1 }, kmh: { name: "Kilometers/hour (km/h)", f: 1 / 3.6 },
            mph: { name: "Miles/hour (mph)", f: 0.44704 }, kn: { name: "Knots (kn)", f: 0.514444 } } },
        area: { base: "m2", label: "Area", units: {
            cm2: { name: "Square cm (cm²)", f: 0.0001 }, m2: { name: "Square meters (m²)", f: 1 },
            ha: { name: "Hectares (ha)", f: 10000 }, km2: { name: "Square km (km²)", f: 1000000 },
            ft2: { name: "Square feet (ft²)", f: 0.09290304 }, ac: { name: "Acres (ac)", f: 4046.8564224 } } },
        volume: { base: "L", label: "Volume", units: {
            ml: { name: "Milliliters (mL)", f: 0.001 }, L: { name: "Liters (L)", f: 1 },
            m3: { name: "Cubic meters (m³)", f: 1000 },
            gal: { name: "US Gallons (gal)", f: 3.785411784 }, cup: { name: "US Cups", f: 0.2365882365 } } }
    };

    function toCelsius(v, unit) {
        if (unit === "c") return v;
        if (unit === "f") return (v - 32) * 5 / 9;
        return v - 273.15;
    }
    function fromCelsius(v, unit) {
        if (unit === "c") return v;
        if (unit === "f") return v * 9 / 5 + 32;
        return v + 273.15;
    }

    function fillUnits() {
        const cat = DATA[categorySel.value];
        [fromSel, toSel].forEach(function (sel) {
            sel.innerHTML = "";
            Object.keys(cat.units).forEach(function (key) {
                const opt = document.createElement("option");
                opt.value = key;
                opt.textContent = cat.units[key].name;
                sel.appendChild(opt);
            });
        });
        toSel.selectedIndex = Math.min(1, toSel.options.length - 1);
        convert();
    }

    function convert() {
        const cat = DATA[categorySel.value];
        const v = parseFloat(valueInput.value);
        if (isNaN(v)) { resultOut.textContent = "—"; return; }
        let result;
        if (categorySel.value === "temperature") {
            result = fromCelsius(toCelsius(v, fromSel.value), toSel.value);
        } else {
            result = v * cat.units[fromSel.value].f / cat.units[toSel.value].f;
        }
        const rounded = Math.abs(result) >= 1000 || result === 0
            ? result.toLocaleString("en-US", { maximumFractionDigits: 4 })
            : Number(result.toPrecision(8)).toString();
        resultOut.textContent = rounded;
    }

    categorySel.addEventListener("change", fillUnits);
    [fromSel, toSel].forEach(function (s) { s.addEventListener("change", convert); });
    valueInput.addEventListener("input", convert);
    document.getElementById("swap-btn").addEventListener("click", function () {
        const a = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = a;
        convert();
    });
    document.getElementById("copy-btn").addEventListener("click", function () {
        if (resultOut.textContent !== "—") copyToClipboard(resultOut.textContent);
    });

    fillUnits();
});
