// ==UserScript==
// @name         בני ברק - מחליף מילים לאימוג'י (עם רווחים)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  מחליף מילים מבודדות בלבד לאימוג'ים באתר bnebrak.com
// @author       You
// @match        https://bnebrak.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // מילון ההחלפות
    const replacements = [
        { search: '😂', replace: '😂' },
        { search: '😄', replace: '😄' },
        { search: '😊', replace: '😊' },
        { search: '😴', replace: '😴' },
        { search: 'קריצה', replace: '😉' },
        { search: '😞', replace: '😞' },
        { search: '🙂', replace: '🙂' },
        { search: '👍', replace: '👍' },
        { search: '⭐', replace: '⭐' },
        { search: '❤', replace: '❤' }
    ];

    // פונקציה שמבצעת את ההחלפה בצומת טקסט
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            let changed = false;

            for (const item of replacements) {
                // יצירת מנגנון שמחפש את המילה רק אם היא מוקפת ברווחים, סימני פיסוק, או תחילת/סוף שורה
                // (?<=^|[\s.,?!;:]) פירושו: לפני המילה יש תחילת שורה, רווח או סימן פיסוק
                // (?=$|[\s.,?!;:]) פירושו: אחרי המילה יש סוף שורה, רווח או סימן פיסוק
                const regex = new RegExp(`(?<=^|[\\s.,?!;:])${item.search}(?=$|[\\s.,?!;:])`, 'g');
                
                if (regex.test(text)) {
                    text = text.replace(regex, item.replace);
                    changed = true;
                }
            }

            if (changed) {
                node.nodeValue = text;
            }
        } else {
            // דילוג על תיבות טקסט ואלמנטים לעריכה
            if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.isContentEditable) {
                return;
            }
            for (let i = 0; i < node.childNodes.length; i++) {
                replaceText(node.childNodes[i]);
            }
        }
    }

    // הרצה ראשונית
    replaceText(document.body);

    // האזנה לשינויים דינמיים בעמוד
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                replaceText(node);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
