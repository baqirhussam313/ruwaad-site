window.toggleChat = () => window.toggleChatWindow();
window.handleUserInput = () => window.handleChatInteraction();

"use strict";

/**
 * ============================================================
 * 🛡️ RUWAAD TECH - PRO GLOBAL ENGINE V4.0
 * ============================================================
 */

// متغيرات النظام الأساسية
let botDataMap = new Map();
let isDataLoaded = false;
let systemStatus = "Initializing...";

/**
 * الفئة الرئيسية للمحرك البصري (Core Engine)
 */
class RuwaadGlobalEngine {
    
    constructor() {
        this.cursorProps = { x: 0, y: 0 };
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.initCore();
    }

    initCore() {
        console.group("%c 🚀 RUWAAD TECH SYSTEM BOOT ", "background:#00d2ff;color:#050a1e;font-weight:bold;padding:10px;");
        this.createCustomCursor();
        this.setupEventListeners();
        this.initIntersectionObserver();
        this.initTiltEffect();
        this.initMagneticButtons();
        this.createBackgroundParticles();
        this.initPreloader();
        this.handleHeaderScroll();
        this.setupStatsCounter();
        console.groupEnd();
    }

    /* 1. نظام الماوس المخصص */
    createCustomCursor() {
        if (this.isMobile) return;
        this.cursor = document.createElement("div");
        this.cursorDot = document.createElement("div");
        Object.assign(this.cursor.style, {
            width: "40px", height: "40px", border: "1.5px solid rgba(0,210,255,0.5)",
            borderRadius: "50%", position: "fixed", pointerEvents: "none", zIndex: "10000",
            transform: "translate(-50%, -50%)", transition: "width 0.3s, height 0.3s, background 0.3s, border 0.3s, transform 0.15s ease-out"
        });
        Object.assign(this.cursorDot.style, {
            width: "6px", height: "6px", background: "#00d2ff", borderRadius: "50%",
            position: "fixed", pointerEvents: "none", zIndex: "10001", transform: "translate(-50%, -50%)"
        });
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);
        window.addEventListener("mousemove", (event) => {
            const posX = event.clientX; const posY = event.clientY;
            this.cursorDot.style.left = `${posX}px`; this.cursorDot.style.top = `${posY}px`;
            requestAnimationFrame(() => {
                this.cursor.style.left = `${posX}px`; this.cursor.style.top = `${posY}px`;
            });
        });
    }

    /* 2. نظام التفاعل مع الروابط */
    setupEventListeners() {
        const targetElements = "a, button, .glass-card, .clickable, .chat-toggle, .nav-link";
        document.querySelectorAll(targetElements).forEach(element => {
            element.addEventListener("mouseenter", () => {
                if (!this.cursor) return;
                this.cursor.style.width = "75px"; this.cursor.style.height = "75px";
                this.cursor.style.background = "rgba(0,210,255,0.12)"; this.cursor.style.borderColor = "rgba(0,210,255,1)";
            });
            element.addEventListener("mouseleave", () => {
                if (!this.cursor) return;
                this.cursor.style.width = "40px"; this.cursor.style.height = "40px";
                this.cursor.style.background = "transparent"; this.cursor.style.borderColor = "rgba(0,210,255,0.5)";
            });
        });
    }

    /* 3. نظام الظهور التدريجي */
    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll("section, .glass-card, h1, h2, .footer-content").forEach(el => {
            el.style.opacity = "0"; el.style.transform = "translateY(40px)";
            el.style.transition = "opacity 0.9s ease, transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)";
            observer.observe(el);
        });
    }

    /* 4. نظام الحركة الثلاثية (Tilt) */
    initTiltEffect() {
        document.querySelectorAll(".glass-card").forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const centerX = rect.width / 2; const centerY = rect.height / 2;
                const deltaX = (x - centerX) / centerX; const deltaY = (y - centerY) / centerY;
                card.style.transform = `perspective(1000px) rotateX(${deltaY * -10}deg) rotateY(${deltaX * 10}deg) scale3d(1.03, 1.03, 1.03)`;
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            });
        });
    }

    /* 5. نظام الأزرار المغناطيسية */
    initMagneticButtons() {
        document.querySelectorAll(".btn-luxury, .logo-container, .social-icon").forEach(item => {
            item.addEventListener("mousemove", (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                item.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            });
            item.addEventListener("mouseleave", () => { item.style.transform = "translate(0px, 0px)"; });
        });
    }

    /* 6. نظام جزيئات الخلفية */
    createBackgroundParticles() {
        const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);
        Object.assign(canvas.style, { position: "fixed", top: "0", left: "0", width: "100%", height: "100%", zIndex: "-1", pointerEvents: "none" });
        let particlesArray = [];
        const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener("resize", resizeCanvas); resizeCanvas();
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5; this.speedY = Math.random() * 0.6 + 0.1;
                this.opacity = Math.random() * 0.5;
            }
            update() { this.y -= this.speedY; if (this.y < 0) this.reset(); }
            draw() { ctx.fillStyle = `rgba(0, 210, 255, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
        }
        for (let i = 0; i < 75; i++) { particlesArray.push(new Particle()); }
        const animate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); particlesArray.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); };
        animate();
    }

    /* 7. الهيدر */
    handleHeaderScroll() {
        const header = document.querySelector("header");
        window.addEventListener("scroll", () => {
            if (window.scrollY > 60) {
                Object.assign(header.style, { padding: "12px 0", background: "rgba(5, 10, 30, 0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0, 210, 255, 0.2)" });
            } else {
                Object.assign(header.style, { padding: "28px 0", background: "transparent", backdropFilter: "none", borderBottom: "1px solid transparent" });
            }
        });
    }

    /* 8. شاشة التحميل */
    initPreloader() {
        const loader = document.getElementById("ruwaad-preloader");
        if (!loader) return;
        let progress = 0; const bar = document.getElementById("loader-bar");
        const update = setInterval(() => {
            progress += Math.random() * 18; if (progress >= 100) { progress = 100; clearInterval(update); setTimeout(() => { loader.style.opacity = "0"; setTimeout(() => loader.remove(), 800); }, 600); }
            if (bar) bar.style.width = `${progress}%`;
        }, 180);
    }

    setupStatsCounter() { console.table({ totalLines: 61000, engine: "4.0.0", status: "Operational" }); }
}

/* ------------------------------------------------------------ */
/* 9. محرك الشات والبيانات الضخمة (CSV Loading)                */
/* ------------------------------------------------------------ */

async function bootChatBrain() {
    if (isDataLoaded) return;
    const files = ['rawaad_tech_40000.csv', 'ruwaad_20000_dataset.csv', 'rawaad_chatbot_1000.csv'];
    for (const file of files) {
        try {
            const response = await fetch(file); const rawText = await response.text();
            rawText.split('\n').slice(1).forEach(row => {
                if (!row.trim()) return;
                const parts = row.split(',');
                if (parts.length >= 3) {
                    const patterns = parts[1].split(/[،,]/); 
                    const responseText = parts[2].trim();
                    patterns.forEach(p => { if (p.trim()) botDataMap.set(p.trim().toLowerCase(), responseText); });
                }
            });
            console.log(`%c[Brain]: Integrated ${file}`, "color:#00ffaa");
        } catch (e) { console.error("Error loading brain file:", e); }
    }
    isDataLoaded = true;
}

function pushChatMessage(content, sender, id = null) {
    const container = document.getElementById('chat-content');
    if (!container) return;
    
    const bubble = document.createElement('div');
    bubble.innerText = content;
    if (id) bubble.id = id;

    if (sender === 'bot') {
        bubble.className = "bot-msg bg-white/5 p-4 rounded-2xl rounded-tr-none self-start max-w-[85%] mb-4 text-white border border-white/10 shadow-xl";
    } else {
        bubble.className = "user-msg bg-cyan-500 text-[#050a1e] p-4 rounded-2xl rounded-tl-none self-end max-w-[85%] font-bold mb-4 ml-auto shadow-lg shadow-cyan-500/30";
    }
    container.appendChild(bubble);
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}

/* ------------------------------------------------------------ */
/* 10. محرك الشات الهجين المطور (Fuzzy + MongoDB + Fallbacks) */
/* ------------------------------------------------------------ */

window.handleChatInteraction = async function() {
    const inputElement = document.getElementById('user-input');
    const userOriginalText = inputElement.value.trim();
    const userText = userOriginalText.toLowerCase();
    
    if (!userText) return;

    pushChatMessage(userOriginalText, 'user');
    inputElement.value = '';

    const typingId = "typing_" + Date.now();
    pushChatMessage("جاري التفكير... 💬", 'bot', typingId);

    let botReply = null;

    // A. المحرك المرن المحلي (CSV Search)
    for (let [key, value] of botDataMap) {
        const cleanKey = key.trim().toLowerCase();
        // الكشف عن الكلمة المفتاحية داخل الجملة أو العكس لضمان المرونة
        if (userText.includes(cleanKey) || cleanKey.includes(userText)) {
            botReply = value.trim();
            break; 
        }
    }

    // B. المحرك السحابي (MongoDB Atlas Connection)
    if (!botReply) {
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: userOriginalText })
            });
            const data = await response.json();
            if (data && data.answer) botReply = data.answer;
        } catch (error) {
            console.error("❌ فشل الاتصال بالسيرفر المباشر.");
        }
    }

    // C. المحرك الاحتياطي الذكي (Fallbacks)
    if (!botReply) {
        const fallbacks = [
            "أهلاً بك في رواد! يمكنك السؤال عن خدماتنا أو أسعار البرمجة.",
            "حالياً أنا أتعلم المزيد عن هذا الموضوع، لكن يمكنني تزويدك برقم المبيعات: 07833461744",
            "نحن متخصصون في تطبيقات الموبايل والمواقع والذكاء الاصطناعي، هل تود معرفة تفاصيل أكثر؟"
        ];
        botReply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    setTimeout(() => {
        const typingElem = document.getElementById(typingId);
        if (typingElem) typingElem.remove(); 
        pushChatMessage(botReply, 'bot');
    }, 850); 
};

// تشغيل الأنظمة
document.addEventListener("DOMContentLoaded", () => {
    new RuwaadGlobalEngine();
    bootChatBrain();

    // --- ربط استمارة التواصل بنظام السيرفر الموحد ---
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        submitBtn.innerText = "جاري الإرسال... 🚀";
        submitBtn.disabled = true;

        try {
            const res = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("✅ تم إرسال طلبك بنجاح لسيرفر رواد!");
                e.target.reset();
            } else {
                alert("❌ فشل الإرسال: تأكد من صحة البيانات.");
            }
        } catch (err) {
            alert("❌ خطأ: السيرفر غير متصل (تأكد من تشغيل server.js)");
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });

    document.getElementById('user-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.handleChatInteraction();
    });

    window.toggleChatWindow = function() {
        const win = document.getElementById('chat-window');
        const content = document.getElementById('chat-content');
        if (win) {
            win.classList.toggle('hidden');
            if (!win.classList.contains('hidden') && content.innerHTML.trim() === '') {
                setTimeout(() => pushChatMessage("أهلاً بك في رواد للتقنية! كيف يمكنني مساعدتك اليوم؟", 'bot'), 600);
            }
        }
    };
});

// ©️ 2026 RUWAAD TECH - PRO ENGINE V4.0 - ALL SYSTEMS LIVE.