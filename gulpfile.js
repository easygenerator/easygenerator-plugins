var
    gulp = require('gulp'),
	del = require('del'),
    fs = require('fs'),
    css = require("gulp-minify-css"),
    merge = require('merge-stream'),
    eventStream = require('event-stream'),
    path = require('path'),
	$ = require('gulp-load-plugins')({
	    lazy: true
	}),

    output = 'dist'
;

var less = {
    src: ['./review/css/review.less'],
    dest: output + '/css/',
    browsers: ['last 1 Chrome version', 'last 1 Firefox version', 'Explorer >= 10', 'last 1 Safari version', 'Android 2.3', 'Android >= 4', 'last 1 ChromeAndroid version', 'last 1 iOS version']
};

gulp.task('build', ['clean', 'build-review'], function () {
});

gulp.task('build-review', ['clean', 'review-app', 'review-css', 'review-assets'], function () {
    del.sync([output + '/lang.js']);
});

gulp.task('clean', function () {
    del.sync([output]);
});

// #region review

gulp.task('review-app', ['clean', 'lang'], function () {
    return merge(

        gulp.src(['./review/**/*.js', output + '/lang.js', './localization/**/*.js'])
          .pipe($.concat('review.js'))
          .pipe(insertHtmlMarkupForFile('./review/dialogs/commentForm/commentForm.html', '{{commentForm.html}}'))
          .pipe(insertHtmlMarkupForFile('./review/dialogs/elementReview/elementReviewDialog.html', '{{elementReviewDialog.html}}'))
          .pipe(insertHtmlMarkupForFile('./review/dialogs/generalReview/generalReviewDialog.html', '{{generalReviewDialog.html}}'))
          .pipe(insertHtmlMarkupForFile('./review/hints/reviewHint.html', '{{reviewHint.html}}'))
          .pipe(insertHtmlMarkupForFile('./review/spots/reviewSpot.html', '{{reviewSpot.html}}'))
          .pipe($.uglify())
          .pipe(gulp.dest(output))
    );
});

gulp.task('review-assets', ['clean'], function () {
    return merge(
        gulp.src(['./review/css/font/*'])
		  .pipe(gulp.dest(output + '/css/font')),

         gulp.src(['./review/css/img/*'])
		  .pipe(gulp.dest(output + '/css/img'))
    );
});

gulp.task('review-css', ['clean'], function () {
    gulp.src(less.src)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe($.less({
            strictMath: true,
            strictUnits: true
        }))
        .pipe($.autoprefixer({
            browsers: less.browsers,
            cascade: false
        }))
        .pipe(css())
        .pipe($.csso())
        .pipe(gulp.dest(less.dest));
});

// #endregion

// #region lang

gulp.task('lang', ['clean', 'lang-combine-json'], function () {
    return gulp.src(output + '/lang.js')
        .pipe($.tap(function (file) {
            file.contents = Buffer.concat([
               new Buffer('(function (plugins) { plugins.lang ='),
               file.contents,
               new Buffer(';})(window.plugins = window.plugins || {});')
            ]);
        }))
        .pipe(gulp.dest(output));
});

gulp.task('lang-combine-json', ['clean'], function () {
    return gulp.src('localization/lang/**/*.json')
        .pipe($.jsoncombine('lang.js', function (data) {
            return new Buffer(JSON.stringify(data));
        }))
        .pipe(gulp.dest(output));
});

// #endregion

function insertHtmlMarkupForFile(path, alias) {
    var htmlMarkup = fs.readFileSync(path, 'utf8');
    htmlMarkup = htmlMarkup.trim().replace(/\'/g, '\\\'').replace(/\s+/g, ' ');

    return eventStream.map(function (file, callback) {
        var fileContent = String(file.contents);
        fileContent = fileContent.replace(alias, htmlMarkup);
        file.contents = new Buffer(fileContent);
        callback(null, file);
    });
}