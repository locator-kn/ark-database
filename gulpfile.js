var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var notifier = require('node-notifier');
var sourcemaps = require('gulp-sourcemaps');
var typescript15 = require('typescript');

var tsProjectTripl = ts.createProject({
    declarationFiles: true,
    noExternalResolve: false,
    module: 'commonjs',
    target: 'ES5',
    noEmitOnError: false,
    typescript: typescript15
});

gulp.task('ts', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProjectTripl));

    tsResult._events.error[0] = function (error) {
        notifier.notify({
            'title': 'Compilation error',
            'message': error.__safety.toString(),
            sound: true
        });
    };
    return merge([
        tsResult.dts.pipe(gulp.dest('lib/definitions')),
        tsResult.js.pipe(gulp.dest('lib/js'))
    ]);
});

gulp.task('defaultLocation', function() {
    return gulp.src('src/defaultlocation/*.*')
        .pipe(gulp.dest('lib/js/defaultlocation'))
});

gulp.task('default', ['ts', 'defaultLocation'], function () {

});