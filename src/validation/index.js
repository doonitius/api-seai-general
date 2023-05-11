const { validationResult, checkSchema } = require('express-validator')

const { setStatusError } = require('../middleware/response_status')
const httpStatus = require('../middleware/http_status')

const DEFAULT_OPTIONS = {
	type: ['image/jpg', 'image/jpeg', 'video/mp4', 'application/pdf', 'image/png'],
}

module.exports.handleErrorValidateSchemaType = (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const errorArr = []
			for (let err of errors.array({ onlyFirstError: true })) {
				errorArr.push({ message: err.msg })
			}
			throw httpStatus.VALIDATE_ERROR(errorArr)
		}
		next()
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.validateInputFiles = (options) => {
	return async (req, res, next) => {
		try {
			if (options) DEFAULT_OPTIONS.type = options.type
			if (!req.files) return next() /* pass next if not send input file */

			const files = req.files.file

			if (Array.isArray(files) && files.length) {
				/* multiple object case */
				const errorArr = []
				for (let file of files) {
					if (!DEFAULT_OPTIONS.type.includes(file.mimetype)) errorArr.puah({ message: `not allow type ${file.mimetype}` })
				}

				if (errorArr.length) throw httpStatus.VALIDATE_ERROR(errorArr)

				next()
			} else if (typeof files === 'object' && files !== null) {
				/* single object case */
				if (!DEFAULT_OPTIONS.type.includes(files.mimetype)) throw httpStatus.VALIDATE_ERROR([{ message: `not allow type ${files.mimetype}` }])
				next()
			}
		} catch (error) {
			res.send(setStatusError(error, null))
		}
	}
}

module.exports.validateSchemaField = (schema) => {
	return async (req, res, next) => {
		try {
			const schema_arr = Object.keys(schema)
			const body_arr = Object.keys(req.body)
			const params_arr = Object.keys(req.params)
			const query_arr = Object.keys(req.query)
			const file_arr = req.files ? Object.keys(req.files) : []

			const concat_arr = body_arr.concat(params_arr ? params_arr : [], query_arr ? query_arr : [], file_arr ? file_arr : [])

			const errorArr = []
			for (let key of concat_arr) {
				if (!schema_arr.includes(key)) errorArr.push({ message: `not allow field -> ${key}` })
			}

			if (errorArr.length) throw httpStatus.VALIDATE_ERROR(errorArr)
			next()
		} catch (error) {
			res.send(setStatusError(error, null))
		}
	}
}

module.exports.validateSchemaType = (schemaType) => {
	return checkSchema(schemaType)
}
