(function (review) {
    'use strict';

    review.htmlMarkupProvider = {
        getHtmlMarkup: function (html) {
            var localizationService = window.plugins.localizationService;
            return $.parseHTML(localizationService.localizeHtml(html));
        }
    };

})(window.review = window.review || {});