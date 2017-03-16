const gulp = require("gulp");
const babel = require("gulp-babel");
const es2015 = require('babel-preset-es2015');
const babelminify = require('gulp-babel-minify');

gulp.task("compileJS:minify", () => {
	return gulp.src("js-src/**/*.js")
			.pipe(babel())
			.pipe(babelminify())
			.pipe(gulp.dest("dist"));
});