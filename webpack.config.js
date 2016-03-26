var path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: './src/assets/app.js',
	output: {
		path: path.join(__dirname, 'src', 'static', 'js'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js/,
				loader: 'babel',
				include: [
					path.resolve(__dirname, 'src', 'assets'),
					path.resolve(__dirname, 'node_modules', 'lisp-on-js')
				]
			},
			{
				test: /\.styl/,
				loader: 'style-loader!css-loader!stylus-loader'
			},
			{
				test: /\.css/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.json/,
				loader: 'json-loader'
			}
		]
	}
};