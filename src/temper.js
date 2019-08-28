// ==UserScript==
// @name             AutoLinked v2
// @description      One-click add matched LinkedIn "Recommended for you" people in the My Network page
// @namespace        ronald.luc
// @author           Ronald Luc
// @license          None for now
// @include          https://www.linkedin.com/*
// @version          0.4
// @match            https://www.linkedin.com/*
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/main.js
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/utilities.js
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/logic.js

// @noframes
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

console.log("Base script loaded");

// Feel free to overwrite `settings` with your own settings by starting from the `default_settings` above
// Make sure to override whole key:value pairs (the whole values of the "top-level" keys get replaced
settings_off = {
    // 'click_delay': [2001, 5003],        // [from, to] range of delay between clicks in ms
    // 'lim_per_spree': [30, 36],          // [from, to] range of  max people invited per spree
    // 'spree_delay': [60 * 60 * 1000, 2 * 60 * 60 * 1000],    // [from, to] range of delay between click sprees in ms
    // 'lim_per_day': [250, 300],          // [from, to] range of max people invited per day
    'includes_patts': {                 // RegExps of peoples bio, to be connected to (keys are for clarity and ignored)
        // "perspective": "python|C\\+\\+",
        "colleagues": "R&D|deep|machine learning| ML | NLP | CV |artificial| AI |data scientist|speech recog|computer vision|language processing", // innovat| BI |intelligence|data  -- too vague
        // "research": "scientist|space", // science|professor|research
        // "executive": "founder| C.{1,2}O |lead|owner|principal|partner|investor|angel|entrepreneur", // head of
        "ml_leaders": "at google|nvidia|deepmind|openai",
    },
    'exclude_patts': {                  // RegExps of peoples bio, to be always excluded from connecting to (keys are for clarity and ignored)
        "technologies": "electro|web|mobile|java|script|PHP|frontend|front-end|design| QA | UI | UX ",
        "HR": "headhunt|talent|trainer|sourcing|people| HR |recruit",
        "other": "ARTIN",
    },
    // 'pruning': {
    //     'old_patt': '\\d+ (week|month|year)',   // RegExp invitations to be withdrawn (proceeds once per day)
    // },
};