class WindowPluginsObjectExtender {
    extend(key, value) {
        if (!window.easygeneratorPlugins) {
            window.easygeneratorPlugins = {};
        }

        window.easygeneratorPlugins[key] = value;
    }
}

export default WindowPluginsObjectExtender;