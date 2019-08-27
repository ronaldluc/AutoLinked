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

/////////////////////////////capitalize("bleh");///////////////////////////////////////////////////////////////////////////////////////
// END CLICK ON PROFILE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clickThroughProfiles() {

    let btn = document.getElementById('connectBtn');
    btn.style.background = 'purple';
    btn.style.color = 'white';
    // flashes color on click
    setTimeout(function () {
        btn.style.background = 'white';
        btn.style.color = 'blue';
    }, 300);

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

function connectFilteredProfiles(texts = [], res = {"connect": 0, "cancel": 0,}, wait_until = 0) {
    // SHOW CHANGE ON THE BUTTON
    // let btn = document.getElementById('connectBtn');
    // btn.style.background = 'gray';
    // btn.style.color = 'white';
    // // flashes color on click
    // setTimeout(function() {
    //     btn.style.background = 'white';
    //     btn.style.color = 'blue';
    // }, 300);

    var timeout = getRandomInt(2410, 3720);
    try {
        // var timeout = getRandomInt(3010, 4224);

        var profile_cls = "discover-person-card artdeco-card ember-view";
        var connect_cls = "js-discover-person-card__action-btn full-width artdeco-button artdeco-button--2";
        var cancel_cls = "artdeco-button__icon";
        var alert_cls = "artdeco-modal__header ip-fuse-limit-alert__header ember-view";
        var got_it_cls = "artdeco-button ip-fuse-limit-alert__primary-action artdeco-button--2 artdeco-button--primary ember-view";

        // Check if limit got passed
        let alerts = document.getElementsByClassName(alert_cls);
        console.log("Alerts: ");
        // console.log(alerts);
        if (alerts.length > 0) {
            timeout += getRandomInt(3 * 61 * 60 * 1000, 3 * 63 * 60 * 1000);
            wait_until = Date.now() + getRandomInt(16 * 60 * 1000, 21 * 60 * 1000);
            // timeout += getRandomInt(16*1000, 21*1000); // TESTING
            console.log("Error => extra waiting!");
            let got_its = document.getElementsByClassName(got_it_cls);
            console.log(got_its);
            console.log(got_its[0]);
            try {
                setTimeout(() => {
                    got_its[0].click()
                }, 2000);
                const rows = texts;
                var twoDArrStr = arrayToCSV(rows);
                downloadString(twoDArrStr, "csv", "mynetwork.csv");
            } catch (e) {
                console.log(e)
            }
        }

        var includes_patts = {
            // "perspective": "python|C\\+\\+",
            "colleagues": "R&D|deep|machine learning| ML | NLP | CV |artificial| AI |data scientist|speech recog|computer vision|language processing", // innovat| BI |intelligence|data
            // "research": "scientist|space", // science|professor|research
            // "executive": "founder| C.{1,2}O |lead|owner|principal|partner|investor|angel|entrepreneur", // head of
            "ml_leaders": "at google|nvidia|deepmind|openai",
        };
        var exclude_patts = {
            "technologies": "elektro|web|mobile|java|script|PHP|frontend|front-end|design| QA | UI | UX ",
            "HR": "headhunt|talent|trainer|sourcing|people| HR |recruit",
            "other": "ARTIN",
        };
        var include_str = "";
        for (let [key, value] of Object.entries(includes_patts)) {
            include_str += value + "|";
        }
        var exclude_str = "";
        for (let [key, value] of Object.entries(exclude_patts)) {
            exclude_str += value + "|";
        }

        var include_patt = new RegExp(include_str.slice(0, -1), "i");
        var exclude_patt = new RegExp(exclude_str.slice(0, -1), "i");
        var important_patt = /occupation( .* )connect/i;

        let profiles = document.getElementsByClassName(profile_cls);

        // Connect all GOOD
        if (Date.now() > wait_until) {
            console.log("Connect all GOOD. Now " + Date.now() + " | wait_until " + wait_until);
            for (let profile of profiles) {
                var str = profile.textContent;
                str = str.replace(/([ \n\t,])+/g, " ");
                try {
                    str = str.match(important_patt)[1];
                } catch (e) {

                }
                // continue;
                // console.log(str);

                var include = str.match(include_patt);
                var exclude = str.match(exclude_patt);

                var connects = profile.getElementsByClassName(connect_cls);

                if (include != null && exclude == null && connects.length > 0 && Date.now() > wait_until) {
                    console.log(str);
                    console.log(include);
                    console.log("\tYES");
                    connects[0].click();
                    res.connect++;
                    texts.push([str.toString(), "1", Date.now().toString()]);
                    window.scrollTo(0, document.body.scrollHeight);
                    break;
                }
                window.scrollTo(0, document.body.scrollHeight);
            }
            wait_until = Date.now() + getRandomInt(12 * 1000, 18 * 1000);
        } else if (false) {
            console.log("Cancel all BAD. Now " + Date.now() + " | wait_until " + wait_until);
            // Cancel one bad
            for (let profile of profiles) {
                var str = profile.textContent;
                str = str.replace(/( |\n|\t)+/g, " ");
                try {
                    str = str.match(important_patt)[1];
                } catch (e) {

                }
                // continue;
                // console.log(str);

                var include = str.match(include_patt);
                var exclude = str.match(exclude_patt);

                var connects = profile.getElementsByClassName(connect_cls);
                var cancels = profile.getElementsByClassName(cancel_cls);

                if (include != null && exclude == null && connects.length > 0) {
                    // console.log("\tYES");
                    // // console.log(connects);
                    // // console.log(profile);
                    // connects[0].click();
                    // texts.push([str, 1]);
                } else if (cancels.length > 0) {
                    console.log("\tNO");
                    cancels[0].click();
                    res.cancel++;
                    texts.push([str.toString(), "0", Date.now().toString()]);

                    if (Date.now() + 60 * 1000 > wait_until) {
                        timeout = getRandomInt(50, 100);
                    }
                    break;
                }
                window.scrollTo(0, document.body.scrollHeight);
            }
        }

        // console.log(timeout);
        // console.log(texts);
        console.log(res);
        // console.log(wait_until);
        // console.log("Waiting for " + (timeout / 60 / 1000) + " mins");
        setTimeout(() => {
            connectFilteredProfiles(texts, res, wait_until)
        }, timeout);
    } catch (e) {
        console.log("\n\nERROR:");
        console.log(e);
        const rows = texts;
        var twoDArrStr = arrayToCSV(rows);
        downloadString(twoDArrStr, "csv", "mynetwork.csv");
        setTimeout(() => {
            connectFilteredProfiles(texts, res, wait_until)
        }, timeout + 5 * 1000);
    }
    // return;
}