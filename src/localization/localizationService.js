import langs from './langs';
       
class LocalizationService{
    constructor() {
        this.locale = 'en';
    }

    init(locale) {
        this.locale = locale;
        var lang = langs[this.locale];
        if (!lang) {
            this.locale = 'en';
        }
    }

    localize(key) {
        return langs[this.locale][key];
    }

    localizeHtml(html) {
        var regExp = /\{\{(.*?)\}\}/gi;
        var result = '', localizedHtml = html;
            
        while ((result = regExp.exec(localizedHtml))) {
            var match = result[0],
                key = result[1];

            localizedHtml = localizedHtml.replace(match, this.localize(key));
        }

        if(regExp.exec(localizedHtml)) {
            localizedHtml = this.localizeHtml(localizedHtml);
        }

        return localizedHtml;
    }
}

var localizationService = new LocalizationService();
export default localizationService;