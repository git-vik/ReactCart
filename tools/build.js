// For info about this file refer to webpack and webpack-hot-middleware documentation
// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod';
import color from 'colors';
process.env.NODE_ENV = 'production';

webpack(webpackConfig).run((err, stats) => {
    if(err){
        return 1;
    }

    const jsonStats = stats.toJson();
    if(jsonStats.hasErrors){
        return jsonStats.errors.map(error => console.log(error.red));
    }
    if(jsonStats.hasWarnings){
        return jsonStats.warnings.map(warning => console.log(warning.yellow));
    }

    return 0;
});