const path = require('path');
const loader = require("ts-loader");

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  //devtool: "inline-source-map",
  target: "web",
    resolve: {
    extensions: ['.ts','.js'],
  },
    module: {
        rules: [{
          test: /\.ts$/,
          use: [
              'ts-loader',
              ]
        }],
    },
    output: {
        filename: 'SkopAPI.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SkopAPI',
    },
};