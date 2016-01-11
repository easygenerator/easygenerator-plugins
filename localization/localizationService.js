(function (plugins) {
    'use strict';

    var LocalizationService = function () {
        var service = {
            locale: 'en'
        };

        function init(locale) {
            if (!plugins.lang) {
                throw 'Plugins lang is not initialized';
            }

            service.locale = locale;
            var lang = plugins.lang[service.locale];
            if (!lang) {
                service.locale = 'en';
            }
        }

        function localize(key) {
            return plugins.lang[service.locale][key];
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

    plugins.localizationService = new LocalizationService();

})(window.plugins = window.plugins || {});