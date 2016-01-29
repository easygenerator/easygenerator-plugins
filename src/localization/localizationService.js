import langs from './langs';
       
class LocalizationService{
    constructor() {
        this.locale = 'en';
    }

    init(locale) {
        this.locale = locale;
        if (!langs[this.locale]) {
            this.locale = 'en';
        }
    }

    localize(key) {
        return langs[this.locale][key];
    }

    localizeHtml(html) {
        let regExp = /\{\{(.*?)\}\}/gi,
            localizedHtml = html,
            result = '';
            
        while ((result = regExp.exec(localizedHtml))) {
            let match = result[0],
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
window.pluginsLocalizationService = localizationService;
export default localizationService;