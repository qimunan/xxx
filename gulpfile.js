/***********下面是gulp4的语法 *************/

//  引入各插件模块，并定义插件模块变量
const gulp = require('gulp'),
    connect = require('gulp-connect'),
    htmlmin = require('gulp-htmlmin'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'), //自动增加前缀
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

// 浏览器自动刷新 
gulp.task('connect', function () {
    connect.server({ root: 'dist', port: 8888, livereload: true });
});

//  创建html批量压缩任务
var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
};
gulp.task('html', function () {
    return gulp.src('./src/html/**/*.html')  //生产路径
        .pipe(htmlmin(options))  //压缩html
        .pipe(gulp.dest('dist/html'))  //打包路径
        .pipe(connect.reload());
});

//  创建css批量压缩任务
gulp.task('css', function () {
    return gulp.src('src/css/**/*.css')  //生成路径
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions', 'Android >= 4.0'], cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        })).pipe(sass())  //把.scss后缀的文件转换为.css
        .pipe(minifycss({
            advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: '*', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'       //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        })).pipe(gulp.dest('dist/css')).pipe(connect.reload());
});

//  创建js批量压缩任务
gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')  //生产路径
        .pipe(uglify({       // mangle: { except: ['require', 'exports', 'module', '$'] },
            compress: true, //类型：Boolean 默认：true 是否完全压缩
            // preserveComments: 'all' //保留所有注释
        })).pipe(gulp.dest('dist/js'))  //打包路径
        .pipe(connect.reload());
});

//  创建图片批量压缩任务
gulp.task('image', function () {
    return gulp.src('src/images/*').pipe(gulp.dest('dist/images'))
});

//  创建icon和font批量压缩任务
gulp.task('iconFont', function () {
    return gulp.src('src/iconfont/*').pipe(gulp.dest('dist/iconfont'))
});

//  创建api批量压缩任务
gulp.task('api', function () {
    return gulp.src('src/api/*').pipe(gulp.dest('dist/api'))
});

//  创建lib下静态资源压缩任务
gulp.task('copy', function () {  //静态资源

    return gulp.src('src/lib/*.js').pipe(concat('all.js'))     //打包成all.js
        .pipe(gulp.dest('dist/lib'))
});

//  实时监听任务，若发现指定的目录下的资源发生修改，自动触发相应的任务
gulp.task('watch', function () {
    gulp.watch(['./src/html/**/*.html'], gulp.series(['html']));
    gulp.watch(['./src/css/**/*.scss'], gulp.series(['css']));
    gulp.watch(['./src/js/**/*.js'], gulp.series(['js']));
});

//  一次性执行多个任务
gulp.task('default', gulp.series(gulp.parallel('connect', 'html', 'css', 'js', 'image', 'iconFont', 'copy', 'watch', 'api')));