const { src, dest, watch, series, parallel, task } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
var browserSync = require('browser-sync').create();

function scss() {
  return src("./src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./dist/assets/"))
    .pipe(browserSync.reload({ stream: true }));
}

function js() {
    return src("./src/js/*.js")
    .pipe(concat("script.js"))
    .pipe(dest("./dist/assets/"));
}

function html() {
    return src("./src/views/*.html").pipe(dest("./dist"));
}

function browserSyncInit(done) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    done();
}

function serve () {

    browserSync.init({
        server: "./dist"
    });

    watch("./src/scss/*.scss", scss);
    watch("./src/js/*.js", js).on('change', browserSync.reload);
    watch("./src/views/**/*.html", html).on('change', browserSync.reload);
}

task('default', series(scss, js, html, serve));

