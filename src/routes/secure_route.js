const jwt = require('jsonwebtoken')
const router = require('express').Router()

router.use((req, res, next) => {
	console.log('Secure controller executed.')
	if (req.method == 'OPTIONS') {
		next()
	} else {
		let accesstoken = req.header('access_token')
		if (accesstoken) {
			jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
				if (err) {
					console.log('invalid token')
					console.log(err)
					if (err.name === 'TokenExpiredError') {
						res.statusCode = 401
						res.send({
							code: 'expired',
							message: `accesstoken expired`,
						})
					} else {
						res.statusCode = 401
						res.send({
							code: 'invalid',
							message: `Invalid Token ${err}`,
						})
					}
				} else {
					//console.log(decoded);
					req.user = decoded
					next()
				}
			})
		} else {
			res.statusCode = 401
			res.send({
				code: 'error',
				message: 'accesstoken not found.',
			})
		}
	}
})

//export const router;
module.exports = router
