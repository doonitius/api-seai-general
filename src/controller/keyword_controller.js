const { setStatusSuccess, setStatusError } = require('../middleware/response_status')
const httpStatus = require('../middleware/http_status')

const keyword = require('../model/keyword_model')

module.exports.inquiryKeyword = async (req, res) => {
	try {
		const { search } = req.query

		let result

		if (search && search != '') {
			let pipeline = [
				{
					$search: {
						index: 'keyword',
						compound: {
							should: [
								{
									autocomplete: {
										query: `${search}`,
										path: 'keyword',
										fuzzy: {
											maxEdits: 2,
											prefixLength: 3,
										},
									},
								},
							],
							minimumShouldMatch: 0,
						},
					},
				},
				{
					$match: search ? {} : { $expr: { $eq: [true, true] } },
				},
			]
			result = await keyword.aggregate(pipeline)
		} else {
			result = await keyword.find()
		}

		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, result))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

// module.exports.getAdvisorById = async (req, res) => {
// 	try {
// 		const { advisor_id } = req.params

// 		const result = await advisor.findOne({ _id: advisor_id }, { __v: 0 })

// 		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, result))
// 	} catch (error) {
// 		res.send(setStatusError(error, null))
// 	}
// }
