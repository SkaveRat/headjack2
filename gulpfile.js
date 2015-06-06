var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('browserify background', function() {
    gulp.src('src/js/background.js')
        .pipe(browserify({transform:'reactify'}))
        .pipe(concat('background.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('browserify index', function() {
    gulp.src('src/js/index.js')
        .pipe(browserify({transform:'reactify'}))
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
    gulp.src(['src/manifest.json', 'src/logo-16.png', 'src/index.html'])
        .pipe(gulp.dest('dist'));
    gulp.src(['src/fonts/**'])
        .pipe(gulp.dest('dist/fonts/'));
    gulp.src(['src/css/**'])
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('default',['browserify background', 'browserify index', 'copy']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});
