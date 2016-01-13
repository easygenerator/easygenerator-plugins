import langs from './langs';
       
    var LocalizationService = function () {
        var service = {
            locale: 'en'
        };

        function init(locale) {
            service.locale = locale;
            var lang = langs[service.locale];
            if (!lang) {
                service.locale = 'en';
            }
        }

        function localize(key) {
            return langs[service.locale][key];
        }

        function localizeHtml(html) {
            var regExp = /\{\{(.*?)\}\}/gi;
            var result = '', localizedHtml = html;
            while ((result = regExp.exec(localizedHtml)) !== null) {
                var match = result[0],
                    key = result[1];

                localizedHtml = localizedHtml.replace(match, localize(key));
            }

            return localizedHtml;
        }

        return {
            init: init,
            localize: localize,
            localizeHtml: localizeHtml
        };
    };

var localizationService = new LocalizationService();
module.exports = localizationService;