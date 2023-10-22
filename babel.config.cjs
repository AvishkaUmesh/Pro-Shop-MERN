module.exports = {
	presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
	only: ['./backend/**/*.js'],
};
