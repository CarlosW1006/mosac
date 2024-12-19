const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
   transpileDependencies: true,

   pluginOptions: {
      vuetify: {
         // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
      },
   },

   configureWebpack: {
      plugins: [
         new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
         }),
      ],
   },

   // devServer: {
   //    client: {
   //       overlay: false,
   //    },
   // },
});

