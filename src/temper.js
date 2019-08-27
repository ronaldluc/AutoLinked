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

// @noframes
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

window.clearTimeout = window.clearTimeout.bind(window);
window.clearInterval = window.clearInterval.bind(window);
window.setTimeout = window.setTimeout.bind(window);
window.setInterval = window.setInterval.bind(window);

console.log("Base script loaded");

(function() {
    'use strict';
    main();
})();