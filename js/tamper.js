// ==UserScript==
// @name             AutoLinkedLocal
// @description      One-click add matched LinkedIn "Recommended for you" people in the My Network page
// @namespace        ronald.luc
// @author           Ronald Luc
// @license          None for now
// @include          https://www.linkedin.com/*
// @version          2.0
// @match            https://www.linkedin.com/*
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/development/js/main.js
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/development/js/utilities.js
// @require          https://raw.githubusercontent.com/ronaldluc/AutoLinked/development/js/logic.js

// @noframes
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

console.log("Base script loaded");

// Feel free to overwrite `settings` with your own settings by starting from the `default_settings` above
// Make sure to override whole key:value pairs (the whole values of the "top-level" keys get replaced
settings = {
    // 'click_delay': [2001, 5003],        // [from, to] range of delay between clicks in ms
    // 'lim_per_spree': [30, 36],          // [from, to] range of  max people invited per spree
    // 'spree_delay': [60 * 60 * 1000, 2 * 60 * 60 * 1000],    // [from, to] range of delay between click sprees in ms
    // 'lim_per_day': [250, 300],          // [from, to] range of max people invited per day
    'include_patts': {                 // RegExps of peoples bio, to be connected to (keys are for clarity and ignored)
        // "perspective": "python|C\\+\\+",
        "colleagues": "IT|R&D|deep|machine learning| ML | NLP | CV |artificial| AI |data scientist|speech recog|computer vision|language processing", // innovat| BI |intelligence|data  -- too vague
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

    // Hard Workflow Custom message ------------------------------------------------------------------------------------------
    customMsg: function(name, company, research, social_connection) {
        if (name == null) {
            return "Hi.";
        }
        name = capitalize(name[1]);
        if (research !== null && research.length > 0) {
            return "Hi " + name + ",\n" +
                "\n" +
                "it's nice to connect to other IT experts and as I was scrolling through LinkedIn, I saw you do some research in this field. \n" +
                "Could you please tell me more about your research?\n" +
                "\n" +
                "Thanks, Peter";
        }
        if (social_connection == null) {
            return "Hi " + name + ",\n" +
                "\n" +
                "it's nice to connect to other IT experts.\n" +
                "\n" +
                "Peter";
        }
        social_connection = capitalize(social_connection[1]);
        var company_name = "";
        if (company != null) {
            company_name = capitalize(company[1]);
        }
        var exclude_patt = /free|self|deutch|austri|ww/i;
        var exclude = company_name.match(exclude_patt);
        console.log("Company name: " + company_name + " length " + company_name.length);
    
        // Engineer No company name
        if (exclude !== null || company_name.length < 3) {
            return "Hi " + name + ",\n" +
                "\n" +
                "it's nice to connect to other IT experts and I saw you are connected to " + social_connection + " already.\n" +
                "\n" +
                "Best, Peter";
        }
    
        // Engineer with company name
        var send = "Hi " + name + ",\n" +
            "\n" +
            "I was scrolling through LinkedIn and saw you are connected to " + social_connection + " already.\n";
        if (Math.random() >= 0.5) {
            // "Could you please tell me, what is ML like at " + company_name + "?\n" +
            send += "It's nice to connect to other IT experts + I would like to ask you, what is IT infrastructure like at " + company_name + ".\n";
        } else {
            send += "It's nice to connect to other IT experts + Could you please tell me more about IT at " + company_name + "?\n";
        }
        return send +
            "\n" +
            "Thanks, Peter";
    
    }
};
