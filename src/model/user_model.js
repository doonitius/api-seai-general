const mongoose = require('mongoose')

const user = mongoose.Schema(
	{
		username: {
			type: String,
		},
		password: {
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

module.exports = mongoose.model('user', user)
