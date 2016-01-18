# easygenerator-plugins

Easygenerator 'Browser not supported' page.

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

## Review plugin

If the course is opened for review, the query string parameter `'reviewApiUrl'` is added to url.

### Init plugin

```
var reviewPlugin = new easygeneratorPlugins.ReviewPlugin();

reviewPlugin.init({
                locale: 'en',
                reviewApiUrl: decodeURIComponent(reviewApiUrl),
                courseId: courseId
            });
```

When page html changes, call `renderSpots()` method.

```
 reviewPlugin.renderSpots();
```

