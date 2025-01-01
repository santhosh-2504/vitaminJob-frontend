const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (env === 'production') {
        webpackConfig.plugins.push(
          new JavaScriptObfuscator({
            rotateStringArray: true,
            splitStrings: true,
            identifierNamesGenerator: 'hexadecimal',
            stringArray: true,
            stringArrayEncoding: ['base64'],
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            renameGlobals: false,
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            numbersToExpressions: true,
            simplify: true,
            shuffleStringArray: true,
            splitStrings: true,
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
          })
        );
      }
      return webpackConfig;
    },
  },
}; 