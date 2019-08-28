function arrayToCSV(twoDiArray) {
    var csvRows = [];
    for (var i = 0; i < twoDiArray.length; ++i) {
        for (var j = 0; j < twoDiArray[i].length; ++j) {
            twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';  // Handle elements that contain commas
        }
        csvRows.push(twoDiArray[i].join(','));
    }

    var csvString = csvRows.join('\r\n');
    return csvString;
}

function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], {type: fileType});

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(',');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
        URL.revokeObjectURL(a.href);
    }, 1500);
}

function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function getRandomInt(minMax, max=null) {
    let min = 0;
    if (max === null) {
        min = Math.ceil(minMax[0]);
        max = minMax[1];
    } else {
        min = Math.ceil(minMax);
    }
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function clickAnimation() {
    let btn = document.getElementById('connectBtn');
    btn.style.background = 'gray';
    btn.style.color = 'white';
    // flashes color on click
    setTimeout(function () {
        btn.style.background = 'white';
        btn.style.color = 'blue';
    }, 300);
}

function generateRegexps(settings) {
    let include_str = "";
    for (let [key, value] of Object.entries(settings['includes_patts'])) {
        include_str += value + "|";
    }
    let exclude_str = "";
    for (let [key, value] of Object.entries(settings['exclude_patts'])) {
        exclude_str += value + "|";
    }

    const include_patt = new RegExp(include_str.slice(0, -1), "i");
    const exclude_patt = new RegExp(exclude_str.slice(0, -1), "i");
    return {include_patt, exclude_patt};
}

function getTodayDate() {
    let date = new Date();
    date.setHours(0,0,0,0);
    return date;
}

function createButton(btnText, elementId, listener, offset=0) {
    console.log('Creating a button');
    console.log(btnText, elementId, listener, offset);
    let div = document.createElement('div');
    div.innerHTML = '<a id="' + elementId + '">' + btnText + '</a>';

    div.style.display = "inline-block";
    div.style.position = "fixed";
    div.style.right = (3 + offset).toString() + "em";
    div.style.top = "5em";
    div.style.zIndex = '995';
    div.style.cursor = 'pointer';

    document.body.append(div);

    let btn = document.getElementById(elementId);

    btn.style.background = 'white';
    btn.style.color = 'blue';
    btn.style.fontWeight = '800';
    btn.style.padding = '5px';
    btn.style.border = 'solid 2px black';
    btn.style.borderRadius = '7px';
    btn.style.textDecoration = 'none';
    btn.style.fontSize = '0.8em';

    document.getElementById(elementId).addEventListener('click', () => {flashButton(elementId); listener();}, false);
}

function flashButton(elementId) {
    let btn = document.getElementById(elementId);
    btn.style.background = 'purple';
    btn.style.color = 'white';
    // flashes color on click
    setTimeout(function () {
        btn.style.background = 'white';
        btn.style.color = 'blue';
    }, 300);
}

function dateToString(date) {
    const today = new Date(date);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return mm + '_' + dd + '_' + yyyy;
}
