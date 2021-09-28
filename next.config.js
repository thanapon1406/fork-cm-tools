const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  lessVarsFilePathAppendToEndOfContent: false,
  cssLoaderOptions: {},
  modifyVars: { '@primary-color': '#17c2d7',"@font-size-base":"13px" },
  webpack(config) {
    return config;
  }
});