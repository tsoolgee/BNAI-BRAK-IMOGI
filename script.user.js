// ==UserScript==
// @name         בני ברק - אימוג'י חכם
// @namespace    https://github.com/tsoolgee/BNAI-BRAK-IMOGI
// @version      2.0.0
// @description  המרת טקסט לאימוג'ים באתר bnebrak.com
// @author       You
// @match        https://bnebrak.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/tsoolgee/BNAI-BRAK-IMOGI/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/tsoolgee/BNAI-BRAK-IMOGI/main/script.user.js
// ==/UserScript==

(function () {
    'use strict';

    const map = [
        ['חחחח', '😂'],
        ['חחח',  '😄'],
        ['חח',   '😊'],
        ['קריצה','😉'],
        [':עצוב','😞'],
        [':שמח', '🙂'],
        [':תודה','👍'],
        ['כוכב', '⭐'],
        [':לב',  '❤️']
    ];

    const SKIP = new Set(['INPUT','TEXTAREA','SCRIPT','STYLE','NOSCRIPT']);

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function processText(node) {
        if (node.nodeType !== Node.TEXT_NODE) return;

        let text = node.nodeValue;
        const original = text;

        for (const [from, to] of map) {
            if (text.includes(from)) {
                text = text.replace(new RegExp(escapeRegex(from), 'g'), to);
            }
        }

        if (text !== original) {
            node.nodeValue = text;
        }
    }

    function walk(node) {
        if (!node) return;
        if (node.nodeType === 1) {
            if (SKIP.has(node.tagName) || node.isContentEditable) return;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            processText(node);
            return;
        }
        for (let child = node.firstChild; child; child = child.nextSibling) {
            walk(child);
        }
    }

    // ריצה ראשונית
    walk(document.body);

    // האזנה לתוכן חדש (צ'אטים, הודעות)
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                walk(node);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
