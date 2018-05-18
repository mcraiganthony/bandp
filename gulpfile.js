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
    reload       = browserSync.reload,
    svgsprite    = require("gulp-svg-sprite");


// Path Variables
var paths =  {
  "html": {
    "src": "src/index.html",
    "dest": "dist/"
  },
  "icons": {
    "src": "src/icons/**/*",
    "dest": "dist/icons/"
  },
  "media": {
    "src": "src/media/**",
    "dest": "dist/media/"
  },
  "styles": {
    "src": "src/less/**/*.less",
    "dest": "dist/css/"
  },
  "js": {
    "src": "src/js/*.js",
    "dest": "dist/js/"
  }
};


// Styles
gulp.task('styles', function() {
  return gulp.src(["src/less/app.less"])
    .pipe(less({ compress: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions','ie 10'], cascade: false }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(duration("building styles"))
    .pipe(notify({ message: "styles task complete" }))
    .pipe(reload({stream:true}));
});


// Javascript
gulp.task('js', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/scrollreveal/dist/scrollreveal.min.js',
    'node_modules/smoothscroll/smoothscroll.min.js',
    paths.js.src
    ])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(duration("building js"))
    .pipe(notify({ message: "js task complete" }))
    .pipe(reload({stream:true}));
});


// HTML
gulp.task('html', function() {
  return gulp.src([paths.html.src])
    .pipe(reload({stream:true}))
    .pipe(gulp.dest(paths.html.dest));
});

// Icons
gulp.task('icons', function() {
  return gulp.src([paths.icons.src])
    .pipe(svgsprite({
      shape: {
        id: {
          generator: 'icon-',
        },
        dimension: {
          attributes: false,
        },
      },
      mode: {
        symbol: {
          dest: '',
          example: false,
          sprite: 'sprite.svg',
        },
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false,
        dimensionAttributes: false,
        rootAttributes: {
          style: 'border: 0; clip: rect(0 0 0 0); height: 0; overflow: hidden; padding: 0; position: absolute; width: 0;',
        },
      },
    }))
    .pipe(gulp.dest(paths.icons.dest))
    .pipe(duration('Built Icons'))
    .pipe(reload({ stream: true }));
});



// Images
gulp.task('media', function() {
  return gulp.src([paths.media.src])
    .pipe(changed(paths.media.dest))
    .pipe(gulp.dest(paths.media.dest))
    .pipe(reload({stream:true}));
});


// Watch
gulp.task("watch", function() {
  gulp.watch(paths.styles.src, ["styles"]);
  gulp.watch(paths.js.src, ["js"]);
  gulp.watch(paths.html.src, ["html"]);
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
    gulp.watch([paths.html.src], reload);
});
