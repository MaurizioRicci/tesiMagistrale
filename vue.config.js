module.exports = {
    runtimeCompiler: true,
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.whitespace = 'preserve'
                return options
            })
    },
    css: {
        loaderOptions: {
          sass: {
            prependData: '@import "@/assets/styles/_myVariables.scss";'
          }
        }
      }
}
