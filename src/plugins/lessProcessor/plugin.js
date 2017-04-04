class Plugin {
    constructor() {
        this.vars = {};
    }
    load(colors, fonts, path = '/css/colors.less') {
        clearLocalStorage(path);

        for( var i = 0; i < colors.length; i++ ) {
            if (!colors[i] || !colors[i].value) {
                return;
            }

            this.vars[colors[i].key] = colors[i].value;
        }

        for( var i = 0; i < fonts.length; i++ ) {
            for( var prop in fonts[i] ) {
                if (prop === 'key' || prop === 'isGeneralSelected' || prop === 'isGeneralColorSelected' 
                || prop === 'place' || fonts[i][prop] == null) {
                    continue;
                }

                if (prop === 'size') {
                    this.vars['@' + fonts[i].key + '-' + prop] = fonts[i][prop] + 'px';
                }else{
                    this.vars['@' + fonts[i].key + '-' + prop] = fonts[i][prop];
                }
            }
        }

        return less.modifyVars(this.vars);
    }
}

window.LessProcessor = new Plugin();

function clearLocalStorage(path) {
    if (!window.localStorage || !less) {
        return;
    }

    var host = window.location.host;
    var protocol = window.location.protocol;
    var keyPrefix = protocol + '//' + host + path;

    for(var key in window.localStorage) {
        if (!window.localStorage.hasOwnProperty(key)) {
            continue;
        }

        if (key.indexOf(keyPrefix) === 0) {
            delete window.localStorage[key];
        }
    }
}