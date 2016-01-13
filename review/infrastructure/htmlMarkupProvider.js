    import localizationService from './../../localization/localizationService';
    
    var htmlMarkupProvider = {
        getHtmlMarkup: function (html) {
            return $.parseHTML(localizationService.localizeHtml(html));
        }
    };
    
    module.exports = htmlMarkupProvider;