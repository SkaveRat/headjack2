var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('browserify backend', function() {
    gulp.src('src/js/background.js')
        .pipe(browserify({transform:'reactify'}))
        .pipe(concat('background.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
    gulp.src(['src/manifest.json', 'src/logo-16.png'])
        .pipe(gulp.dest('dist'));
});

gulp.task('default',['browserify backend', 'copy']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default', 'copy']);
});
