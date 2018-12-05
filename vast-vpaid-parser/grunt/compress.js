module.exports = {
  main: {
    options: {
      archive: '../../../backup/vast-vpaid/vast-vpaid-<%= package.version %>.zip'
    },
    files: [{
      expand: true,
      src: [
        'app/**',
        'css/**',
        'externals/**',
        'grunt/**',
        'js/**',
        'test/**',
        '.*',
        '*.js',
        'LICENSE',
        '*.json',
        '*.html'
      ]
    }]
  }
};
