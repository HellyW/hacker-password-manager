// index.js
module.exports = {
	...require('./auth'),
	...require('./wxacode'),
	...require('./secCheck'),
  ...require('./trialfn')
}