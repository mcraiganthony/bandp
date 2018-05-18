// Load plugins
var browserSync  = require('browser-sync'),
    gulp         = require('gulp'),
    autoprefixer = require("gulp-autoprefixer"),
    changed      = require('gulp-changed');
    concat       = require("gulp-concat"),
    csso         = require("gulp-csso"),
    duration     = require("gulp-duration"),
    ghpages      = require("gulp-gh-pages"),
    less         = require('gulp-less'),
    notify       = require("gulp-notify"),
    plumber      = require('gulp-plumber'),
    uglify       = require('gulp-uglify'),
    reload       = browserSync.reload;


// Path Variables
var paths =  {
  "html": {
    "src_files": "dist/*.html"
    "dist_dir": "dist/"
  },
  "icons": {
    "src_dir": "src/icons/**",
    "dist_dir": "dist/css/icons/"
  },
  "media": {
    "src_dir": "src/media/**",
    "dist_dir": "dist/media/"
  },
  "styles": {
    "src_files": "src/less/**/*.less",
    "dist_dir": "dist/css/"
  },
  "js": {
    "src_files": "src/js/*.js",
    "dist_dir": "dist/js/"
  }
};


// Styles
gulp.task('styles', function() {
  return gulp.src(["src/less/app.less"])
    .pipe(less({ compress: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions','ie 9'], cascade: false }))
    .pipe(gulp.dest(paths.styles.dist_dir))
    .pipe(duration("building styles"))
    .pipe(notify({ message: "styles task complete" }))
    .pipe(reload({stream:true}));
});


// Javascript
gulp.task('js', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/js/tooltip.js',
    'bower_components/scrollReveal.js/dist/scrollReveal.min.js',
    'bower_components/smoothScroll.js/smoothScroll.js',
    paths.js.src_files
    ])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dist_dir))
    .pipe(duration("building js"))
    .pipe(notify({ message: "js task complete" }))
    .pipe(reload({stream:true}));
});


// HTML
gulp.task('html', function() {
  return gulp.src([paths.html.src_files])
    .pipe(reload({stream:true}));
});

// Icons
gulp.task('icons', function() {
  return gulp.src([paths.icons.src_dir])
    .pipe(changed(paths.icons.dist_dir))
    .pipe(gulp.dest(paths.icons.dist_dir))
    .pipe(reload({stream:true}));
});

// Images
gulp.task('media', function() {
  return gulp.src([paths.media.src_dir])
    .pipe(changed(paths.media.dist_dir))
    .pipe(gulp.dest(paths.media.dist_dir))
    .pipe(reload({stream:true}));
});


// Watch
gulp.task("watch", function() {
  gulp.watch(paths.styles.src_files, ["styles"]);
  gulp.watch(paths.js.src_files, ["js"]);
  gulp.watch(paths.html.src_files, ["html"]);
});


// Browser Sync
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
});


// Website
gulp.task('website', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghpages());
});


// Gulp Default
gulp.task('default', ['styles','js','media','icons']);


// Gulp Server
gulp.task('server', ['default', 'watch', 'browser-sync'], function () {
    gulp.watch([paths.html.src_files], reload);
});
