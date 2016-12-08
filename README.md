# easygenerator-plugins

Collection of plugins to extend easygenerator templates functionality.

## Installation

### Install with [Bower](http://bower.io) 
```
bower install easygenerator-plugins
```

### Add scripts to page
```html
<body>
  ...
  <script src="[path]/easygenerator-plugins/dist/plugins.js" type="text/javascript"></script>
  ...
</body>
```

### Add styles to page
```html
<head>
  ...
  <link href="[path]/easygenerator-plugins/dist/styles.css" rel="stylesheet"/>
  ...
</head>
```

## Localization

```javascript
pluginsLocalizationService.init('en');
```

## Review plugin

Add comments functionality for course in review mode.
If the course is opened for review, the query string parameter `'reviewApiUrl'` is added to url.

### Mark element for review

To mark an element for review, add `'reviewable'` class in the html markup.

```html
 <li class="section reviewable">
    ...
 </li>
```

### Init plugin

```javascript
var reviewPlugin = new ReviewPlugin();

 reviewPlugin.init({
                reviewApiUrl: decodeURIComponent(reviewApiUrl),
                courseId: courseId
            });
```

When page html changes, call `renderSpots()` method.

```javascript
 reviewPlugin.renderSpots();
```

## Translation plugin

Add translate functionality to course.
This plugin will translate pages in course.

### How to use

To translate page you should have on page attributes for some cases of translation:

#### For default text translation:
```html
 <span data-translate-text="some-text-key">
    ...
 </span>
```

#### For placeholder translation:
```html
 <input type="text" data-translate-placeholder="some-text-key"/>
```

#### For title translation:
```html
 <img data-translate-title="some-text-key"/>
```

After that you should call method *localize* of global class *TranslationPlugin*:

```javascript
 TranslationPlugin.localize();
```

### Init plugin

To init plugin you must have translations object, where we have keys and current translation as value.
To init plugin just call method init with translations.

```javascript
 var translation = {
     "some-text-key1" : "My translated text 1",
     "some-text-key2" : "My translated text 2",
     "some-text-key3" : "My translated text 3"
 };

 TranslationPlugin.localize(translation);
```

## Configuration reader plugin

This plugin provide functionality of read and merge configurations from Simple Course to *ConfigurationReader* global class.
Here is list of configurations:

* manifest.json
* themeSetting.js
* publishSettins.js
* settings.js
* *.json (lang files with translations from manifest.json)

### How to use

Method *read* of *ConfigurationReader* is async and return 5 configs:

```javascript
 ConfigurationReader.read(path).then(function(configs){
     /*configs = {
         manifest: {...},
         publishSettings: {...},
         templateSettings: {...},
         themeSettings: {...},
         translations: {...}
     }*/  
     ...
 });
```
Where *path* is path to configs.

Method *init* take configs from *read* method, merge it and return 2 configs:

```javascript
 ConfigurationReader.read(path).then(function(configs){
     var settings = ConfigurationReader.init(configs);
     
     /*settings = {
         templateSettings: {...},
         translations: {...}
     }*/
     ...
 });
```

Where templateSettings is merged **templateSettings** with **themeSetting** and **defaultTemplateSettings** from manifest;
And translations is merged translations;

## Branchtrack
Helper for easygenerator templates that support **Scenario question**

### Supported message types
* "branchtrack:player:init" - first time init;
* "branchtrack:player:start" - start of playing, t.i. before first scene appear, including on restart;
* "branchtrack:player:start" - new scene shown;
* "branchtrack:player:start" - user hit the choice;
* "branchtrack:player:start" - user reached last scene.

For more information you can go to [JavaScript events API - BranchTrack](https://docs.branchtrack.com/events-api)

## Supported browser

Easygenerator 'Browser not supported' page.

### Configuration

You must configure list of browsers you want to support.
```javascript
  supportedBrowser.configure({
    browsers: {
        win: {
            chrome: {},
            firefox: {},
            msie: {}
        },
        mac: {
            safari: {},
            chrome: {}            
        },
        android: {
            native: {
                title: 'Android Browser',
                image: 'css/img/browsers/android.png'
            },
            chrome: {
		            version: 39
	          }
        },
        ios: {
            safari: {},
            chrome: {}
        }
    },
    mainAppContainerId: 'applicationHost',
    globalBrowsersInfo: {
        chrome: {
            title: 'Google Chrome',
            link: 'http://www.google.com/chrome',
            image: 'css/img/browsers/chrome.png',
            version: 43
        },
        firefox: {
            title: 'Mozilla Firefox',
            link: 'http://www.mozilla.com/firefox',
            image: 'css/img/browsers/firefox.png',
            version: 33
        },
        msie: {
            title: 'Internet Explorer',
            link: 'http://windows.microsoft.com/en-US/internet-explorer/download-ie',
            image: 'css/img/browsers/ie.png',
            version: 11
        },
        safari: {
            title: 'Apple Safari',
            link: 'http://www.apple.com/safari',
            image: 'css/img/browsers/safari.png'
        }
    }
});
```

#### Parameters

parameter | description
--- | ---
**browsers** | list of supported browsers
**mainAppContainerId** | ID of container which will be hidden when browser not supported. It should be the highest block in the body
**globalBrowsersInfo** | when browser parameters is the same for all platforms to exclude repetition you can add global info about this browser

#### Browsers list configuration
`browsers` should contain list of supported platforms and each platform should contain list of supported browsers for this platform.
```javascript
browsers: {
    win: {
        chrome: {},
        firefox: {},
        msie: {}
    },
    mac: {
        safari: {},
        chrome: {}            
    }
}
```
Each browser must be described by the next parameters:

parameter | required | description
--- | --- | ---
**title** | required | browser title, that will be shown on the page
**image** | required | path to browser image, that will be shown on the page
**link** | optional | url to download the browser. When omitted, the browser block will be unclickable
**version** | optional | browser version from which browser supported. When ommitted all version will be supported

#### Supported platforms and browsers

#### Platforms

code | platform name
--- | ---
**win** | Microsoft Windows
**mac** | Apple Mac OS
**linux** | Linux
**android** | Google Android
**ios** | Apple IOS
**winphone** | Microsoft Windows Phone
**blackberry** | Blackberry

#### Browsers

code | browser name
--- | ---
**chrome** | Google Chrome
**firefox** | Mozilla Firefox
**safari** | Apple Safari
**msie** | Microsoft Internet Explorer
**opera** | Opera

### Initialization

After you configure plugin you must call `init` function:
```javascript
 supportedBrowser.init();
```
Also supported chaining:
```javascript
 supportedBrowser.configure({...}).init();
```

### Debug

To turn on the debug mode set `debug` parameter to true.

```javascript
 supportedBrowser.configure({
    ...,
    debug: true
 });
```
In debug mode on page load will be shown the `alert` with current browser info.
When you have problem with configuration (you don't know how current browser detected) you should turn on the debug mode.
