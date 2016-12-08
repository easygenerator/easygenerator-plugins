import getTemplateSettings from './tasks/templateSettings';
import getTranslations from './tasks/translations';

export default initialize;

function initialize(configs) {
    let templateSetting = getTemplateSettings(configs.templateSettings, configs.themeSettings, configs.manifest);
    let translations = getTranslations(configs.translations, templateSetting);

    return {
        templateSetting: templateSetting,
        translations: translations
    };
}