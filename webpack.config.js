var path = require('path');

module.exports = {
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
					path.resolve(__dirname, '../eventStream')
				]
			},
			{
				test: /\.styl/,
				loader: 'style-loader!css-loader!stylus-loader'
			}
		]
	}
};