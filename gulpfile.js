const { src, dest, watch, series, parallel, task } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
var browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

// Clears the dist folder
function clear() {
  return src('./dist', {read: false, allowEmpty: true})
    .pipe(clean());
}

function scss() {
  return src("./src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./dist/assets/"))
    .pipe(browserSync.reload({ stream: true }));
}

function js_vendors() {
    return src("./src/js/vendors/*.js")
    .pipe(concat("vendors.js"))
    .pipe(dest("./dist/assets/"));
}

function js() {
    return src("./src/js/*.js")
    .pipe(concat("script.js"))
    .pipe(dest("./dist/assets/"));
}

function html() {
    return src("./src/views/*.html").pipe(dest("./dist"));
}

function static() {
    return src("./src/*").pipe(dest("./dist"));
}

function vendor() {
    return src("./src/vendor/*").pipe(dest("./dist/vendor"));
}

function images() {
    return src("./src/images/**/*.*", {encoding: false}).pipe(dest("./dist/assets/images"));
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

task('default', series(scss, js_vendors, js, html, static, vendor, images, serve));

task('build', series( clear, scss, js_vendors, js, html, static, vendor, images));

