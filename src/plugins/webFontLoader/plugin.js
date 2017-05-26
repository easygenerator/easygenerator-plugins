class Plugin {
    static load(fonts, manifest, publishSettings) {
        return new Promise((resolve, reject) => {
            var customFonts = manifest.fonts.map(font => {
                return font.fontFamily;
            });

            let familiesToLoad = fonts.map(font => {
                return { "fontFamily": font.fontFamily, "variants": ["300","400","600"], "place": font.place };
            });

            familiesToLoad = familiesToLoad.filter((font, index, array) => {
                return array.indexOf(font) == index;
            });

            familiesToLoad = familiesToLoad.filter(font => {
                return font.place !== 'none' && !~customFonts.indexOf(font.fontFamily);
            });

            if (!familiesToLoad && !familiesToLoad.length) {
                familiesToLoad = [{ "fontFamily": 'Open Sans', "variants": ["300","400", "600"], "place": 'google' }];
            }
            
            let defers = [];
            
            //Load theme fonts
            defers.push(new Promise((resolve, reject) => {
                let fontLoaderConfig = {
                    active: () => {
                        resolve();
                    },
                    inactive: () => {
                        //added to make possible ofline template loading
                        resolve();
                    }
                };

                if (familiesToLoad.length) {
                    for( let i = 0; i < familiesToLoad.length; i++ ){
                        if(fontLoaderConfig.hasOwnProperty(familiesToLoad[i].place)) {
                            fontLoaderConfig[familiesToLoad[i].place].families.push(mapFontName(familiesToLoad[i]));
                        } else if(familiesToLoad[i].place === 'custom') {
                            fontLoaderConfig.custom = {
                                families: [mapFontName(familiesToLoad[i])],
                                urls: [publishSettings.customFontPlace]
                            };
                        } else {
                            fontLoaderConfig[familiesToLoad[i].place] = {
                                families: [mapFontName(familiesToLoad[i])]
                            };
                        }
                    };
                }

                window.WebFont && WebFont.load(fontLoaderConfig);
            }));            

            //Load template fonts
            if (manifest.fonts && manifest.fonts.length) {
                var manifestFonts = manifest.fonts;

                let fontUrls = manifestFonts.map(font => {
                    return font.url;
                });

                fontUrls = fontUrls.filter((url, index, array) => {
                    return array.indexOf(url) == index;
                });

                defers.push(new Promise((resolve, reject) => {
                    let fontLoaderConfig = {
                            active: function() {
                                resolve();
                            },
                            custom: {
                                families: [],
                                urls: fontUrls
                            },
                            inactive: function() {
                                //added to make possible ofline template loading
                                resolve();
                            }
                        };

                    fontLoaderConfig.custom.families = manifestFonts.map(mapFontName);          
                    
                    window.WebFont && WebFont.load(fontLoaderConfig);
                }));
            }

            Promise.all(defers).then(() => {
                resolve();
            });
        });
    }
}

window.WebFontLoader = Plugin;

function mapFontName(fontToLoad) {
    return fontToLoad.fontFamily + (fontToLoad.variants && fontToLoad.variants.length ? ':' + fontToLoad.variants.join(',') : '');
}