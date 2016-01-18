class WindowPropertiesProvider {
    scrollTop() {
        if (window.pageYOffset != undefined) {
            return window.pageYOffset;
        }
        else {
            return document.documentElement.scrollTop || document.body.scrollTop || 0;
        }
    }
}

var windowPropertiesProvider = new WindowPropertiesProvider();
export default windowPropertiesProvider;