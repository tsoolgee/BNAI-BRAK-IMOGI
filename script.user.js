// ==UserScript==
// @name         בני ברק - אימוג'י חכם PRO FINAL
// @namespace    https://github.com/tsoolgee/BNAI-BRAK-IMOGI
// @version      1.0.2
// @description  המרה חכמה של טקסט לאימוג'ים - יציב, מהיר ותומך בדינמיות
// @author       You
// @match        https://bnebrak.com/*
// @grant        none

// 🔄 עדכון אוטומטי תקין (חובה RAW בלבד)
@downloadURL  https://raw.githubusercontent.com/tsoolgee/BNAI-BRAK-IMOGI/main/script.user.js
@updateURL    https://raw.githubusercontent.com/tsoolgee/BNAI-BRAK-IMOGI/main/script.user.js
// ==/UserScript==

(function () {
    'use strict';

    const map = [
        ['חחחח', '😂'],
        ['חחח', '😄'],
        [':לב', '❤']
    ];

    const SKIP_TAGS = new Set(['INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE']);

    function escape(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function shouldSkip(node) {
        return (
            node.nodeType === 1 &&
            (SKIP_TAGS.has(node.tagName) || node.isContentEditable)
        );
    }

    function processText(node) {
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
            processText(node);
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

    // טיפול בדינמיקה (צ'אטים / הודעות)
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
