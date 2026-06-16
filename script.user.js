// ==UserScript==
// @name         בני ברק - אימוג'י
// @namespace    https://github.com/tsoolgee/BNAI-BRAK-IMOGI
// @version      0.0.0
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
        ['עצוב', '😞'],
        ['שמח',  '🙂'],
        ['תודה', '👍'],
        ['כוכב', '⭐'],
        ['לב',   '❤️']
    ];

    const SKIP = new Set(['INPUT','TEXTAREA','SCRIPT','STYLE','NOSCRIPT']);

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function isSpace(ch) {
        // רק רווח אמיתי או אין תו בכלל = מותר להחליף
        return !ch || ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t';
    }

    function processText(node) {
        if (node.nodeType !== Node.TEXT_NODE) return;
        let text = node.nodeValue;
        const original = text;

        for (const [from, to] of map) {
            const regex = new RegExp(escapeRegex(from), 'g');
            let match;
            let result = '';
            let lastIndex = 0;

            while ((match = regex.exec(text)) !== null) {
                const start = match.index;
                const end = start + from.length;

                const charBefore = text[start - 1];
                const charAfter = text[end];

                // להחליף רק אם משני הצדדים יש רווח או אין כלום
                if (isSpace(charBefore) && isSpace(charAfter)) {
                    result += text.slice(lastIndex, start) + to;
                } else {
                    result += text.slice(lastIndex, end);
                }
                lastIndex = end;
            }

            result += text.slice(lastIndex);
            text = result;
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
