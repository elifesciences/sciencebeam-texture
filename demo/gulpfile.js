"use strict";

const browserSync = require('browser-sync');
const del = require('del');
const eslint = require('gulp-eslint');
const express = require('express');
const gulp = require('gulp');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const path = {
  srcDir: {
    scss: 'src/styles',
    js: 'src/js',
    markup: 'src',
    images: 'src/img',
    fonts: 'src/fonts'
  },
  out: {
    css: 'dist/css',
    markup: 'dist',
    js: 'dist/js',
    images: 'dist/img',
    fonts: 'dist/fonts'
  }
};

let server;

gulp.task('sass', ['sass:clean'], () => {
  return gulp.src(`${path.srcDir.scss}/build.scss`)
             .pipe(sourcemaps.init())
             .pipe(sassGlob())
             .pipe(sass())
             .pipe(rename('all.css'))
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest(`${path.out.css}`))
             .pipe(reload());
});

gulp.task('sass:clean', () => {
  del([`${path.out.css}/*`]);
});

gulp.task('img', () => {
  return gulp.src(`${path.srcDir.images}/**/*`)
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ],
      }))
      .pipe(gulp.dest(path.out.images))
      .pipe(reload());
});

gulp.task('img:clean', () => {
  del([`${path.out.images}/*`]);
});

gulp.task('fonts', ['fonts:clean'], () => {
  return gulp.src(`${path.srcDir.fonts}/*`)
             .pipe(gulp.dest(path.out.fonts))
             .pipe(reload());
});

gulp.task('fonts:clean', () => {
  del([`${path.out.fonts}/*`]);
});

gulp.task('markup', ['markup:clean'], () => {
  return gulp.src(`${path.srcDir.markup}/*.html`)
             .pipe(gulp.dest(path.out.markup))
             .pipe(reload());
});

gulp.task('markup:clean', () => {
  del([`${path.out.markup}/*.html`]);
});

gulp.task('js', ['webpack'], () => {
  gulp.src('.').pipe(reload());
});

gulp.task('webpack', ['js:lint'], function (callback) {

  webpack(webpackConfig, function (err, stats) {
    if (err)
      throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build] Completed\n' + stats.toString(
      {
        assets: true,
        chunks: false,
        chunkModules: false,
        colors: true,
        hash: false,
        timings: false,
        version: false
      }
    ));
  callback();
  });

});

gulp.task('js:lint', ['js:clean'], () => {
  return gulp.src(`${path.srcDir.js}/*.js`)
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
});

gulp.task('js:clean', () => {
  del([`${path.out.js}/*`]);
});

gulp.task('sass:watch', () => {
  gulp.watch(`${path.srcDir.scss}**/*`, ['sass']);
});

gulp.task('img:watch', () => {
  gulp.watch(`${path.srcDir.img}**/*`, ['img']);
});

gulp.task('fonts:watch', () => {
  gulp.watch(`${path.srcDir.fonts}/*`, ['fonts']);
});

gulp.task('js:watch', () => {
  gulp.watch([`${path.srcDir.js}**/*`], ['js']);
});

gulp.task('markup:watch', () => {
  gulp.watch([`${path.srcDir.markup}**/*`], ['markup']);
});

// Task sets
gulp.task('watch', ['sass:watch', 'img:watch', 'js:watch', 'fonts:watch', 'markup:watch', 'server']);
gulp.task('build', ['sass', 'img', 'fonts', 'js', 'markup']);
gulp.task('default', ['build']);

gulp.task('server', () => {
  if (!server) {
    server = express();
    server.use(express.static('./'));
    server.listen('8080');
    browserSync({proxy: 'localhost:8080', startPath: 'dist/index.html', browser: 'google chrome'});
  } else {
    return gutil.noop;
  }
});

function reload() {
  if (server) {
    return browserSync.reload({stream: true});
  } else {
    return gutil.noop();
  }
}
