var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

var cfg = {
    stylesPath: 'dev/styles',
    scriptsPath: 'dev/scripts'
};

/* ========================================================================= */

function styles() {
    return gulp.src(cfg.stylesPath + '/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
}

function stylesProd() {
    return gulp.src(cfg.stylesPath + '/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions', 'ie >= 9', 'iOS >= 6', 'Android >= 4']
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
}

function browserSyncReload() {
    browserSync.reload();
}

function browserSyncInit() {
    browserSync.init({
        server: 'dist'
    });
}


function uglifyJs() {
    return gulp.src(['dist/js/main.js'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

function concatJs() {
    return gulp.src([
            cfg.scriptsPath + '/_first.js',
            cfg.scriptsPath + '/lib/*.js',
            cfg.scriptsPath + '/vendor/*.js',
            cfg.scriptsPath + '/_last.js'
        ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
}

function scripts() {
    return gulp.src([
            cfg.scriptsPath + '/_first.js',
            cfg.scriptsPath + '/lib/*.js',
            cfg.scriptsPath + '/vendor/*.js',
            cfg.scriptsPath + '/_last.js'
        ])
        .pipe(concat('main.js'))
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

function watchFiles() {
    gulp.watch(cfg.stylesPath + '/**/*.scss', styles);
    gulp.watch(cfg.scriptsPath + '/**/*.js', concatJs);
}

exports.default = gulp.parallel(browserSyncInit, watchFiles);
exports.prod = gulp.parallel(scripts, stylesProd);
