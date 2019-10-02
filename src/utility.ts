export function getTimeInHHMM() {
    const time = new Date();
    return (("0" + time.getHours()).slice(-2)   + ":" + ("0" + time.getMinutes()).slice(-2));
}

export function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
