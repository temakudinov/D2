var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify');

var cfg = {
	stylesPath: 'dev/styles',
	scriptsPath: 'dev/scripts'
};

/* ========================================================================= */

////////////
// STYLES //
////////////
gulp.task('stl', function () {
	return gulp.src(cfg.stylesPath + '/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded' // expanded, compressed
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream({
			match: '**/*.css'
		}));
});

gulp.task('stl:p', function () {
	return gulp.src(cfg.stylesPath + '/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded' // expanded, compressed
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 3 versions', 'ie >= 9', 'iOS >= 6', 'Android >= 4']
		}))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream({
			match: '**/*.css'
		}));
});

////////////
// SERVER //
////////////
gulp.task('bsr', function () {
	browserSync.reload();
});

gulp.task('bsi', function () {
	browserSync.init({
		server: 'dist'
	});
});

/////////////
// SCRIPTS //
/////////////
gulp.task('ugl', function () {
	return gulp.src(['dist/js/main.js'])
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('conc', function() {
	return gulp.src([
			cfg.scriptsPath + '/_first.js',
			cfg.scriptsPath + '/lib/*.js',
			cfg.scriptsPath + '/vendor/*.js',
			cfg.scriptsPath + '/_last.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scr', function() {
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
});

///////////
// WATCH //
///////////
gulp.task('watch', function () {
	gulp.watch(cfg.stylesPath + '/**/*.scss', ['stl']);
	gulp.watch(cfg.scriptsPath + '/**/*.js', ['conc']);
	//gulp.watch(cfg.scriptsPath + '/**/*.js', ['conc', 'bsr']);
	//gulp.watch('dist/*.html', ['bsr']);
});

/* ========================================================================= */

gulp.task('default', ['bsi', 'watch']);
gulp.task('prod', ['scr', 'stl:p']);