module.exports = {
    mode: 'development',
    entry: './index.js',
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: [
                    'babel-loader',
                ]
            }
        ]
    },
    plugins: [
        new class WebPackPlugin {
            apply(compiler) {
                compiler.hooks.compilation.tap("WebPackPlugin", compilation => {
                     compilation.hooks.finishModules.tap("WebPackPlugin", modules => {
                         modules.forEach(module => {
                            const source = module._source;
                            if (!/\.tsx$/.test(source._name)) return
                            debugger;
                            console.log(source._value);
                         })
                     })
               })
            }
         }()
    ]
}