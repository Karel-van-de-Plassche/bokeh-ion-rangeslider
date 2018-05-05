var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

var watchify = require("watchify");
var gutil = require("gulp-util");

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

gulp.task("copy-html-test", function () {
    return gulp.src(paths.simple_test.concat(paths.ion_css))
        .pipe(gulp.dest('test/build/site/'));
});

gulp.task("copy-img-test", function () {
    return gulp.src(paths.ion_images)
        .pipe(gulp.dest("test/build/img"));
});

var b = function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['test/simple_html.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
}

function testBundle() {
    b()
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("test/build/site"));
}

var w = watchify(b())

gulp.task('watch', function() {
  bundle(w);
  w.on('update', bundle.bind(null, w));
});


gulp.task("simple-test", ["copy-html-test", "copy-img-test"], testBundle)
//gulp.task('build', bundle.bind(null, b()));
//w.on("update", bundle)
