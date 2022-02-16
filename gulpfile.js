dotenv = require('dotenv')
const {src, dest, series, parallel, watch} = require('gulp');
const uglify = require('gulp-uglify');
const notify = require("gulp-notify");
const {rollup} = require('rollup');
const htmlMin = require('gulp-htmlmin');
const path = require("path");
const folderDestination = 'output';
const cleanCSS = require('gulp-clean-css');
const webserver = require('gulp-webserver');
const autoprefixer = require("gulp-autoprefixer");


const ugly = async function (cb) {
    setTimeout(function () {
        return src('output/*.js')
            // The gulp-uglify plugin won't update the filename
            .pipe(uglify())
            // So use gulp-rename to change the extension
            .pipe(dest('output/'))
    }, 500)


}
const roll = async function () {
    const bundle = await rollup({
        input: 'src/index.js'
    });
    return bundle.write({
        file: 'output/index.js',
        format: 'iife'
    })
}

async function js() {
    series(roll, ugly)
}

const autoPrefix = () => {
    return src('src/style.css')
        .pipe(autoprefixer({
            cascade: false
        })).pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest('output'))
}
const htmlMini = () => {
    return src('src/*.html')
        .pipe(htmlMin({collapseWhitespace: true}))
        .pipe(dest('output'));
}

function cssMini() {
    return src('src/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest('output'));
}

function serve() {

    src('output')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: false
        }));
}

exports.prefix = autoPrefix
exports.ugly = ugly
exports.js = js
exports.roll = roll
exports.htmlMini = htmlMini
exports.build = series(roll, htmlMini, autoPrefix, ugly)
exports.serve = serve
exports.watch = function () {

    watch('src/*.css', autoPrefix)
    watch('src/*.html', htmlMini)
    watch('src/*.js', roll)
    watch('src/*.js', ugly)
}

// parallel(htmlMini,js)