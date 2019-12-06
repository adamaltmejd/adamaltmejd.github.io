'use strict';

import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import cp from 'child_process';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
const server = browserSync.create();

const paths = {
  main_sass: '_src/css/style.scss',
  styles: {
    src: '_src/css/**/*',
    dest: 'assets/css/',
    sitedest: '_site/assets/css/'
  },
  jekyll: {
    src: ['**/*.{html,md,yml}', '!_src/**/*', '!_site/**/*'],
    dest: ['_site/']
  }
};

const clean = () => del(['_site']);

function jekyll_build(done) {
  return cp.spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' }).on('close', done);
};

function compile_styles_dev() {
  var plugins = [
    autoprefixer(),
  ];
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(gulp.dest(paths.styles.sitedest));
};

function compile_styles_prod() {
  var plugins = [
    autoprefixer(),
    cssnano()
  ];
  return gulp
    .src(paths.styles.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(paths.styles.dest));
};

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: '_site/'
    },
    notify: false
  });
  done();
}

function watch() {
  // gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, gulp.series(compile_styles_dev, reload));
  gulp.watch(paths.jekyll.src, gulp.series(jekyll_build, reload));
}

// Exports
export const prod = gulp.series(clean, compile_styles_prod, jekyll_build, serve);

export const dev = gulp.series(clean, compile_styles_dev, jekyll_build, serve, watch);

export default dev;
