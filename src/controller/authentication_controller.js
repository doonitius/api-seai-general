const { setStatusSuccess, setStatusError } = require('../middleware/response_status')
const httpStatus = require('../middleware/http_status')

const { hashPassword, comparePassword, jwtGenerate, jwtRefreshTokenGenerate } = require('../middleware/auth_function')

const user = require('../model/user_model')

module.exports.register = async (req, res) => {
	try {
		const { username, password } = req.body

		if (!password) {
      throw error
    }

    const passwordHashed = await hashPassword(password)

		const newUser = new user({
			username,
			password: passwordHashed,
		})

    await newUser.save()

		res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, null))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.login = async (req, res) => {
	try {
		const { username, password } = req.body

    const foundUsername = await user.findOne({ username })

    if (!foundUsername) {
      throw error
    }

    const passwordHashed = foundUsername.password

    const correctPassword = await comparePassword(password, passwordHashed)

    if (!correctPassword) {
      throw error
    }

    const accessToken = jwtGenerate(foundUsername.username)
    const refreshToken = jwtRefreshTokenGenerate(foundUsername.username)

    const result = {
      username: foundUsername.username,
      access_token: accessToken,
      refresh_token: refreshToken
    }

		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, result))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.refresh = async (req, res) => {
	try {
		const { username, password } = req.body

		res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, { username, password }))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}
