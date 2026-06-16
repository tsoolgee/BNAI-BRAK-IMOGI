// ==UserScript==
// @name         בני ברק - אימוג'י חכם PRO FINAL
// @namespace    https://github.com/tsoolgee/BNAI-BRAK-IMOGI
// @version      1.2.1
// @description  המרה חכמה של טקסט לאימוג'ים
// @author       You
// @match        https://bnebrak.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const map = [
        ['חחחח', '😂'],
        ['חחח', '😄'],
        ['חח', '😊'],
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

    walk(document.body);

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
