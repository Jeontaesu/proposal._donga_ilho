import gulp from "gulp";
const { src, dest, series, parallel, watch } = gulp;
import clean from "gulp-clean";
import htmlmin from "gulp-htmlmin";
import fileinclude from "gulp-file-include";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import browserSync from "browser-sync";
import uglify from "gulp-uglify";
import cleanCSS from "gulp-clean-css";
import concat from "gulp-concat";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import imagemin from "gulp-imagemin";
import autoprefixer from "gulp-autoprefixer";
import htmlbeautify from "gulp-html-beautify";
import fonter from "gulp-fonter";

const browserSyncInstance = browserSync.create();
const sassCompiler = gulpSass(sass);

const ROOT = "./src";
const DEST = `./dist`;

const PATH = {
  HTML: `${ROOT}`,
  SCSS: `${ROOT}/scss`,
  JS: `${ROOT}/js`,
  IMG: `${ROOT}/images`,
  MARKUP: `${ROOT}/markup`,
  INCLUDE: `${ROOT}/include`,
  FONTS: `${ROOT}/fonts`, // 폰트 소스 경로 추가
  BUILD: {
    BUILD_HTML: `${DEST}/html`,
    BUILD_CSS: `${DEST}/css`,
    BUILD_JS: `${DEST}/js`,
    BUILD_IMG: `${DEST}/images`,
    BUILD_MARKUP: `${DEST}/markup`,
    BUILD_FONTS: `${DEST}/fonts`, // 폰트 빌드 경로 추가
  },
};

// 'clean' 태스크
function cleanTask() {
  console.log("clean 실행 !!");
  return src(`${DEST}`, { read: false, allowEmpty: true }) // dist 폴더를 삭제
    .pipe(clean());
}

// HTML 파일 변환 작업
function htmlTask() {
  console.log("HTML 파일이 수정되었습니다."); // 로그 추가
  return src(`${PATH.HTML}/**/*.html`)
    .pipe(fileinclude({ prefix: "@@", basepath: PATH.INCLUDE })) // basepath 수정
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({ dirname: "" }))
    .pipe(htmlbeautify({ indent_size: 2 }))
    .pipe(dest(PATH.BUILD.BUILD_HTML)) // HTML 파일을 dist/html에 저장
    .pipe(browserSyncInstance.stream());
}

// SASS 파일 변환 작업
export const sassTask = () => {
  return src(`${PATH.SCSS}/*.scss`).pipe(sourcemaps.init()).pipe(sassCompiler().on("error", sassCompiler.logError)).pipe(autoprefixer()).pipe(cleanCSS()).pipe(sourcemaps.write("./map")).pipe(dest(PATH.BUILD.BUILD_CSS)).pipe(browserSyncInstance.stream());
};

// 'js' 태스크
function jsTask() {
  console.log("js 실행 !!");
  return src(`${PATH.JS}/*.js`)
    .pipe(sourcemaps.init())
    .pipe(concat("app.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(PATH.BUILD.BUILD_JS))
    .pipe(browserSyncInstance.stream());
}

// 원본 main.js 파일 복사 작업
function copyMainJsTask() {
  console.log("main.js 파일 복사 실행 !!");
  return src(`${PATH.JS}/main.js`) // 원본 파일 경로
    .pipe(dest(PATH.BUILD.BUILD_JS)); // 빌드 경로
}

// 'images' 태스크
function imagesTask() {
  return src(`${PATH.IMG}/**/*`).pipe(imagemin()).pipe(dest(PATH.BUILD.BUILD_IMG));
}

// 폰트 태스크 추가
// 폰트 태스크 추가
function fontsTask() {
  console.log("fonts 실행 !!");
  return src(`${PATH.FONTS}/*.woff2`)
    .pipe(
      fonter({
        formats: ["woff"],
      })
    )
    .pipe(dest(PATH.BUILD.BUILD_FONTS))
    .pipe(browserSyncInstance.stream());
}

// markup 관련 파일 복사 태스크
function markupTask() {
  return src(`${PATH.MARKUP}/**`)
    .pipe(dest(`${PATH.BUILD.BUILD_MARKUP}`))
    .pipe(browserSyncInstance.stream());
}

// 빌드 태스크 정의
const buildTask = parallel(htmlTask, sassTask, jsTask, imagesTask, markupTask, fontsTask, copyMainJsTask);

// 파일 변경 감지 및 브라우저 동기화
function watchTask() {
  console.log("watching 실행 !!");
  watch([`${PATH.HTML}/**/*.html`], htmlTask);
  watch([`${PATH.INCLUDE}/**/*.html`], htmlTask);
  watch([`${PATH.SCSS}/**/*.scss`], sassTask);
  watch([`${PATH.JS}/*.js`], jsTask);
  watch(`${PATH.IMG}/**/*`, imagesTask);
  watch(`${PATH.MARKUP}/**`, markupTask);
  watch(`${PATH.FONTS}/**/*`, fontsTask);
}

// 브라우저 동기화 및 서버 설정
function serve(done) {
  // done 매개변수 추가
  console.log("server 실행 !!");
  browserSyncInstance.init({
    server: {
      baseDir: `${DEST}`, // dist 디렉터리를 서버의 루트로 설정
      directory: true, // 디렉터리 브라우징 활성화
    },
  });
  done(); // 비동기 작업 완료를 알림
}

// 'dev' 태스크 정의
export const dev = series(
  cleanTask,
  buildTask,
  parallel(serve, watchTask) // serve와 watchTask를 병렬로 실행
);

// 'build' 태스크 정의
export const build = series(cleanTask, buildTask);
