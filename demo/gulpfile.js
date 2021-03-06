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
const proxyToBiorxivApiUrl = process.env.PROXY_TO_BIORXIV_API_URL || proxyToApiUrl;
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

gulp.task('sass:clean', () => {
  return del([`${path.out.css}/*`]);
});

gulp.task('sass:vendor', gulp.series(['sass:clean'], () => {
  return gulp.src(`${path.srcDir.scss}/vendor.scss`)
             .pipe(sourcemaps.init())
             .pipe(sassGlob())
             .pipe(sass())
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest(`${path.out.css}`))
             .pipe(reload());
}));

gulp.task('sass', gulp.series(['sass:vendor'], () => {
  return gulp.src(`${path.srcDir.scss}/build.scss`)
             .pipe(sourcemaps.init())
             .pipe(sassGlob())
             .pipe(sass())
             .pipe(rename('all.css'))
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest(`${path.out.css}`))
             .pipe(reload());
}));

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
  return del([`${path.out.images}/*`]);
});

gulp.task('fonts:clean', () => {
  return del([`${path.out.fonts}/*`]);
});

gulp.task('fonts', gulp.series(['fonts:clean'], () => {
  return gulp.src(`${path.srcDir.fonts}/**/*`)
             .pipe(gulp.dest(path.out.fonts))
             .pipe(reload());
}));

gulp.task('exampleData:clean', () => {
  return del([`${path.out.exampleData}/*`]);
});

gulp.task('exampleData', gulp.series(['exampleData:clean'], () => {
  return gulp.src(`${path.srcDir.exampleData}/**/*`)
             .pipe(gulp.dest(path.out.exampleData))
             .pipe(reload());
}));

gulp.task('markup:clean', () => {
  return del([`${path.out.markup}/*.html`]);
});

gulp.task('markup', gulp.series(['markup:clean'], () => {
  return gulp.src(`${path.srcDir.markup}/*.html`)
             .pipe(gulp.dest(path.out.markup))
             .pipe(reload());
}));

gulp.task('webpack', gulp.series([/*'js:lint'*/], function (callback) {

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

}));

gulp.task('js', gulp.series(['webpack'], () => {
  return gulp.src('.').pipe(reload());
}));

gulp.task('js:clean', () => {
  return del([`${path.out.js}/*`]);
});

gulp.task('js:lint', gulp.series(['js:clean'], () => {
  return gulp.src(`${path.srcDir.js}/*.js`)
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
}));


function simple_gulp_watch_task(watch_task_id, file_pattern, trigger_task_ids) {
  gutil.log(`${watch_task_id}: watching: "${file_pattern}", triggering: ${trigger_task_ids}`);
  gulp.task(watch_task_id, () => {
    return gulp.watch(file_pattern, gulp.series(trigger_task_ids));
  });
}

simple_gulp_watch_task('sass:watch', `${path.srcDir.scss}/**/*`, ['sass']);

simple_gulp_watch_task('img:watch', `${path.srcDir.img}/**/*`, ['img']);

simple_gulp_watch_task('fonts:watch', `${path.srcDir.fonts}/*`, ['fonts']);

simple_gulp_watch_task('exampleData:watch', `${path.srcDir.exampleData}/*`, ['exampleData']);

simple_gulp_watch_task('js:watch', `${path.srcDir.js}/**/*`, ['js']);

simple_gulp_watch_task('markup:watch', `${path.srcDir.markup}/**/*`, ['markup']);


gulp.task('server', () => {
  if (!server) {
    server = express();
    if (proxyToApiUrl) {
      gutil.log(`proxying /api to ${proxyToApiUrl} and /api_biorxiv to ${proxyToBiorxivApiUrl}`);
      const parsedApiUrl = url.parse(proxyToApiUrl);
      const parsedBiorxivApiUrl = url.parse(proxyToBiorxivApiUrl);
      const apiPath = parsedApiUrl.path;
      const biorxivApiPath = parsedBiorxivApiUrl.path;
      const apiProxy = proxy(parsedApiUrl.host, {
        proxyReqPathResolver: req => {
          const parsedUrl = url.parse(req.originalUrl);
          const targetUrl = (
            parsedUrl.path
            .replace('/api_biorxiv/', biorxivApiPath + '/')
            .replace('/api/', apiPath + '/')
            + (parsedUrl.search || '')
          );
          gutil.log('proxy request to', targetUrl);
          return targetUrl;
        },
        parseReqBody: false,
        reqBodyEncoding: null
      });
      server.use(bodyParser.raw({limit: '50mb', type: 'application/pdf'}));
      server.use("/api/*", apiProxy);
      server.use("/api_biorxiv/*", apiProxy);
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

// Task sets
gulp.task('watch', gulp.parallel([
  'sass:watch', 'img:watch', 'js:watch', 'fonts:watch', 'exampleData:watch',
  'markup:watch', 'server'
]));
gulp.task('build', gulp.series(['sass', 'img', 'fonts', 'exampleData', 'js', 'markup']));
gulp.task('default', gulp.series(['build']));

function reload() {
  if (server) {
    return browserSync.reload({stream: true});
  } else {
    return gutil.noop();
  }
}
