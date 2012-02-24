function getDateForList(date) {
    var d = new Date(date);
    var dt = "";
    dt += $L('weekday_' + d.getDay()) + ", ";
    dt += d.getDate() + " " + $L('monthsLong_' + d.getMonth());
    if (d.getYear() < (new Date).getYear())
        dt += " " + d.getFullYear();
    return dt;
}

function getDateForDetails(date) {
    var d = new Date(date);
    var dt = "";
    dt += d.getDate() + " ";
    dt += $L('monthsLong_' + d.getMonth()) + " ";
    dt += d.getFullYear() + " ";
    return dt;
}

function addSlashes(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function logThis() {
    if (enyo.application.appSettings['InDebug']) {
        var args = arguments;
        var output = "[___Neolog-DEBUG]";
        for (var i=0; i<arguments.length; i++) {
            output += " // " + arguments[i];
        }
        enyo.log(output);
    }
}
