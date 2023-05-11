module.exports = {
	CREATE_SUCCESS: {
		code: 200,
		description: 'Data created successfully',
	},
	GET_SUCCESS: {
		code: 200,
		description: 'Data sent successfully',
	},
	UPDATE_SUCCESS: {
		code: 200,
		description: 'Data updated successfully',
	},
	DELETE_SUCCESS: {
		code: 200,
		description: 'Data deleted successfully',
	},
	MISSING_PARAMS: {
		code: 400,
		description: 'Missing required parameters',
	},
	INVALID_PARAMS: {
		code: 400,
		description: 'Invalid required parameters',
	},
	DUPLICATE_DATA: {
		code: 400,
		description: 'Data duplicated',
	},
	NOT_EXIST: {
		code: 404,
		description: 'Data is not exist',
	},
	NOT_FOUND: {
		code: 404,
		description: 'Data not found',
	},
	VALIDATE_ERROR: (msgArr) => ({
		code: 400,
		businessCode: 4006,
		description: 'Validate error',
		errors: msgArr,
	}),
	NOT_ALLOW_INPUT_TYPE: {
		code: 400,
		businessCode: 4007,
		description: 'Not allow file types for file upload.',
	},
	NOT_ALLOW_INPUT_FIELD: {
		code: 400,
		businessCode: 4008,
		description: 'Not allow input field.',
	},
	FILE_SIZE_LIMIT: {
		code: 400,
		businessCode: 4009,
		description: 'The file {file_name} is too big to be uploaded',
	},
	UNABLE_PROCESS: {
		code: 500,
		businessCode: 5000,
		description: 'Unable process request',
	},
	TIME_OUT: {
		code: 504,
		businessCode: 5040,
		description: 'API Timeout',
	},
}