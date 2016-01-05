(function (plugins) {
    'use strict';

    var LocalizationService = function () {
        var service = {
            defaultLocale: 'en',
            locale: 'en'
        };

        function init(locale) {
            if (!plugins.lang) {
                throw 'Plugins lang is not initialized';
            }

            service.locale = locale;
        }

        function localize(key) {
            var locale = plugins.lang[service.locale];
            if (!locale) {
                locale = plugins.lang[service.defaultLocale];
            }

            return locale[key];
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