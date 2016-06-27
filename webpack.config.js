const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const parts = require('./lib/parts');

const PATHS = {
	src: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'build'),
	style: [
		path.join(__dirname, 'src', 'css', 'main.css')
	]
};

const common = {
	entry: {
		app: PATHS.src + '/js',
		vendor: ['react'],
		style: PATHS.style
	},
	output: {
		path: PATHS.build,
		filename: "[name].js"
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				include: PATHS.src,
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Testing React',
			hash: false,
			template: path.join(__dirname, 'src', 'index.html')
		})
	]
}

var config;

switch(process.env.npm_lifecycle_event) {
	// Production Build
	case 'build':
		config = merge(
			common,
			{
				devtool: 'source-map',
				output: {
					path: PATHS.build,
					publicPath: '/webpack-demo/',
					filename: '[name].[chunkhash].js',
					chunkFilename: '[chunkhash].js'
				},
				plugins: [
					new webpack.optimize.DedupePlugin(),
					new webpack.optimize.OccurenceOrderPlugin()
				]
			},
			parts.extractBundle({
				name: 'vendor',
				entries: ['react', 'react-dom']
			}),
			parts.minify(),
			parts.extractCSS(PATHS.style),
			parts.clean(PATHS.build)
		);
		break;

	// Development Build
	default:
		config = merge(
			common,
			{ devtool: 'inline-source-map' },
			parts.extractBundle({
				name: 'vendor',
				entries: ['react', 'react-dom']
			}),
			parts.setupCSS(PATHS.style),
			parts.clean(PATHS.build)
		);
		break;

}

module.exports = config;