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
const proxy = require('express-http-proxy');
const url = require('url');
const bodyParser = require('body-parser');

const proxyToApiUrl = process.env.PROXY_TO_API_URL;
const demoPort = process.env.DEMO_PORT || '8080';
const nodeEnv = process.env.NODE_ENV || 'development';

const path = {
  srcDir: {
    scss: 'src/styles',
    js: 'src/js',
    markup: 'src',
    images: 'src/img',
    fonts: 'src/fonts',
    exampleData: 'src/example-data'
  },
  out: {
    css: 'dist/css',
    markup: 'dist',
    js: 'dist/js',
    images: 'dist/img',
    fonts: 'dist/fonts',
    exampleData: 'dist/example-data'
  }
};

let server;

gulp.task('sass', ['sass:vendor'], () => {
  return gulp.src(`${path.srcDir.scss}/build.scss`)
             .pipe(sourcemaps.init())
             .pipe(sassGlob())
             .pipe(sass())
             .pipe(rename('all.css'))
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest(`${path.out.css}`))
             .pipe(reload());
});

gulp.task('sass:vendor', ['sass:clean'], () => {
  return gulp.src(`${path.srcDir.scss}/vendor.scss`)
             .pipe(sourcemaps.init())
             .pipe(sassGlob())
             .pipe(sass())
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
  return gulp.src(`${path.srcDir.fonts}/**/*`)
             .pipe(gulp.dest(path.out.fonts))
             .pipe(reload());
});

gulp.task('fonts:clean', () => {
  del([`${path.out.fonts}/*`]);
});

gulp.task('exampleData', ['exampleData:clean'], () => {
  return gulp.src(`${path.srcDir.exampleData}/**/*`)
             .pipe(gulp.dest(path.out.exampleData))
             .pipe(reload());
});

gulp.task('exampleData:clean', () => {
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

gulp.task('webpack', [/*'js:lint'*/], function (callback) {

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

gulp.task('exampleData:watch', () => {
  gulp.watch(`${path.srcDir.exampleData}/*`, ['exampleData']);
});

gulp.task('js:watch', () => {
  gulp.watch([`${path.srcDir.js}**/*`], ['js']);
});

gulp.task('markup:watch', () => {
  gulp.watch([`${path.srcDir.markup}**/*`], ['markup']);
});

// Task sets
gulp.task('watch', [
  'sass:watch', 'img:watch', 'js:watch', 'fonts:watch', 'exampleData:watch',
  'markup:watch', 'server'
]);
gulp.task('build', ['sass', 'img', 'fonts', 'exampleData', 'js', 'markup']);
gulp.task('default', ['build']);

gulp.task('server', () => {
  if (!server) {
    server = express();
    if (proxyToApiUrl) {
      gutil.log('proxying /api to', proxyToApiUrl);
      const parsedApiUrl = url.parse(proxyToApiUrl);
      const apiPath = parsedApiUrl.path;
      const apiProxy = proxy(parsedApiUrl.host, {
        proxyReqPathResolver: req => {
          const targetUrl = url.parse(req.baseUrl).path.replace('/api', apiPath);
          gutil.log('proxy request to', targetUrl);
          return targetUrl;
        }
      });
      server.use(bodyParser.raw({limit: '50mb', type: 'application/pdf'}));
      server.use("/api/*", apiProxy);
    } else {
      gutil.log('no api url defined, not proxying api');
    }
    server.use(express.static('./dist/'));
    server.listen(demoPort);
    if (nodeEnv == 'development') {
      browserSync({proxy: 'localhost:8080', startPath: 'index.html', browser: 'google chrome'});
    }
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
