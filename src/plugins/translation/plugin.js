let _translations = [];

class Plugin {
    static init(translations) {
        _translations = translations;
    }
    static getTextByKey(key) {
        if (typeof _translations[key] != "string") {
            throw 'Unable to localize ' + key;
        }
        return unescape(_translations[key]);
    }
    static localize() {
        let that = this;

        let list = document.querySelectorAll('[data-translate-text]');
        
        for(let i = 0; i < list.length; i++) {
            let key = list[i].getAttribute('data-translate-text');
            list[i].innerHTML = that.getTextByKey(key);
        }

        list = document.querySelectorAll('[data-translate-placeholder]');
        
        for(let i = 0; i < list.length; i++) {
            let key = list[i].getAttribute('data-translate-placeholder');
            list[i].setAttribute('placeholder', that.getTextByKey(key));
        }

        list = document.querySelectorAll('[data-translate-title]');
        
        for(let i = 0; i < list.length; i++) {
            let key = list[i].getAttribute('data-translate-title');
            list[i].setAttribute('title', that.getTextByKey(key));
        }
    }
}

window.TranslationPlugin = Plugin;
export default Plugin;

function unescape(str){
    return String(str)
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}