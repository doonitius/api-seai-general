const { setStatusSuccess, setStatusError } = require('../middleware/response_status')
const httpStatus = require('../middleware/http_status')

const { hashPassword, comparePassword, jwtGenerate, jwtRefreshTokenGenerate, verifyToken } = require('../middleware/auth_function')

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
      throw new error
    }


    const passwordHashed = foundUsername.password

    const correctPassword = await comparePassword(password, passwordHashed)

    if (!correctPassword) {
      throw new error
    }

    const accessToken = jwtGenerate(foundUsername)
    const refreshToken = jwtRefreshTokenGenerate(foundUsername)

    const result = {
      username: foundUsername.username,
      access_token: accessToken,
      refresh_token: refreshToken
    }

		res.send(result)
	} catch (error) {
		console.log(error);
		res.send(setStatusError(error, null))
	}
}

module.exports.refresh = async (req, res) => {
	try {
    let refresh_token = req.header('refresh_token')

		
		const decoded = verifyToken(refresh_token)
		const foundUsername = await user.findOne({ username: decoded.username })

		if (!foundUsername) {
			throw new Error('User not found')
		}

		const accessToken = jwtGenerate(foundUsername)
    const refreshToken = jwtRefreshTokenGenerate(foundUsername)

		const result = {
			username: foundUsername.username,
			access_token: accessToken,
			refresh_token: refreshToken,
		}
		res.send(result)
	} catch (error) {
		console.log(error);
		res.send(setStatusError(error, null))
	}
}
