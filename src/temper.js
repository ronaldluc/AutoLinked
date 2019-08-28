// ==UserScript==
// @name             AutoLinked v2
// @description      One-click add matched LinkedIn "Recommended for you" people in the My Network page
// @namespace        ronald.luc
// @author           Ronald Luc
// @license          None for now
// @include          https://www.linkedin.com/*
// @version          0.2
// @match            https://www.linkedin.com/*
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/main.js
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/utilities.js
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/logic.js
// @require          deepmerge

// @noframes
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

window.clearTimeout = window.clearTimeout.bind(window);
window.clearInterval = window.clearInterval.bind(window);
window.setTimeout = window.setTimeout.bind(window);
window.setInterval = window.setInterval.bind(window);

console.log("Base script loaded");
