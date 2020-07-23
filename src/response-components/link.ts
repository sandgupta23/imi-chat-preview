/*
  * linkify: replaces all texts to <a> links in a string
  * */
export function convertToLink(url, className = "text-link", prefix = "") {
    debugger;
    const inputTextWithoutBr = url.split('<br>').join('');
    if (inputTextWithoutBr.includes('<') && inputTextWithoutBr.includes('>')) {
        return url;
    }

    let replacedText, replacePattern1, replacePattern2;

    // URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    if(prefix)
    replacedText = url.replace(replacePattern1, `<a href="$1" target="_blank" class="${className}">${prefix}</a>`);
    else
    replacedText = url.replace(replacePattern1, `<a href="$1" target="_blank" class="${className}">$1</a>`);

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    if(prefix)
    replacedText = replacedText.replace(replacePattern2, `$1<a href="http://$2" target="_blank" class="${className}>${prefix}</a>`);
    else
    replacedText = replacedText.replace(replacePattern2, `$1<a href="http://$2" target="_blank" class="${className}>$2</a>`);

    // Change email addresses to mailto:: links.
    // replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    // replacedText = replacedText.replace(replacePattern3, `<a href="mailto:$1" class="${className}>$1</a>`);
    return replacedText;
//

}