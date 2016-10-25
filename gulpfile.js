'use strict';

var gulp, concat, browserSync, header, gutil, sass, scomment, uglify, pkg, cp, cleanCSS, jekyll, messages, source, thirds, banner;

gulp        = require('gulp');
concat      = require('gulp-concat');
browserSync = require('browser-sync').create();
header      = require('gulp-header');
gutil       = require('gulp-util');
sass        = require('gulp-sass');
scomment    = require('gulp-strip-css-comments');
uglify      = require('gulp-uglify');
pkg         = require('./package.json');
cp          = require('child_process');
cleanCSS    = require('gulp-clean-css');

// Check if running on windows, if we are use jekyll.bat as child_process, if its not just use jekyll]
jekyll      = process.platform === "win32" ? "jekyll.bat" : "jekyll";

source      = {
  scripts: [
    './_scripts/main.js',
    './_scripts/main.*.js'
  ],
  sass: {
    watch: ['./_sass/_*.scss'],
    dist: ['./_sass/main.scss']
  },
  html: [
    './*.html',
    './*/*.html',
    './*.md',
    './*/*.md'
  ],
  dest: './assets'
};

thirds      = {
  js: [
    './bower_components/jquery/dist/jquery.js'
  ],
  css: [],
  fonts: []
};

banner      = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link    <%= pkg.homepage %>',
  ' * @author  <%= pkg.author.name %> <<%= pkg.author.email %>>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

gulp.task('thirds', function () {
  gulp.src(thirds.js)
      .pipe(concat(pkg.name + '.thirds.js'))
      .pipe(uglify({mangle: true}))
      .pipe(gulp.dest(source.dest + '/js'));

  gulp.src(thirds.css)
    .pipe(concat(pkg.name + '.thirds.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(source.dest + '/css'));
});

gulp.task('scripts', function () {
  gulp.src(source.scripts)
    .pipe(concat(pkg.name + '.js'))
    //.pipe(uglify({mangle: false}))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest(source.dest + '/js'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  gulp.src(source.sass.dist)
    .pipe(concat(pkg.name + '.scss'))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(scomment({all: true}))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest(source.dest + '/css'))
    .pipe(browserSync.stream());
});

// Browser Sync task for starting the server
gulp.task('browser-sync', ['jekyll-build'], function () {
  browserSync.init({
    server: {baseDir: './_site'},
    // all off by default, but enables multiple browsers to all browse in sync
    ghostMode: {
      clicks: false,
      links: false,
      forms: false,
      scroll: false
    },
    // opens the browser when you run gulp
    open: false,
    // displays message in browser when reload happens or styles injected
    notify: true,
    // shows browsers connected in command line
    logConnections: true
  });
});

// Jekyll task - basically runs the command line command 'jekyll build' with node
gulp.task('jekyll-build', function (done) {
  cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// Watch the sass and html/js files for changes, then run the appropriate task
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch(source.scripts, ['scripts', 'jekyll-rebuild']);
  gulp.watch(source.sass.watch, ['sass', 'jekyll-rebuild']);
  gulp.watch(source.sass.dist, ['sass', 'jekyll-rebuild']);
  gulp.watch(source.html, ['jekyll-rebuild']);
});

// The default task run when you do 'gulp' on the command line
gulp.task('default', ['thirds', 'scripts', 'sass', 'watch']);
