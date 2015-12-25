var
    gulp = require('gulp'),
	del = require('del'),
    fs = require('fs'),
    css = require("gulp-minify-css"),
    merge = require('merge-stream'),
    eventStream = require('event-stream'),
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

gulp.task('build', ['clean', 'app', 'css', 'assets'], function () {
});

gulp.task('clean', function () {
    del.sync([output]);
});

gulp.task('app', ['clean'], function () {
    return merge(

        gulp.src(['./review/**/*.js'])
          .pipe($.concat('review.js'))
          .pipe(insertHtmlMarkupForFile('./review/reviewDialog/reviewDialog.html', '{{reviewDialog.html}}'))
          .pipe(insertHtmlMarkupForFile('./review/hints/reviewHint.html', '{{reviewHint.html}}'))
          .pipe(insertHtmlMarkupForFile('./review/spots/reviewSpot.html', '{{reviewSpot.html}}'))
          .pipe(gulp.dest(output))
    );
});

gulp.task('assets', ['clean'], function () {
    return merge(
        gulp.src(['./review/css/font/*'])
		  .pipe(gulp.dest(output + '/css/font')),

         gulp.src(['./review/css/img/*'])
		  .pipe(gulp.dest(output + '/css/img'))
    );
});

gulp.task('css', ['clean'], function () {
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

gulp.task('watch', function () {
    gulp.watch('./src/*', ['build']);
});

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