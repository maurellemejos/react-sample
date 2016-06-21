const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.setupCSS = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.css?$/,
					loaders: ['style', 'css'],
					include: paths
				}
			]
		}
	};
}

exports.extractCSS = function(paths) {
	return {
		module: {
	    	loaders: [
		        // Extract CSS during build
		        {
		          test: /\.css$/,
		          loader: ExtractTextPlugin.extract('style', 'css'),
		          include: paths
		        }
		    ]
	    },
	    plugins: [
	    	// Output extracted CSS to a file
	    	new ExtractTextPlugin('[name].[chunkhash].css')
	    ]
	}
}

exports.extractBundle = function(options) {
	const entry = {};
	entry[options.name] = options.entries;

	return {
		entry: entry,
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				names: [options.name, 'manifest'],
				minchunks: Infinity
			})
		]
	}
}

exports.clean = function(path) {
	return {
		plugins: [
			new CleanWebpackPlugin([path], {
				root: process.cwd()
			})
		]
	}
}

exports.minify = function() {
	return {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
		]
	};
}