// ==UserScript==
// @name         בני ברק - אימוג'י חכם PRO
// @namespace    https://github.com/tsoolgee/BNAI-BRAK-IMOGI
// @version      1.0.0
// @description  המרה חכמה של טקסט לאימוג'ים + תמיכה בדפים דינמיים
// @author       You
// @match        https://bnebrak.com/*
// @grant        none

// 🔄 עדכון אוטומטי
// @downloadURL  https://raw.githubusercontent.com/tsoolgee/BNAI-BRAK-IMOGI/main/script.user.js
// @updateURL    https://raw.githubusercontent.com/tsoolgee/BNAI-BRAK-IMOGI/main/script.user.js
// ==/UserScript==

(function () {
    'use strict';

    const map = [
        ['חחחח', '😂'],
        ['חחח', '😄'],
        ['חח', '😊'],
        ['אני ישן', '😴'],
    ];

    const processed = new WeakSet();

    function escape(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function replaceText(node) {
        if (!node || node.nodeType !== Node.TEXT_NODE) return;
        if (processed.has(node)) return;

        let text = node.nodeValue;
        let changed = false;

        for (const [from, to] of map) {
            if (text.includes(from)) {
                text = text.replace(new RegExp(escape(from), 'g'), to);
                changed = true;
            }
        }

        if (changed) node.nodeValue = text;

        processed.add(node);
    }

    function walk(node) {
        if (!node) return;

        if (node.nodeType === 1) {
            const tag = node.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || node.isContentEditable) return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            replaceText(node);
            return;
        }

        let child = node.firstChild;
        while (child) {
            walk(child);
            child = child.nextSibling;
        }
    }

    // ריצה ראשונית
    walk(document.body);

    // observer חכם (רק תוספות חדשות)
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                walk(n);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
