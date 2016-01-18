import localizationService from './../../localization/localizationService';
    
class HtmlMarkupProvider{
    getHtmlMarkup(html) {
        return $.parseHTML(localizationService.localizeHtml(html));
    }
}

var provider = new HtmlMarkupProvider();
export default provider;
