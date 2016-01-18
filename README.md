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
easygeneratorPlugins.localizationService.init('en');
```

## Review plugin

If the course is opened for review, the query string parameter `'reviewApiUrl'` is added to url.

### Mark element for review

To mark an element for review, add `'reviewable'` class in the html markup.

```
 <li class="objective reviewable">
    ...
 </li>
```

### Init plugin

```
var reviewPlugin = new easygeneratorPlugins.ReviewPlugin();

 reviewPlugin.init({
                reviewApiUrl: decodeURIComponent(reviewApiUrl),
                courseId: courseId
            });
```

When page html changes, call `renderSpots()` method.

```
 reviewPlugin.renderSpots();
```

