"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");
function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title; // page title
module.exports = {
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: 8080,
    // open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: "http://8.131.91.233:8091/",
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  },
  configureWebpack() {
    return {
      resolve: {
        modules: ["node_modules"],
        alias: {
          "@": resolve("src"),
          static: resolve("static")
        },
        extensions: [".js", ".vue", ".json", ".scss"]
      },
      amd: {
        toUrlUndefined: true,
      },
      node: {
        fs: "empty",
      },
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.runtimeChunk("single");
      config.optimization.useExports = true;
      config.optimization.minimize = true;
    });
  },
  css: {
    sourceMap: process.env.NODE_ENV === "development",
    loaderOptions: {
      scss: {
        prependData: `@import "~@/styles/variables.scss";`
      }
    }
  }
};
