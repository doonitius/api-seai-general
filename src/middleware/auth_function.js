const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

module.exports.hashPassword = async (plaintextPassword) => {
	const hash = await bcrypt.hash(plaintextPassword, 10) // Store hash in the database
  return hash
}

// compare password
module.exports.comparePassword = async (plaintextPassword, hash) => {
	const result = await bcrypt.compare(plaintextPassword, hash)
	return result
}

module.exports.jwtGenerate = (user) => {
	const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3m', algorithm: 'HS256' })
	return accessToken
}

module.exports.jwtRefreshTokenGenerate = (user) => {
	const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d', algorithm: 'HS256' })
	return refreshToken
}

module.exports.verifyToken = (refresh_token) => {
	const decoded =  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
	return decoded
}