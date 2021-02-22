import fileReader from './fileReader';
import initialize from './initialization/index';

let configs = {
        templateSettings: {},
        themeSettings: {},
        publishSettings: {},
        manifest: {},
        translations: {}
    },
    _initialized = false,
    pathToSettings = '',
    cacheBuster = new Date().getTime();

class Plugin {
    static read(path, cacheExpiration) {
        return new Promise((resolve, reject) => {
            if (_initialized) {
                resolve(configs);
            }

            pathToSettings = path ? path : '';
            cacheBuster = cacheExpiration ? cacheExpiration : new Date().getTime();

            readConfigurations().then(() => {
                readTranslations().then(() => {
                    _initialized = true;
                    resolve(configs)
                });
            });
        });
    }

    static init(configs) { 
        if(typeof configs !== 'object') {
            throw 'configs should be an object';
        }

        return initialize(configs);
    }
}

window.ConfigurationReader = Plugin;

function readConfigurations() {
    return new Promise((resolve, reject) => {
        fileReader.readJSON(pathToSettings + 'settings.js', cacheBuster)
            .then(templateSettings => {
                configs.templateSettings = templateSettings;

                return fileReader.readJSON(pathToSettings + 'publishSettings.js', cacheBuster);
            })
            .then(publishSettings => {
                configs.publishSettings = publishSettings;

                return fileReader.readJSON(pathToSettings + 'themeSettings.js', cacheBuster);
            })
            .then(themeSettings => {
                configs.themeSettings = themeSettings;

                return fileReader.readJSON(pathToSettings + 'manifest.json', cacheBuster);
            })
            .then(manifest => {
                configs.manifest = manifest;

                return fileReader.readJSON(pathToSettings + 'customisations.json', cacheBuster);
            }).then(customisations => {
                configs.customisations = customisations;

                resolve();
            })
            .catch(e => reject(e))
    });
};

function readTranslations() {
    let languages = configs.templateSettings.languages || configs.manifest.defaultTemplateSettings.languages,
        code = 'en';

    if (configs.manifest === null || configs.settings === null) {
        throw 'Run {readConfigurations} firstly';
    }

    return new Promise((resolve, reject) => {
        _readTranslation(code)
            .then(translation => {
                configs.translations[code] = translation;

                if (languages && languages.selected && languages.selected !== 'xx') {
                    code = languages.selected;

                    _readTranslation(code)
                        .then(translations => {
                            configs.translations[code] = translations;

                            resolve();
                        })
                        .catch(e => reject(e));
                } else {
                    resolve();
                }
            })
            .catch(e => reject(e));
    });

    

    function _readTranslation(code) {
        var langUrl = _getLangUrlByCode(code);
        return fileReader.readJSON(pathToSettings + langUrl, cacheBuster);
    }

    function _getLangUrlByCode(code) {
        var lang = configs.manifest.languages.find(item => item.code === code);

        if (lang !== null && lang !== undefined) {
            return lang.url;
        } else {
            throw 'Translations for [' + code + '] not found! Please contact template developer.';
        }
    }
}