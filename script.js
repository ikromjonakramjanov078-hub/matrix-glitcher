
"use strict";

// ==========================================
// MATRIX GLITCHER
// Muallif: AKRAMJONOVA JADRA MARATOVNA
// ==========================================

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const screenGlitch = document.getElementById("screenGlitch");
const screenFlash = document.getElementById("screenFlash");
const glitchBars = document.getElementById("glitchBars");
const corruptTexts = document.getElementById("corruptTexts");

let width = 0;
let height = 0;
let dpr = 1;
let fontSize = 16;
let columns = 0;
let drops = [];

let lastGlitch = 0;
let lastFlash = 0;
let lastShake = 0;
let lastText = 0;

let nextGlitchTimer = null;
let nextTextTimer = null;

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

// Yashil kodlar, raqamlar va g‘alati belgilar.
const symbols =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
    "ハヒフヘホマミムメモヤユヨラリルレロワヲン" +
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "#$%&<>/\\{}[]+=-_*@!?01";

const strangeMessages = [
    "01001000 01000101 01001100 01010000",
    "0x0000FF // 0x7F3A // 0xFFFF",
    "SYSTEM_FAILURE_0x0000",
    "KERNEL_PANIC : UNKNOWN_EXCEPTION",
    "MEMORY_FRAGMENT_CORRUPTED",
    "ACCESS_DENIED_████████",
    "ERR0R_ERR0R_ERR0R_010101",
    "NULL_POINTER_EXCEPTION_0x00",
    "C:\\SYSTEM\\UNKNOWN_PROCESS",
    "WARNING !!! 0x0000007F",
    "0̷1̸0̷1̴0̸0̷1̴0̷1̸",
    "SIGNAL_LOST // SIGNAL_LOST",
    "### 0xDEAD 0xBEEF 0x0000 ###",
    "UNEXPECTED_BEHAVIOR_0101",
    "FATAL_EXCEPTION // UNKNOWN",
    "MEMORY_ACCESS_VIOLATION",
    "0x7F 0xFF 0x00 0xFE 0x01",
    "SYSTEM_THREAD_EXCEPTION",
    "///// CORRUPTED_DATA /////",
    "▓▒░▓▒░ 01001010 ░▒▓░▒▓",
    "UNDEFINED_STATE_0xFFFF",
    "ERROR://UNKNOWN_PROCESS",
    "0b1101011010010110",
    "!!! SYSTEM MALFUNCTION !!!",
    "KERNEL_0x0000_FFFF_ERR",
    "#### NULL NULL NULL ####",
    "01010101_11110000_00001111",
    "SYSTEM///FAILURE///UNKNOWN",
    "<!> CORRUPTED_SIGNAL <!>",
    "0x00000000 0xFFFFFFFF",
    "RUNTIME_EXCEPTION_0x13",
    "▒▓█ ERROR 010101 █▓▒",
    "DATA_STREAM_INTERRUPTED",
    "UNKNOWN_SOURCE // 0x7E",
    "FATAL_ERROR_0101010101",
    "PROCESS_TERMINATED_0x00",
    "0xDEAD0000 // 0x0000DEAD",
    "### SYSTEM FAILURE ###",
    "SIGNAL_0XFF_UNKNOWN_SIGNAL",
    "01010110 01000101 01010010"
];

// ==========================================
// 1. EKRANNI TAYYORLASH
// ==========================================

function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontSize = Math.max(
        12,
        Math.min(21, width / 85)
    );

    columns = Math.ceil(width / fontSize);

    drops = Array.from(
        { length: columns },
        () => Math.random() * (height / fontSize)
    );

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
}

// ==========================================
// 2. MATRIX KODLAR YOMG‘IRI
// ==========================================

function drawMatrix(timestamp = 0) {
    // Avvalgi kadrni asta-sekin qoraytirish.
    // Bu kodlarning orqasida iz qoldiradi.
    ctx.fillStyle = "rgba(0, 0, 0, 0.105)";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px Consolas, monospace`;
    ctx.textBaseline = "top";

    for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const char =
            symbols[Math.floor(Math.random() * symbols.length)];

        const isBright = Math.random() > 0.955;

        if (isBright) {
            ctx.fillStyle = "#e6ffec";
            ctx.shadowColor = "#00ff41";
            ctx.shadowBlur = 12;
        } else {
            const alpha = 0.35 + Math.random() * 0.65;

            ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.shadowColor = "#00ff41";
            ctx.shadowBlur = Math.random() > 0.91 ? 8 : 0;
        }

        ctx.fillText(char, x, y);

        // Oqim ba'zi joylarda tezlashib, ba'zida sekinlashadi.
        drops[i] += 0.35 + Math.random() * 1.4;

        // Kodlar pastga yetgach, ustun qayta boshlanadi.
        if (
            y > height &&
            Math.random() > 0.955
        ) {
            drops[i] = Math.random() * -25;
        }
    }

    ctx.shadowBlur = 0;

    if (!reducedMotion) {
        animateEffects(timestamp);
    }

    requestAnimationFrame(drawMatrix);
}

// ==========================================
// 3. EKRAN BUZILISH EFFEKTLARI
// ==========================================

function animateEffects(timestamp) {
    // Vaqti-vaqti bilan kuchli glitch.
    if (
        timestamp - lastGlitch > 420 &&
        Math.random() > 0.80
    ) {
        triggerGlitch();
        lastGlitch = timestamp;
    }

    // Kutilmagan yashil chaqnash.
    if (
        timestamp - lastFlash > 1000 &&
        Math.random() > 0.9
    ) {
        triggerFlash();
        lastFlash = timestamp;
    }

    // Ekranning keskin silkinishi.
    if (
        timestamp - lastShake > 1700 &&
        Math.random() > 0.93
    ) {
        triggerShake();
        lastShake = timestamp;
    }

    // Buzilgan yozuvlar oqimi.
    if (
        timestamp - lastText > 280 &&
        Math.random() > 0.52
    ) {
        spawnCorruptText();
        lastText = timestamp;
    }
}

function triggerGlitch() {
    screenGlitch.classList.remove("active");

    // CSS animatsiyasini qayta boshlash.
    void screenGlitch.offsetWidth;

    screenGlitch.classList.add("active");

    setTimeout(() => {
        screenGlitch.classList.remove("active");
    }, 250);

    // Bir vaqtda bir nechta buzilish chizig‘i.
    const amount = 1 + Math.floor(Math.random() * 5);

    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            spawnGlitchBar();
        }, Math.random() * 120);
    }
}

function triggerFlash() {
    screenFlash.classList.remove("active");
    void screenFlash.offsetWidth;
    screenFlash.classList.add("active");

    setTimeout(() => {
        screenFlash.classList.remove("active");
    }, 180);
}

function triggerShake() {
    document.body.classList.remove("screen-shake");
    void document.body.offsetWidth;
    document.body.classList.add("screen-shake");

    setTimeout(() => {
        document.body.classList.remove("screen-shake");
    }, 300);
}

// ==========================================
// 4. GORIZONTAL GLITCH CHIZIQLARI
// ==========================================

function spawnGlitchBar() {
    const bar = document.createElement("div");

    bar.className = "glitch-bar";

    bar.style.top = Math.random() * 100 + "%";

    bar.style.height =
        (1 + Math.random() * 10) + "px";

    const light = Math.random() > 0.75;

    bar.style.background = light
        ? "rgba(210, 255, 220, 0.8)"
        : "rgba(0, 255, 65, 0.85)";

    bar.style.boxShadow =
        "0 0 14px rgba(0, 255, 65, 0.75)";

    glitchBars.appendChild(bar);

    requestAnimationFrame(() => {
        bar.classList.add("active");
    });

    setTimeout(() => {
        bar.remove();
    }, 300);
}

// ==========================================
// 5. G‘ALATI YOZUVLAR
// ==========================================

function spawnCorruptText() {
    // Brauzerni ortiqcha elementlar bilan to‘ldirmaslik.
    if (corruptTexts.children.length > 20) {
        corruptTexts.firstElementChild?.remove();
    }

    const text = document.createElement("div");

    text.className = "corrupt-text";

    const message =
        strangeMessages[
            Math.floor(Math.random() * strangeMessages.length)
        ];

    // textContent HTML kodini bajarishga yo‘l qo‘ymaydi.
    text.textContent = distortMessage(message);

    // Yozuvlar ekranning turli joylarida paydo bo‘ladi.
    const maxX = Math.max(0, width - 280);
    const maxY = Math.max(0, height - 130);

    text.style.left = Math.random() * maxX + "px";
    text.style.top = Math.random() * maxY + "px";

    if (Math.random() > 0.72) {
        text.classList.add("bright");
    }

    if (Math.random() > 0.8) {
        text.classList.add("large");
    }

    // Ayrim satrlar qiyshayib ko‘rinadi.
    text.style.transform =
        `rotate(${(Math.random() - 0.5) * 5}deg)`;

    corruptTexts.appendChild(text);

    setTimeout(() => {
        text.remove();
    }, 1250);
}

// Ba'zi belgilarni buzilgan belgilar bilan almashtirish.
function distortMessage(message) {
    const brokenSymbols = [
        "▓", "▒", "░", "█", "╳", "※", "Ж", "Ф", "∆"
    ];

    return message
        .split("")
        .map((char) => {
            if (
                char !== " " &&
                Math.random() > 0.86
            ) {
                return brokenSymbols[
                    Math.floor(Math.random() * brokenSymbols.length)
                ];
            }

            return char;
        })
        .join("");
}

// ==========================================
// 6. UZLUKSIZ TASODIFIY EFFEKT TAYMERLARI
// ==========================================

function scheduleExtraEffects() {
    const delay = 160 + Math.random() * 750;

    nextGlitchTimer = setTimeout(() => {
        if (!document.hidden && !reducedMotion) {
            const roll = Math.random();

            if (roll > 0.25) {
                triggerGlitch();
            }

            if (roll > 0.75) {
                triggerFlash();
            }

            if (roll > 0.87) {
                triggerShake();
            }

            if (roll > 0.18) {
                spawnCorruptText();
            }
        }

        scheduleExtraEffects();
    }, delay);
}

function scheduleRandomText() {
    const delay = 180 + Math.random() * 650;

    nextTextTimer = setTimeout(() => {
        if (!document.hidden) {
            spawnCorruptText();

            if (Math.random() > 0.65) {
                spawnCorruptText();
            }
        }

        scheduleRandomText();
    }, delay);
}

// ==========================================
// 7. BRAUZER HOLATINI BOSHQARISH
// ==========================================

window.addEventListener("resize", resizeCanvas);

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        // Qayta kirilganda tezda yangi belgilar chiqarish.
        lastText = 0;
        lastGlitch = 0;
    }
});

// ==========================================
// 8. DASTURNI ISHGA TUSHIRISH
// ==========================================

resizeCanvas();

// Asosiy kodlar birinchi ochilishdayoq boshlanadi.
requestAnimationFrame(drawMatrix);

// Qolgan effektlar ham avtomatik ishlaydi.
if (!reducedMotion) {
    scheduleExtraEffects();
    scheduleRandomText();
}

// Dastur tayyor: tugmalar yoki menyu kerak emas.
