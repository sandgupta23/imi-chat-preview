"use strict";
exports.__esModule = true;
function getTimeInHHMM() {
    var time = new Date();
    return (("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2));
}
exports.getTimeInHHMM = getTimeInHHMM;
function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
exports.getQueryStringValue = getQueryStringValue;
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}
exports.updateQueryStringParameter = updateQueryStringParameter;
