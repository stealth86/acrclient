
require('ignore-styles');
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
require('@babel/register')({
    ignore: [ /(node_modules)/ ],
    presets: ['@babel/preset-env']
});

require('./server');