import PropertyChecker from '../../../../utils/PropertyChecker.js';

let fullSettings = {
    masteryScore: {
        score: 100
    },
    sectionsLayout: {
        key: ''
    },
    xApi: {},
    pdfExport: {},
    languages: {}
};

export default (settings, themeSettings, manifest) => {
    let preset = manifest && Array.isArray(manifest.presets) ? manifest.presets[0] : null;
    let defaultThemeSettings = preset != null ? preset.settings : {};
    let defaultTemplateSettings = manifest && manifest.defaultTemplateSettings ? manifest.defaultTemplateSettings : null;

    if (defaultTemplateSettings === null || defaultTemplateSettings === undefined) {
        throw 'Manifest don\'t have defaultTemplateSettings';
    }

    /**
     * fix for fonts and colors:
     * remove nulls from fonts array, because deepDiff in case with arrays returns array with the only changed element
     * e.g: deepDiff({ array: [{ id: 1 }, { id: 2 }] }, { array: [{ id: 1 }, { id: 3 }] }) => { array: [ , { id: 2 }] }
     * the first element in returned array will be not defined, json convert will return { array: [null, { id: 2 }] }
     * that'a why nulls should be deleted or untracked.
     */
    settings && Array.isArray(settings.fonts) && removeNullsInArray(settings.fonts);
    themeSettings && Array.isArray(themeSettings.fonts) && removeNullsInArray(themeSettings.fonts);
    settings && settings.branding && Array.isArray(settings.branding.colors) && removeNullsInArray(settings.branding.colors);
    themeSettings && themeSettings.branding && Array.isArray(themeSettings.branding.colors) && removeNullsInArray(themeSettings.branding.colors);
    /** end fix */

    var designSettings = Object.assign(defaultThemeSettings, themeSettings);
    var templateSettings = Object.assign(defaultTemplateSettings, settings);

    fullSettings = deepExtend(designSettings, templateSettings);

    PropertyChecker.isPropertiesDefined( fullSettings, { attempt: ['hasLimit', 'limit'] } ) || ( delete fullSettings.attempt );

    PropertyChecker.isPropertyDefined( fullSettings, 'branding.background' ) && ( fullSettings.background = fullSettings.branding.background );

    PropertyChecker.isPropertyDefined( fullSettings, 'sectionsLayout.key' ) && ( fullSettings.sectionsLayout = fullSettings.sectionsLayout.key );

    PropertyChecker.isPropertyDefined( fullSettings, 'branding.logo.url' ) && ( fullSettings.logo = { url: fullSettings.branding.logo.url } );

    PropertyChecker.isPropertyDefined( fullSettings, 'branding.logo.maxWidth' ) && ( fullSettings.logo.maxWidth = fullSettings.branding.logo.maxWidth );

    PropertyChecker.isPropertyDefined( fullSettings, 'branding.logo.maxHeight' ) && ( fullSettings.logo.maxHeight = fullSettings.branding.logo.maxHeight );

    PropertyChecker.isPropertyDefined( fullSettings, 'answers.randomize' ) || ( delete fullSettings.answers );

    PropertyChecker.isPropertyDefined( fullSettings, 'branding.colors' ) && ( fullSettings.colors = fullSettings.branding.colors );

    PropertyChecker.isPropertyDefined( fullSettings, 'timer.enabled' ) || ( delete fullSettings.timer );

    updateSettingsFromQueryString();
    updateSettingsByMode();

    return fullSettings;
};

function isNaturalNumber(n) {
    n = n.toString(); // force the value incase it is not
    let n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}

function isArray(item) {
    return item && item.constructor && item.constructor === Array;
}
  
function isObject(item) {
    return item && item.constructor && item.constructor === Object;
}

function hasInternalObjectsOrArrays(object) {
    let counter = 0;
    for (let property in object) {
      if (object[property] && (isObject(object[property]) || isArray(object[property]))) {
        counter++;
      }
    }
    return counter > 0;
}

function hasSameNumbersOfKeys(destinationObj, sourceObj) {
    return Object.keys(destinationObj).length === Object.keys(sourceObj).length;
}

function deepExtend(destination, source) {
    if (destination === null || destination === undefined) {
      return source;
    }
  
    for (let property in source) {
      if (source[property] && (isObject(source[property]) || isArray(source[property]))) {
        if ((destination.hasOwnProperty(property) && hasInternalObjectsOrArrays(source[property])) ||
            (!isArray(destination) 
                && !isArray(source) 
                && isObject(destination[property]) 
                && isObject(source[property])
                && !hasSameNumbersOfKeys(destination[property], source[property])))
        {
	        deepExtend(destination[property], source[property]);
        } else {
          if (isArray(destination)) {
            let { index, deleteNumber } = getItemPositionValues(destination, source[property].key);
            destination.splice(index, deleteNumber, source[property]);
            continue;
          }
  
          destination[property] = source[property];
        }
      } else {
        destination[property] = source.hasOwnProperty(property) ?
            source[property] :
            destination[property];
      }
    }
    return destination;
}

function getItemPositionValues(destination, sourceKey) {
    let index = destination.findIndex(item => item.key === sourceKey);
    let shouldReplaceItem = index !== -1;

    return {
        index: shouldReplaceItem ? index : destination.length,
        deleteNumber: shouldReplaceItem ? 1 : 0
    };
}

function removeNullsInArray(array) {
    if (array && array.length) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === null) {
                delete array[i];
            }
        }
    }
}

function updateSettingsFromQueryString() {
    var xapi = getQueryStringValue('xapi');
    var crossDevice = getQueryStringValue('cross-device');

    if (isXapiDisabled()) {
        fullSettings.xApi.enabled = false;
    }
    if (isCrossDeviceDisabled()) {
        fullSettings.allowCrossDeviceSaving = false;
    }

    function isXapiDisabled() {
        return !fullSettings.xApi.required &&
            !(xapi === null || xapi === undefined) &&
            xapi.toLowerCase() === 'false';
    }

    function isCrossDeviceDisabled() {
        return !(crossDevice === null || crossDevice === undefined) &&
            crossDevice.toLowerCase() === 'false';
    }
}

function updateSettingsByMode() {
    var reviewApiUrl = getQueryStringValue('reviewApiUrl');
    if(location.href.indexOf('/preview/') !== -1 || !!reviewApiUrl){
        fullSettings.allowCrossDeviceSaving = false;
        fullSettings.xApi.enabled = false;
    }
}

function getQueryStringValue (key) {
    var urlParams = window.location.search;
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var results = regex.exec(urlParams);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
};