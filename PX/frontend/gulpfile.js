const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('default', shell.task([
  'cp ./bundles/dev/bundle.js ../armada_services/public/js',
  'cp ./bundles/dev/style.css ../armada_services/public/css'
]));

gulp.task('test', shell.task([
  'scp -i ~/Downloads/frontend.pem ./bundles/dev/bundle.js ubuntu@10.0.30.199:/home/ubuntu/armada-services/public/js'
]));