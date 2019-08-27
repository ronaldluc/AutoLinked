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