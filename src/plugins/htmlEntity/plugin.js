let constants = {
    tags: {
        encode: {
            openSymbol: {
                regExpString: '<',
                replacement: '&lt;'
            },
            endSymbol: {
                regExpString: '>',
                replacement: '&gt;'
            }
        },
        decode: {
            openSymbol: {
                regExpString: '&(?:amp;){0,1}lt;',
                replacement: '<'
            },
            endSymbol: {
                regExpString: '&(?:amp;){0,1}gt;',
                replacement: '>'
            }
        }
    }
}

class Plugin {
    static encodeTags(decodedHtmlString) {
        let encodedString = '';

        encodedString = this._replace(decodedHtmlString, constants.tags.encode.openSymbol);
        encodedString = this._replace(encodedString, constants.tags.encode.endSymbol);
    
        return encodedString;
    }

    static decodeTags(encodedHtmlString) {
        let decodedString = '';

        decodedString = this._replace(encodedHtmlString, constants.tags.decode.openSymbol);
        decodedString = this._replace(decodedString, constants.tags.decode.endSymbol);
    
        return decodedString;
    }

    static _replace(htmlString, { regExpString, replacement }) {
        let match, regExp = new RegExp(regExpString);
            
        while ((match = regExp.exec(htmlString)) !== null) {
            if (match.index === regExp.lastIndex) {
                regExp.lastIndex++;
            }
                                        
            htmlString = htmlString.replace(match, replacement);
        }

        return htmlString;
    }
}

window.HtmlEntity = Plugin;