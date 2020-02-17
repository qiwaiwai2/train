module.exports = {
    //基本路径
    publicPath:'./',
    chainWebpack: config => {
        // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
        config.plugin('define').tap(args => {
            args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
            return args
        })
    },
    css: {
        loaderOptions: {
          // 给 sass-loader 传递选项
          sass: {
            // @/ 是 src/ 的别名
            // 所以这里假设你有 `src/variables.scss` 这个文件
            data: `@import "@/style/_variable.scss";`
          }
        }
    
    },
    devServer: {
      historyApiFallback: true
    }
}