const { setStatusSuccess, setStatusError } = require('../middleware/response_status')
const httpStatus = require('../middleware/http_status')
const uuid = require('uuid')
const { Similarity } = require('txtai')
const thesis_project = require('../model/thesis_project_model')
const elastic_client = require('../config/elastic_client')
const { upLoadFile, loadFile } = require('../middleware/upload_to_azure')
const { stringify } = require('uuid')
const thesisIndex = 'thesisdocument'
async function rankSearch(results, query) {
	try {
		// console.log(new Similarity(query, results))
		return new Similarity(query, results)
	} catch (error) {
		throw error
	}
}

async function getSourceResult(result) {
	try {
		let results = []
		for (let val of result['hits'].hits) {
			let source = val['_source']
			let doc_id = val['_id']
			source['project_id'] = doc_id
			results.push(source)
		}
		return results
	} catch (error) {
		throw error
	}
}

// page 1 size 5:
// from 0 size 5

// page 2 size 5:
// from 6 size 5

// page 3 size 5:
// from 11 size 5

async function pagination(query, page_no, page_size) {
	try {
		query.size = page_size
		query.from = (page_no - 1) * page_size
		return query
	} catch (error) {
		throw error
	}
}

module.exports.inquiryProject = async (req, res) => {
	try {
		const { search, academic_year, project_type, advisor_id, degree, page_no, page_size } = req.query

		// let result

		// if (search && search != '') {
		//   let pipeline = [
		//     {
		//       $search: {
		//         index: 'document',
		//         compound: {
		//           should: [
		//             {
		//               autocomplete: {
		//                 query: `${search}`,
		//                 path: 'eng.document.title',
		//                 match: {
		//                   maxEdits: 2,
		//                   prefixLength: 3,
		//                 },
		//               },
		//             },
		//             {
		//               autocomplete: {
		//                 query: `${search}`,
		//                 path: 'eng.document.abstract',
		//                 match: {
		//                   maxEdits: 2,
		//                   prefixLength: 3,
		//                 },
		//               },
		//             },
		//             {
		//               autocomplete: {
		//                 query: `${search}`,
		//                 path: 'thai.document.title',
		//                 match: {
		//                   maxEdits: 2,
		//                   prefixLength: 3,
		//                 },
		//               },
		//             },
		//             {
		//               autocomplete: {
		//                 query: `${search}`,
		//                 path: 'thai.document.abstract',
		//                 match: {
		//                   maxEdits: 2,
		//                   prefixLength: 3,
		//                 },
		//               },
		//             },
		//           ],
		//           minimumShouldMatch: 0,
		//         },
		//       },
		//     },
		//     {
		//       $match: search ? {} : { $expr: { $eq: [true, true] } },
		//     },
		//   ]
		//   result = await thesis_project.aggregate(pipeline)
		// } else {
		//   result = await thesis_project.find()
		// }

		let queryText = {
			bool: {
				should: [],
			},
		}

		if (search && search != '') {
			queryText.bool.should.push(
				{
					match: {
						'eng.document.title': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.document.title': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'eng.document.abstract': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.document.abstract': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'eng.document.keywords': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.document.keywords': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'eng.advisor.prefix': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.advisor.prefix': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'eng.advisor.first_name': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.advisor.first_name': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'eng.advisor.last_name': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.advisor.last_name': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'eng.author.prefix': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.author.prefix': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'eng.author.first_name': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.author.first_name': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'eng.author.last_name': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				},
				{
					match: {
						'thai.author.last_name': {
							query: search,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				}
			)
		} else {
			queryText.bool.should.push({
				match_all: {},
			})
		}

		if (academic_year || degree || project_type || advisor_id) {
			let filter = []
			if (academic_year) {
				filter.push({
					term: {
						academic_year: {
							value: academic_year,
						},
					},
				})
			}
			if (degree) {
				// filter.push({
				// 	match: {
				// 		degree: {
				// 			query: degree,
				// 		},
				// 	},
				// })
				queryText.bool.should.push({
					match: {
						degree: {
							query: degree,
							fuzziness: '2',
							max_expansions: 50,
							prefix_length: 0,
						},
					},
				})
			}
			if (project_type) {
				filter.push({
					match: {
						project_type: {
							query: project_type,
						},
					},
				})
			}
			if (advisor_id) {
				filter.push({
					term: {
						advisor_id: {
							value: advisor_id,
						},
					},
				})
			}
			queryText.bool['filter'] = filter
		}

		let queryConfig = {
			index: thesisIndex,
			query: queryText,
		}

		if (page_no && page_size) {
			queryConfig = await pagination(queryConfig, page_no, page_size)
		}

		const result = await elastic_client.search(queryConfig)

		let results = await getSourceResult(result)
		let ranking = await rankSearch(search, results)

		let foundTotal = result.hits.total['value']
		const totalPage = page_size ? Math.ceil(foundTotal / page_size).toString() : '1'

		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, ranking['url'], foundTotal, totalPage))
	} catch (error) {
		console.log(error)
		res.send(setStatusError(error, null))
	}
}

module.exports.getProjectById = async (req, res) => {
	try {
		const { project_id } = req.params

		const foundProject = await thesis_project.findOne({ _id: project_id }, { __v: 0 })
		if (!foundProject) throw httpStatus.NOT_EXIST
		const { _id } = foundProject
		delete foundProject._doc['_id']
		const result = {
			...foundProject._doc,
			project_id: _id,
		}
		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, result))
	} catch (error) {
		console.log(error)
		res.send(setStatusError(error, null))
	}
}

module.exports.previewDocument = async (req, res) => {
	try {
		const { file_name } = req.params
		if (file_name) {
			const result = await loadFile(file_name)
			res.set({
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment;filename=${file_name}.pdf`,
			})
			res.send(result)
		} else {
			throw httpStatus.NOT_FOUND
		}
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.uploadProjectFile = async (req, res) => {
	try {
		const { project_id } = req.params

		const fileName = `${uuid.v4()}.pdf`

		const projectPayload = {
			file_name: fileName,
		}

		const updateProject = await thesis_project.updateOne({ _id: project_id }, { $set: projectPayload })

		if (updateProject && (req.files || req.files.thesis_file)) {
			await upLoadFile(req.files.thesis_file, fileName)
		}

		res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, null))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.createProject = async (req, res) => {
	try {
		const newDoc = {
			...req.body,
		}
		// const fileName = `${uuid.v4()}.pdf`
		const newProject = new thesis_project(newDoc)

		const savedProject = await newProject.save()

		const { _id } = savedProject

		await elastic_client.index({
			index: thesisIndex,
			id: _id,
			body: newDoc,
		})

		// if (savedProject && (req.files || req.files.thesis_file)) {
		//   await upLoadFile(req.files.thesis_file, fileName)
		// }

		res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, null))
	} catch (error) {
		console.error(error)
		res.send(setStatusError(error, null))
	}
}

module.exports.updateProject = async (req, res) => {
	try {
		const { project_id } = req.params

		const updatePayload = {
			...req.body,
		}
		const updateProject = await thesis_project.updateOne({ _id: project_id }, { $set: updatePayload })

		await elastic_client.update({
			index: thesisIndex,
			id: project_id,
			doc: updatePayload
		})

		// if (updateProject && (req.files || req.files.thesis_file)) {
		//   const existFile = await thesis_project.findOne({ _id: doc_id })
		//   const { file_name } = existFile
		//   if (file_name === null || file_name === '') {
		//     fileName = `${uuid.v4()}.pdf`
		//   }
		//   await thesis_project.updateOne({ _id: doc_id }, { $set: { file_name: fileName } })
		//   await upLoadFile(req.files.thesis_file, fileName)
		// }

		res.send(setStatusSuccess(httpStatus.UPDATE_SUCCESS, updateProject))
	} catch (error) {
		console.error(error)
		res.send(setStatusError(error, null))
	}
}

module.exports.importJSONToElasticsearch = async (req, res) => {
	try {
		if (req.files || req.files.attachment) {
			const jsonFile = req.files.attachment

			const data = JSON.parse(jsonFile.data)

			for (let val in data) {
				data[val]._id = data[val]._id['$oid']
				let advisor_id = data[val].advisor_id
				data[val].advisor_id = []
				for (let advisor in advisor_id) {
					data[val].advisor_id.push(advisor_id[advisor]['$oid'])
				}
				delete data[val]._id
			}

			const body = data.flatMap((doc) => [{ index: { _index: thesisIndex, _id: doc._id } }, doc])
			console.log(body);
			const bulkRes = await elastic_client.bulk({ refresh: true, body })
			console.log(bulkRes)
			if (bulkRes.errors) {
				const erroredDocuments = []
				// The items array has the same order of the dataset we just indexed.
				// The presence of the `error` key indicates that the operation
				// that we did for the document has failed.
				bulkRes.items.forEach((action, i) => {
					const operation = Object.keys(action)[0]
					if (action[operation].error) {
						erroredDocuments.push({
							// If the status is 429 it means that you can retry the document,
							// otherwise it's very likely a mapping error, and you should
							// fix the document before to try it again.
							status: action[operation].status,
							error: action[operation].error,
							operation: body[i * 2],
							document: body[i * 2 + 1],
						})
					}
				})
				console.log(erroredDocuments)
			}
		}
		res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, null))
	} catch (error) {
		console.log(error)
		res.send(setStatusError(error, null))
	}
}
