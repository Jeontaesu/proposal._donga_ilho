// Gulpfile.mjs
import { src, dest, series, parallel, watch } from 'gulp';
import clean from 'gulp-clean';
import htmlmin from 'gulp-htmlmin';
import fileinclude from 'gulp-file-include';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import autoprefixer from 'gulp-autoprefixer';
import htmlbeautify from 'gulp-html-beautify';

const browserSyncInstance = browserSync.create();
const sassCompiler = gulpSass(sass);

// 'clean' 태스크
function cleanTask() {
  return src('dist', { read: false, allowEmpty: true })
      .pipe(clean());
}

// HTML 파일 변환 작업
function htmlTask() {
  return src('src/*.html')
      .pipe(fileinclude({ prefix: '@@', basepath: '@file' }))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(htmlbeautify({ indent_size: 2 }))
      .pipe(dest('dist'))
      .pipe(browserSyncInstance.stream());
}

// SASS 파일 변환 작업
function sassTask() {
  return src('src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sassCompiler().on('error', sassCompiler.logError))
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/css'))
      .pipe(browserSyncInstance.stream());
}

// 'js' 태스크
function jsTask() {
  return src('src/js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/js'));
}

// 'images' 태스크
function imagesTask() {
  return src('src/images/**/*')
      .pipe(imagemin())
      .pipe(dest('dist/images'));
}

// 빌드 태스크 정의
const buildTask = parallel(htmlTask, sassTask, jsTask, imagesTask);

// 파일 변경 감지 및 브라우저 동기화
function watchTask() {
    watch('src/*.html', htmlTask);
    watch('src/scss/**/*.scss', sassTask);
    watch('src/js/**/*.js', jsTask);
    watch('src/images/**/*', imagesTask);
}

// 브라우저 동기화 및 서버 설정
function serve() {
    browserSyncInstance.init({
        server: {
            baseDir: 'dist'
        }
    });
}

// 'dev' 태스크 정의
export const dev = series(
  cleanTask,
  buildTask,
  parallel(serve, watchTask) // serve와 watchTask를 병렬로 실행
);

// 'build' 태스크 정의
export const build = series(
  cleanTask,
  buildTask
);
