const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  images: {
    domains: ['placehold.it', 'ft-pos-dev.s3-ap-southeast-1.amazonaws.com', 'ft-pos.s3-ap-southeast-1.amazonaws.com'],
  },
  lessVarsFilePathAppendToEndOfContent: false,
  cssLoaderOptions: {},
  modifyVars: { '@primary-color': '#17c2d7', "@font-size-base": "13px" },
  webpack(config) {
    return config;
  }
});