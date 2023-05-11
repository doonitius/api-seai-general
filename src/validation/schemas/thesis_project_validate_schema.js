module.exports.thesisProjectSchema = {
	inquiryProject: {
		search: {
			in: ['query'],
			optional: true,
			isString: {
				errorMessage: 'search must be String',
			},
			trim: true,
		},
		keyword: {
			in: ['query'],
			optional: true,
			isString: {
				errorMessage: 'keyword must be String',
			},
			trim: true,
		},
		advisor_id: {
			in: ['query'],
			optional: true,
			isString: {
				errorMessage: 'advisor_id must be String',
			},
			trim: true,
		},
		project_type: {
			in: ['query'],
			optional: true,
			isString: {
				errorMessage: 'project_type must be String',
			},
			trim: true,
		},
		academic_year: {
			in: ['query'],
			optional: true,
			isString: {
				errorMessage: 'academic_year must be String',
			},
			trim: true,
		},
		degree: {
			in: ['query'],
			optional: true,
			isString: {
				errorMessage: 'degree must be String',
			},
			trim: true,
		},
		page_no: {
			in: ['query'],
			optional: false,
			isInt: {
				errorMessage: 'page_no must be Int or required',
			},
		},
		page_size: {
			in: ['query'],
			optional: false,
			isInt: {
				errorMessage: 'page_size must be Int or required',
			},
		},
	},
	getProjectById: {
		project_id: {
			in: ['params'],
			optional: false,
			isString: {
				errorMessage: 'search must be String',
			},
			trim: true,
		},
	},
	previewDocument: {
		file_name: {
			in: ['params'],
			optional: false,
			isString: {
				errorMessage: 'search must be String',
			},
			trim: true,
		},
	},
	// createProject: {
	// 	thai: {
	// 		in: ['body'],
	// 		optional: false,
	// 		isObject: {
	// 			errorMessage: 'thai must be an object',
	// 		},
	// 		nestedObject: {
	// 			errorMessage: 'document must be an object',
	// 			options: {
	// 				document: {
	// 					isObject: true,
	// 					nestedObject: {
	// 						options: {
	// 							title: {
	// 								isString: true,
	// 								errorMessage: 'title must be a string',
	// 							},
	// 							abstract: {
	// 								isString: true,
	// 								errorMessage: 'title must be a string',
	// 							},
	// 							keywords: {
	// 								optional: true,
	// 								isArray: {
	// 									bail: false,
	// 									options: {
	// 										min: 0,
	// 									},
	// 								},
	// 							},
	// 						},
	// 					},
	// 				},
	// 				question_array: {
	// 					in: ['body'],
	// 					optional: true,
	// 					isArray: {
	// 						bail: false,
	// 						options: {
	// 							min: 0,
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// },
}
