var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    include       = require('gulp-file-include'),
    clean         = require('gulp-clean'),
    autoprefixer  = require('gulp-autoprefixer'),
    uncss         = require('gulp-uncss'),
    imagemin      = require('gulp-imagemin'),
    cssnano       = require('gulp-cssnano'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    browserSync   = require('browser-sync');

gulp.task('clean', function(){
  return gulp.src('dist')
    .pipe(clean())
})

gulp.task('copy', ['clean'], function(){
  gulp.src('src/components/**/*', {"base": "src"})
      .pipe(gulp.dest('dist'))
})

gulp.task('sass', function(){
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/css/'));
})

gulp.task('html', function(){
  return gulp.src(['./src/**/*.html', '!src/inc/**/*'])
            .pipe(include())
            .pipe(gulp.dest('./dist/'))
})

gulp.task('uncss', ['html'], function(){
  return gulp.src('./dist/components/**/*.css')
            .pipe(uncss({
              html: ['./dist/*.html']
            }))
            .pipe(gulp.dest('./dist/components/'))
})

gulp.task('imagemin', function(){
  return gulp.src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img/'))
})

gulp.task('build-js', function(){
  gulp.src('./src/js/**/*')
      .pipe(concat('app.min.js'))/* junta os arquivos em um só */
      .pipe(uglify())/* minifica o arquivo juntado JS */
      .pipe(gulp.dest('./dist/js/'))
})

gulp.task('default', ['copy'], function(){
  gulp.start('uncss', 'imagemin', 'sass', 'build-js')
})

gulp.task('server', function(){
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
  gulp.watch('./dist/**/*').on('change', browserSync.reload)
  gulp.watch('./src/sass/**/*.scss', ['sass'])
  gulp.watch('./src/js/**/*', ['build-js'])
  gulp.watch('./src/**/*.html', ['html'])
})
