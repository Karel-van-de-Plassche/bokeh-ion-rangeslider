var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

var watchify = require("watchify");
var gutil = require("gulp-util");
var clean = require('gulp-clean');

var paths = {
    simple_test: [
        'test/simple_html.html'
    ],
    ion_css: [
        'node_modules/ion-rangeslider/css/*.css'
    ],
    ion_images: [
        'node_modules/ion-rangeslider/img/*.png'
    ]
};

gulp.task("copy-css-test", function () {
    return gulp.src(paths.ion_css)
        .pipe(gulp.dest('test/build/site/'));
});

gulp.task("copy-img-test", function () {
    return gulp.src(paths.ion_images)
        .pipe(gulp.dest("test/build/img"));
});

gulp.task("clean-test", function () {
    return gulp.src('test/build', {read: false, allowEmpty: true})
        .pipe(clean());
});

var simpleTest = function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['test/simple_html.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
}

function simpleTestBundle() {
    return simpleTest()
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("test/build/site"));
}

gulp.task("copy-html-simple-test", function () {
    return gulp.src('test/simple_html.html')
        .pipe(gulp.dest('test/build/site/'));
});

gulp.task("simple-test", gulp.series("clean-test", ["copy-html-simple-test", "copy-css-test", "copy-img-test"], simpleTestBundle))

var bokehTest = function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['test/bokeh_test.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
}

function bokehTestBundle() {
    return bokehTest()
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("test/build/site"));
}

gulp.task("copy-html-bokeh-test", function () {
    return gulp.src('test/bokeh_test.html')
        .pipe(gulp.dest('test/build/site/'));
});

gulp.task("bokeh-test", gulp.series("clean-test", ["copy-html-bokeh-test", "copy-css-test", "copy-img-test"], bokehTestBundle))
//gulp.task('build', bundle.bind(null, b()));
//w.on("update", bundle)
