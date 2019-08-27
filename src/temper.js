// ==UserScript==
// @name         AutoLinked v2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @require      https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/main.js
// @require      https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/utilities.js
// @require      https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/logic.js

// @noframes //this makes sure we don't create extra buttons inside iframes, ads, etc
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

window.clearTimeout = window.clearTimeout.bind(window);
window.clearInterval = window.clearInterval.bind(window);
window.setTimeout = window.setTimeout.bind(window);
window.setInterval = window.setInterval.bind(window);

console.log("Loaded");
console.log(GM_getValue('foo', 'def'));
console.log(GM_getValue('bar', 'def'));

(function() {
    'use strict';
    GM_setValue('foo', {'date': 'DD.MM.YY', 'count': 14});
    main();
})();