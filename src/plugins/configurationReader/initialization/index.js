import getTemplateSettings from './tasks/templateSettings';
import getTranslations from './tasks/translations';

export default initialize;

function initialize(configs) {
    let templateSettings = getTemplateSettings(configs.templateSettings, configs.themeSettings, configs.manifest);
    let translations = getTranslations(configs.translations, templateSettings);

    return {
        templateSettings: templateSettings,
        translations: translations
    };
}