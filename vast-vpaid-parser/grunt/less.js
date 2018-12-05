module.exports = {
  development: {
    options: {
      compress: false,
      lint: true,
      ieCompat: false
    },
    files: {
      'css/vast-vpaid.css': 'css/vast-vpaid.less',
    }
  },
  production: {
    options: {
      compress: true,
      lint: true,
      ieCompat: false
    },
    files: {
      'css/vast-vpaid.min.css': 'css/vast-vpaid.less'
    }
  }
};
