const webpack = require("webpack");

module.exports = {
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
//   plugins: [
//     new webpack.ProvidePlugin({
//       Buffer: ["buffer", "Buffer"],
//       process: "process/browser",
//     }),
//   ],
//   resolve: {
//     extensions: [".js"],
//     fallback: {
//       http: require.resolve("stream-http"),
//       https: require.resolve("https-browserify"),
//       crypto: require.resolve("crypto-browserify"),
//       stream: require.resolve("stream-browserify"),
//       os: require.resolve("os-browserify/browser"),
//       url: require.resolve("url"),
//       assert: require.resolve("assert"),
//     },
//   },
};
