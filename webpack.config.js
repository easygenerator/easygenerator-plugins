var path = require('path'),
	webpack = require('webpack'),
	autoprefixer = require('autoprefixer'),
	precss = require('precss'),
	commonsPlugin = new webpack.optimize.CommonsChunkPlugin('shared.js'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin')
;

module.exports = {
	context: path.resolve('.'),
	entry: {
		'review': path.resolve(__dirname, 'review/plugin.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
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
		commonsPlugin,
		new ExtractTextPlugin('[name].css')
	],
	module:{
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
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
				loader:'url?limit=1024&name=images/[name].[ext]'
			},
			{
				test: /\.(ttf|eot|woff)$/,
				exclude: /node_modules/,
				loader: 'url?limit=1024&name=fonts/[name].[ext]'
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
        return [autoprefixer({browsers:['last 1 Chrome version', 'last 1 Firefox version', 'Explorer >= 10', 'last 1 Safari version', 'Android 2.3', 'Android >= 4', 'last 1 ChromeAndroid version', 'last 1 iOS version']}), precss];
    }
}