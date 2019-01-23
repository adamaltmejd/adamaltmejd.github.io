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
  main_sass: '_src/styles/main.scss',
  styles: {
    src: '_src/styles/**/*',
    dest: 'assets/styles/',
    sitedest: '_site/assets/styles/'
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

function compile_styles() {
  var plugins = [
    autoprefixer({ browsers: ['last 2 version', '> 5%'] }),
    cssnano()
  ];
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(gulp.dest(paths.styles.sitedest));
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
  gulp.watch(paths.styles.src, gulp.series(compile_styles, reload));
  gulp.watch(paths.jekyll.src, gulp.series(jekyll_build, reload));
}

// Exports
const dev = gulp.series(clean, compile_styles, jekyll_build, serve, watch)
export default dev;
