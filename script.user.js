// ==UserScript==
// @name         בני ברק - אימוג'י
// @namespace    https://github.com/tsoolgee/BNAI-BRAK-IMOGI
// @version      0.0.2
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
            // המילה חייבת להיות מוקפת ברווח, סימן פיסוק, או תחילת/סוף שורה
            const regex = new RegExp(
                '(^|[\\s.,!?;:\'"()\\[\\]])'
                + escapeRegex(from)
                + '(?=[\\s.,!?;:\'"()\\[\\]]|$)',
                'g'
            );
            text = text.replace(regex, (match, prefix) => prefix + to);
        }
        if (text !== original) node.nodeValue = text;
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

    walk(document.body);

    new MutationObserver((mutations) => {
        for (const m of mutations)
            for (const node of m.addedNodes)
                walk(node);
    }).observe(document.body, { childList: true, subtree: true });

})();
