var path = require('path'),
	webpack = require('webpack'),
	autoprefixer = require('autoprefixer'),
	precss = require('precss'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin')
;

module.exports = {
    context: __dirname,
    entry: [
        path.resolve(__dirname, 'src/review/plugin.js'),
        path.resolve(__dirname, 'src/localization/localizationService.js'),
        path.resolve(__dirname, 'src/libs/ResizeSensor.js'),
        path.resolve(__dirname, 'src/fontLoader.js'),
        path.resolve(__dirname, 'src/css/review.less')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'plugins.js',
        pathInfo: true
    },
    resolve: {
        modulesDirectories: ['node_modules']
    },
    plugins: [
		new CleanWebpackPlugin(['dist'], {
		    root: path.resolve(__dirname),
		    verbose: true,
		    dry: false
		}),
		new ExtractTextPlugin('styles.css')
    ],
    module: {
        loaders: [
			{
			    test: /\.js$/,
			    exclude: /node_modules/,
			    include: [
                     __dirname
			    ],
			    loader: 'babel',
			    query: {
			        presets: ['es2015']
			    }
			},
			{
			    test: /\.less$/,
			    exclude: /node_modules/,
			    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
			},
			{
			    test: /\.(jpg|jpe?g|gif|png)$/,
			    exclude: /node_modules/,
			    loader: 'url?limit=1024&name=./img/[name].[ext]'
			},
			{
			    test: /\.html$/,
			    exclude: /node_modules/,
			    loader: 'html'
			},
			{
			    test: /\.json$/,
			    exclude: /node_modules/,
			    loader: 'json'
			}
        ]
    },
    postcss: function () {
        return [
            autoprefixer(
            {
                browsers: [
                    'last 1 Chrome version',
                    'last 1 Firefox version',
                    'Explorer >= 10',
                    'last 1 Safari version',
                    'Android 2.3',
                    'Android >= 4',
                    'last 1 ChromeAndroid version',
                    'last 1 iOS version'
                ]
            }),
            precss];
    }
};