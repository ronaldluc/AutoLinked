// ==UserScript==
// @name         AutoLinked v2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @require      https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/main.js
// @require      https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/utilities.js
////// @require      https://raw.githubusercontent.com/ronaldluc/AutoLinked/master/src/logic.js

// @noframes
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==


console.log("Logic script loaded");

/**
 * Initialize day cycle.
 *
 * Day cycle performs periodically connection sprees.
 *
 * @param settings      Includes all settings
 */
function dayCycle(settings) {
    console.log('DayCycle');
    console.log('Already invited: ', GM_getValue('conn_day', 0));
    console.log(settings);

    initDay(settings);

    GM_setValue('conn_spree_start', GM_getValue('conn_day'));
    GM_setValue('conn_spree_max', getRandomInt(settings['lim_per_spree']));
    connectSpree(settings);

    if (GM_getValue('conn_day', 0) < GM_getValue('conn_day_max', 9999)) {
        setTimeout(() => {
            dayCycle(settings)
        }, getRandomInt(settings['spree_delay']));
    } else {
        saveDay(settings);
    }
}

/**
 * Perform one connection spree.
 *
 * @param settings      Includes all settings
 */
function connectSpree(settings) {
    console.log('ConnectSpree');
    connectToMatch(settings);

    let thisSpree = (GM_getValue('conn_day', 0) - GM_getValue('conn_spree_start', 0));
    if (thisSpree < GM_getValue('conn_spree_max') && !isAlert()) {
        setTimeout(() => {
            connectSpree(settings)
        }, getRandomInt(settings['click_delay']));
    }
}

/**
 * Connect to the first matching user.
 *
 * Connect to one user with descriptions matching RegExp from `settings`.
 *
 * @param settings      Includes all settings
 */
function connectToMatch(settings) {
    console.log('ConnectToMatch');
    const profile_cls = "discover-entity-type-card artdeco-card ember-view";
    const connect_cls = "artdeco-button artdeco-button--2 artdeco-button--full artdeco-button--secondary";
    const cancel_cls = "artdeco-button__icon";

    let texts = GM_getValue('texts', []);
    let conn_spree = GM_getValue('conn_day', 0);

    const {include_patt, exclude_patt} = generateRegexps(settings);
    const important_patt = /occupation( .* )connect/i;

    let profiles = document.getElementsByClassName(profile_cls);
    // DEBUG
    // console.log("Profiles total: ", profile.length);

    for (let profile of profiles) {
        let important = "";
        let str = profile.textContent;
        str = str.replace(/([ \n\t,])+/g, " ");
        try {   // try to extract just the jop description
            important = str.match(important_patt)[1];
        } catch (e) {

        }

        const include = str.match(include_patt);
        const exclude = str.match(exclude_patt);

        const connects = profile.getElementsByClassName(connect_cls);

        if (include != null && exclude == null && connects.length > 0) {    // is it a match?
            console.log(str);
            console.log(include);
            console.log("\tYES");
            connects[0].click();
            ++conn_spree;
            texts.push([important.toString(), include[0], Date.now().toString(),]);
            break;
        }
        window.scrollTo(0, document.body.scrollHeight);  // Load more ppl
    }

    GM_setValue('texts', texts);
    GM_setValue('conn_day', conn_spree);
}

/**
 * Initialize the day (once a day).
 *
 * Check if now is a new day.
 * Export yesterdays connections to a csv.
 * Set up old invitation pruning in the next spree waiting period.
 * Reset day parameters. Set today as the new date.
 *
 * @param settings
 */
function initDay(settings) {
    console.log('initDay');
    console.log(Number(GM_getValue('day', 0)));
    console.log(Number(getTodayDate()));

    if (Number(GM_getValue('day', 0)) !== Number(getTodayDate())) {
        console.log('Initialized the day');
        saveDay(settings);
        setTimeout(() => {
            pruneInvitations(settings, () => {
                gotoElementByText('My Network', 0, 'span')
            });
        }, Math.floor(settings['spree_delay'][0] / 2));

        GM_setValue('conn_day', 0);
        GM_setValue('conn_day_max', getRandomInt(settings['lim_per_day']));
        GM_setValue('texts', []);
        GM_setValue('day', Number(getTodayDate()));
    }

    console.log("conn_day: ", GM_getValue('conn_day'));
    console.log("conn_today", GM_getValue('conn_today'));
    console.log("conn_day_max: ", GM_getValue('conn_day_max'));
    console.log("==========================================================================");
}

function saveDay(settings = null) {
    console.log("saveDay");
    let texts = GM_getValue('texts', []);

    if (texts.length > 0) {
        console.log("\nExporting today:");
        let twoDArrStr = arrayToCSV(texts);
        downloadString(twoDArrStr, "csv", dateToString(GM_getValue('day', 0)) + '_AutoLinked_' + texts.length + '.csv');
    }
}

function isAlert() {
    const alert_cls = "artdeco-modal__header ip-fuse-limit-alert__header ember-view";
    const got_it_cls = "artdeco-button ip-fuse-limit-alert__primary-action artdeco-button--2 artdeco-button--primary ember-view";

    let alerts = document.getElementsByClassName(alert_cls);
    if (alerts.length > 0) {
        console.log("Found alerts: ");
        let got_its = document.getElementsByClassName(got_it_cls);
        console.log(got_its);
        console.log(got_its[0]);
        try {
            setTimeout(() => {
                got_its[0].click()
            }, 2000);
        } catch (e) {
            console.log(e)
        }
        return true;
    }
    return false;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Invitation pruning
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function pruneInvitations(settings, callback = null) {
    const tasks = [
        ['My Network', 'span'],
        ['See all', 'span'],
        ['Sent', 'a'],
        ['Next', 'a'],
        ['Next', 'a'],
        ['Next', 'a'],
        ['Next', 'a'],
        ['Next', 'a'],
        ['Next', 'a'],
        ['Next', 'a'],
        ['Next', 'a'],
    ];

    let delay = 0;
    for (let task of tasks) {
        gotoElementByText(task[0], delay, task[1]);
        delay += 1500;
    }

    setTimeout(() => {
        pruneOld(settings);
    }, delay);

    if (callback) {
        setTimeout(callback, delay + 6000);
    }
}

function pruneOld(settings) {
    console.log("PruneOld");
    const inv_card_cls = "invitation-card--selectable";
    const time_cls = "time-ago";

    const withdraw_cls = "invitation-card__action-btn";

    let inv_cards = document.getElementsByClassName(inv_card_cls);
    for (let card of inv_cards) {
        const old_patt = new RegExp(settings['prune']['old_patt'], 'i');
        let time = card.getElementsByClassName(time_cls)[0].innerHTML;
        const res = time.match(old_patt);
        console.log(res);

        if (res != null) {
            card.getElementsByClassName(withdraw_cls)[0].click();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END OF REFACTORED CODE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function iterJobs(texts = [], counter = 0) {
    // var btn_cls = "search-result__info pt3 pb4 ph0";
    var btn_cls = "search-result__wrapper";
    var social_cls = "search-result__social-proof ember-view";
    var profiles = document.getElementsByClassName(btn_cls);

    for (let profile of profiles) {
        // console.log(profile.textContent);
        var str = profile.textContent;
        var social_str = "";
        try {
            social_str = profile.getElementsByClassName(social_cls)[0].textContent.replace(/( |\n|\t)+/g, " ");
        } catch (err) {

        }

        str = str.replace(/( |\n|\t)+/g, " ");
        // var patt = /machine[a-z ]*learning.*at/i;
        console.log(str);
        const body_patt = /2nd.*machine/i;
        const name_patt = /([^,.\- ]+) [^,.\- ]+(,.+)? 2nd degree connection 2nd/i;
        const company_patt = /machine[a-z ]*learning .* at (\w+)/i;
        const research_patt = /research/i;
        const social_patt = /([^,.\- ]+ [^,.\- ]+)/i;

        const body_text = str.match(body_patt);
        const name = str.match(name_patt);
        const company = str.match(company_patt);
        const research = str.match(research_patt);
        const social_connection = social_str.match(social_patt);
        // console.log(result);
        // console.log(result[1] + " | " + result[0]);
        console.log(profile);
        console.log(name);

        const connect_cls = "search-result__action-button search-result__actions--primary artdeco-button artdeco-button--default artdeco-button--2 artdeco-button--secondary";
        const connect_btns = profile.getElementsByClassName(connect_cls);
        const add_note_cls = "artdeco-button artdeco-button--secondary artdeco-button--3 mr1";
        const send_inv_cls = "artdeco-button artdeco-button--3 ml1";
        const custom_id = "custom-message";

        if (connect_btns.length < 1) {
            continue;
        }
        console.log(customMsg(name, company, research, social_connection));
        // continue; //TODO: remove
        let connect_btn = connect_btns[0];
        // console.log(connect_btn);
        console.log(connect_btn.textContent);

        if (connect_btn.textContent.includes("Connect")) {
            connect_btn.click();
            let add_notes = document.getElementsByClassName(add_note_cls);
            for (let add_note of add_notes) {
                if (add_note.textContent.includes("Add a note")) {
                    add_note.click();
                    let custom_msg = document.getElementById(custom_id);
                    custom_msg.value = customMsg(name, company, research, social_connection);
                    console.log("Send:\n" + custom_msg.value);
                    texts.push([str, custom_msg.value]);
                    counter++;
                    break;
                }
            }
            let send_invs = document.getElementsByClassName(send_inv_cls);
            for (let send_inv of send_invs) {
                if (send_inv.textContent.includes("Send invitation")) {
                    send_inv.click();
                }
            }
        }
        // console.log(body_text);
    }
    const next_cls = "artdeco-pagination__button artdeco-pagination__button--next artdeco-button artdeco-button--muted artdeco-button--icon-right artdeco-button--1 artdeco-button--tertiary ember-view"
    let next = document.getElementsByClassName(next_cls);
    // return; //TODO: remove
    const save_every = 200;
    if (counter > save_every || profiles.length < 3) {
        counter -= save_every;
        // console.log(texts);
        let twoDArrStr = arrayToCSV(texts);
        downloadString(twoDArrStr, "csv", "linked_in_job_titles.csv");
    }

    console.log("Invited " + texts.length + " | counter " + counter);
    next[0].click();
    setTimeout(() => {
        iterJobs(texts, counter)
    }, 4200);
}

function customMsg(name, company, research, social_connection) {
    // console.log("\n\nPrint customMsg inputs:");
    // for (let p of [name, company, research, social_connection]) {
    //     console.log(p);
    // }
    if (name == null) {
        return "Hi.";
    }
    name = capitalize(name[1]);
    if (research !== null && research.length > 0) {
        return "Hi " + name + ",\n" +
            "\n" +
            "it's nice to connect to other ML experts and as I was scrolling through LinkedIn, I saw you do some research in this field. \n" +
            "Could you please tell me more about your research?\n" +
            "\n" +
            "Thanks, Ronald";
    }
    if (social_connection == null) {
        return "Hi " + name + ",\n" +
            "\n" +
            "it's nice to connect to other ML experts.\n" +
            "\n" +
            "Ronald";
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
            "it's nice to connect to other ML experts and I saw you are connected to " + social_connection + " already.\n" +
            "\n" +
            "Best, Ronald";
    }

    // Engineer with company name
    var send = "Hi " + name + ",\n" +
        "\n" +
        "I was scrolling through LinkedIn and saw you are connected to " + social_connection + " already.\n";

    if (Math.random() >= 0.5) {
        // "Could you please tell me, what is ML like at " + company_name + "?\n" +
        send += "It's nice to connect to other ML experts + I would like to ask you, what is ML like at " + company_name + ".\n";
    } else {
        send += "It's nice to connect to other ML experts + Could you please tell me more about ML at " + company_name + "?\n";
    }
    return send +
        "\n" +
        "Thanks, Ronald";

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLICK ON PROFILE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function clickOnProfile(skip = 0) {
    var url = location.pathname.split('/');
    //TODO: Check if the page is really loaded
    if (url[1] === 'search' && url[2] === 'results') {
        console.log("Processed " + name_links + " with skip === " + skip);
        var mx = 5;
        var btn_cls = "name actor-name";
        var name_links = document.getElementsByClassName(btn_cls);
        processName(name_links[skip], skip + 1);
    } else {
        console.log("Waiting to get to search/results");
        setTimeout(() => {
            clickOnProfile(skip)
        }, 500);
    }
}

function processName(name_link, skip) {
    name_link.click();
    console.log("Processed " + name_link);
    // processProfile();
    setTimeout(() => {
        processProfile(skip)
    }, 1000);
    return 1;
}

function processProfile(skip) {
    var text_cls = "pv-entity__secondary-title";
    // var texts = document.getElementsByClassName(text_cls);
    if (document.getElementsByClassName(text_cls).length === 0) {
        setTimeout(() => {
            processProfile(skip)
        }, 500);
    } else {
        setTimeout(() => {
            var texts = document.getElementsByClassName(text_cls);
            console.log("texts!");
            // console.log(texts);
            for (let text of texts) {
                // console.log(text.innerText);
                console.log(text.outerText);
            }
            setTimeout(() => {
                goBack(skip)
            }, 500);
        }, 2000)
    }
}

function goBack(skip) {
    window.history.back();
    console.log("Going back!");
    setTimeout(() => {
        clickOnProfile(skip)
    }, 3000);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END CLICK ON PROFILE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function clickThroughProfiles() {


    var button_cls = "message-anywhere-button artdeco-button artdeco-button--secondary";
    if (document.getElementsByClassName(button_cls).length > 10) {
        var x = document.getElementsByClassName(button_cls);
        for (let i = 0; i < 10; i++) {
            x[i].click();
            var close_cls = "msg-overlay-bubble-header__control js-msg-close artdeco-button artdeco-button--circle artdeco-button--inverse artdeco-button--1 artdeco-button--tertiary ember-view";
            var close_btn = document.getElementsByClassName(close_cls);
            for (let j = 0; j < close_btn.length; j++) {
                setTimeout(function () {
                    close_btn[j].click()
                }, 2000);
            }
            // var companies = document.getElementsByClassName("pv-entity__secondary-title")
        }
    } else {
        x = document.getElementsByClassName(button_cls);
        for (let i = 0; i < x.length; i++) {
            x[i].click();
        }
    }
}