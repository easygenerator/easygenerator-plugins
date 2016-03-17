# easygenerator-plugins

Collection of plugins to extend easygenerator templates functionality.

## Installation

### Install with [Bower](http://bower.io) 
```
bower install easygenerator-plugins
```

### Add scripts to page
```
<body>
  ...
  <script src="[path]/easygenerator-plugins/dist/plugins.js" type="text/javascript"></script>
  ...
</body>
```

### Add styles to page
```
<head>
  ...
  <link href="[path]/easygenerator-plugins/dist/styles.css" rel="stylesheet"/>
  ...
</head>
```

## Localization

```
pluginsLocalizationService.init('en');
```

## Review plugin

Add comments functionality for course in review mode.
If the course is opened for review, the query string parameter `'reviewApiUrl'` is added to url.

### Mark element for review

To mark an element for review, add `'reviewable'` class in the html markup.

```
 <li class="section reviewable">
    ...
 </li>
```

### Init plugin

```
var reviewPlugin = new ReviewPlugin();

 reviewPlugin.init({
                reviewApiUrl: decodeURIComponent(reviewApiUrl),
                courseId: courseId
            });
```

When page html changes, call `renderSpots()` method.

```
 reviewPlugin.renderSpots();
```

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
```
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
```
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
```
 supportedBrowser.init();
```
Also supported chaining:
```
 supportedBrowser.configure({...}).init();
```

### Debug

To turn on the debug mode set `debug` parameter to true.

```
 supportedBrowser.configure({
    ...,
    debug: true
 });
```
In debug mode on page load will be shown the `alert` with current browser info.
When you have problem with configuration (you don't know how current browser detected) you should turn on the debug mode.
