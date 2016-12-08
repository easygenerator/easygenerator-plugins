let defaultTranslationsCode = 'en';

export default (translations, templateSettings) => {
    let languageCode = templateSettings.languages.selected,
        customTranslations = templateSettings.languages.customTranslations,
        resolvedTranslations = [];

    if (!languageCode || languageCode === defaultTranslationsCode) {
        resolvedTranslations = [];
    }

    if (languageCode === 'xx') {
        resolvedTranslations = customTranslations || [];
    }

    if(languageCode !== defaultTranslationsCode && languageCode !== 'xx'){
        resolvedTranslations = translations[languageCode]; 
    }

    translations = Object.assign(translations[defaultTranslationsCode], resolvedTranslations);
    return translations;
};