// ==UserScript==
// @name         בני ברק - אימוג'י חכם PRO MAX
// @namespace    https://github.com/tsoolgee/BNAI-BRAK-IMOGI
// @version      1.1.0
// @description  המרת טקסט לאימוג'ים בצורה יציבה ומהירה לדפים דינמיים
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
        ['קריצה', '😉'],
        [':עצוב', '😞'],
        [':שמח', '🙂'],
        [':תודה', '👍'],
        ['כוכב', '⭐'],
        [':לב', '❤']
    ];

    const SKIP_TAGS = new Set(['INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE']);

    function escape(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function shouldSkip(node) {
        if (node.nodeType !== 1) return false;
        return SKIP_TAGS.has(node.tagName) || node.isContentEditable;
    }

    function processTextNode(node) {
        if (!node || node.nodeType !== Node.TEXT_NODE) return;

        let text = node.nodeValue;
        let original = text;

        for (const [from, to] of map) {
            if (text.includes(from)) {
                text = text.replace(new RegExp(escape(from), 'g'), to);
            }
        }

        if (text !== original) {
            node.nodeValue = text;
        }
    }

    function walk(node) {
        if (!node || shouldSkip(node)) return;

        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
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

    // MutationObserver עם debounce קטן למניעת עומס
    let timeout;
    const observer = new MutationObserver((mutations) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            for (const m of mutations) {
                for (const n of m.addedNodes) {
                    walk(n);
                }
            }
        }, 50);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
