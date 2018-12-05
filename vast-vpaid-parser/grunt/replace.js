module.exports = {
  sourceHeader: {
    src: [
      'js/src/vast-vpaid-header.js',
    ],
    overwrite: true,
    replacements: [{
      from: /vast-vpaid\s*\d+\.\d+\.\d+/g,
      to: 'vast-vpaid <%= package.version %>'
    }]
  },
  debugOff: {
    src: [
      'js/dist/vast-vpaid.js',
    ],
    overwrite: true,
    replacements: [{
      from: /window.DEBUG\s+=\s+true;/,
      to: '/*window.DEBUG = true;*/'
    }]
  },
  debugOn: {
    src: [
      'js/dist/vast-vpaid.js',
    ],
    overwrite: true,
    replacements: [{
      from: /\/\*window.DEBUG\s+=\s+true;\*\//,
      to: 'window.DEBUG = true;'
    }]
  },
  module: {
    src: [
      'js/src/main.js'
    ],
    dest: 'js/src/module.js',
    replacements: [{
      from: /\/\* module:begins \*\/([\s\S]+?|.+?)\/\* module:ends \*\//g,
      to: ''
    }, {
      from: /\/\* module:export \*\//,
      to: 'export default RmpVast;'
    }, {
      from: /window.RmpVast\s+=\s+function/,
      to: 'const RmpVast = function'
    }, {
      from: /window.RmpVast/g,
      to: 'RmpVast'
    }]
  }
};
