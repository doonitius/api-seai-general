const mongoose = require('mongoose')

const keyword = mongoose.Schema(
	{
		keyword: {
			type: String,
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
)

module.exports = mongoose.model('keyword', keyword)
