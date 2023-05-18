const { setStatusSuccess, setStatusError } = require('../middleware/response_status')
const httpStatus = require('../middleware/http_status')
const uuid = require('uuid')
const { Similarity } = require('txtai')
const thesis_project = require('../model/thesis_project_model')
const keyword = require('../model/keyword_model')
const elastic_client = require('../config/elastic_client')
const { upLoadFile, loadFile } = require('../middleware/upload_to_azure')
const thesisIndex = 'thesisdocument'
const thesisToken = 'thesistokenizer'

async function rankSearch(searchResults, query) {
	try {
		let service = 'https://txtai-api-nn2mkxpf6q-uc.a.run.app'
		const english = /^[A-Za-z0-9\s]*$/
		let result_title
		if (english.test(query)) {
			result_title = searchResults.map((result, index) => {
				searchResults[index].init_id = index
				if (result.eng.document.title == null) {
					result.eng.document.title = ''
				}
				return result.eng.document.title
			})
		} else {
			result_title = searchResults.map((result, index) => {
				searchResults[index].init_id = index
				if (result.thai.document.title == null) {
					result.thai.document.title = ''
				}
				return result.thai.document.title
			})
		}
		const similarity = new Similarity(service)
		const scores_title = await similarity.similarity(query, result_title)
		searchResults.sort((a, b) => {
			const indexA = scores_title.findIndex((item) => item.id === a.init_id)
			const indexB = scores_title.findIndex((item) => item.id === b.init_id)
			return indexA - indexB
		})

		return searchResults
	} catch (error) {
		throw error
	}
}

async function identifyNewKeyword(result) {
	try {
		for (let i of result) {
			let eng_key = i.eng.document.keywords
			let th_key = i.thai.document.keywords

			if (eng_key.length && eng_key != null) {
				for (let j of eng_key) {
					const isExist = await keyword.findOne({ keyword: j })
					if (!isExist) {
						const newKeyword = new keyword({ keyword: j })
						await newKeyword.save()
					}
				}
			}
			if (th_key.length && th_key != null) {
				for (let j of th_key) {
					const isExist = await keyword.findOne({ keyword: j })
					if (!isExist) {
						const newKeyword = new keyword({ keyword: j })
						await newKeyword.save()
					}
				}
			}
		}
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
		const { search, academic_year, project_type, advisor_id, degree, keyword, page_no, page_size } = req.query
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
							boost: 5,
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
							boost: 5,
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
							boost: 3,
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
							boost: 3,
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
							boost: 3,
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
							boost: 3,
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

		// if (search && search != '') {
		// 	queryText.bool.should.push(
		// 		// {
		// 		// 	match: {
		// 		// 		'eng.document.title': {
		// 		// 			query: search,
		// 		// 			fuzziness: '2',
		// 		// 			max_expansions: 50,
		// 		// 			prefix_length: 0,
		// 		// 			boost: 5,
		// 		// 		},
		// 		// 	},
		// 		// },
		// 		{
		// 			suggest: {
		// 				result: {
		// 					prefix: search,
		// 					completion: {
		// 						field: 'eng.document.title',
		// 					},
		// 				},
		// 			},
		// 		}
		// 	)
		// } else {
		// 	queryText.bool.should.push({
		// 		match_all: {},
		// 	})
		// }

		if (academic_year || degree || project_type || advisor_id || keyword) {
			let filter = []
			if (academic_year) {
				const academic_year_arr = academic_year.split(',')
				filter.push({
					terms: {
						academic_year: academic_year_arr,
						boost: 1,
					},
				})
			}
			if (degree) {
				const degree_arr = degree.split(',')
				filter.push({
					terms: {
						degree: degree_arr,
						boost: 1,
					},
				})
			}
			if (project_type) {
				const project_type_arr = project_type.split(',')
				filter.push({
					terms: {
						project_type: project_type_arr,
						boost: 1,
					},
				})
			}
			if (advisor_id) {
				const advisor_id_arr = advisor_id.split(',')
				filter.push({
					terms: {
						advisor_id: advisor_id_arr,
						boost: 1,
					},
				})
			}
			if (keyword) {
				const keyword_arr = keyword.split(',')
				filter.push({
					bool: {
						should: [
							{
								terms: {
									'eng.document.keywords': keyword_arr,
									boost: 1,
								},
							},
							{
								terms: {
									'thai.document.keywords': keyword_arr,
									boost: 1,
								},
							},
						],
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
		let ranking = results
		if (results.length > 0 && (search && search != '')) {
			ranking = await rankSearch(results, search)
		}

		let foundTotal = result.hits.total['value']
		const totalPage = page_size ? Math.ceil(foundTotal / page_size).toString() : '1'

		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, ranking, foundTotal, totalPage))
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

		const existFile = await thesis_project.findOne({ _id: project_id }, { file_name: 1, _id: 0 })

		if (existFile.file_name) {
			if (!req.files) {
				const deleteFile = {
					file_name: null,
				}
				console.log('not req.files')
				await thesis_project.updateOne({ _id: project_id }, { $set: deleteFile })
			}
			if (req.files) {
				const updateProject = await thesis_project.updateOne({ _id: project_id }, { $set: projectPayload })
				if (updateProject && req.files.thesis_file) {
					await upLoadFile(req.files.thesis_file, fileName)
				}
			}
		} else {
			if (req.files) {
				const updateProject = await thesis_project.updateOne({ _id: project_id }, { $set: projectPayload })
				if (updateProject && req.files.thesis_file) {
					await upLoadFile(req.files.thesis_file, fileName)
				}
			}
		}

		res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, null))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.createProject = async (req, res) => {
	try {
		await identifyNewKeyword([req.body])
		const newDoc = {
			...req.body,
		}
		const newProject = new thesis_project(newDoc)

		const savedProject = await newProject.save()

		const { _id } = savedProject

		await elastic_client.index({
			index: thesisIndex,
			id: _id,
			body: newDoc,
		})

		res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, null))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.updateProject = async (req, res) => {
	try {
		const { project_id } = req.params
		await identifyNewKeyword([req.body])
		const updatePayload = {
			...req.body,
		}
		const updateProject = await thesis_project.updateOne({ _id: project_id }, { $set: updatePayload })

		await elastic_client.update({
			index: thesisIndex,
			id: project_id,
			doc: updatePayload,
		})

		res.send(setStatusSuccess(httpStatus.UPDATE_SUCCESS, updateProject))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.deleteProject = async (req, res) => {
	try {
		const { project_id } = req.params
		await thesis_project.deleteOne({ _id: project_id })

		await elastic_client.delete({
			index: thesisIndex,
			id: project_id,
		})

		res.send(setStatusSuccess(httpStatus.DELETE_SUCCESS, null))
	} catch (error) {
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
				console.log(data[val]._id)
			}

			const body = data.flatMap((doc) => [
				{ index: { _index: thesisIndex, _id: doc._id } },
				{
					thai: doc.thai,
					eng: doc.eng,
					academic_year: doc.academic_year,
					degree: doc.degree,
					project_type: doc.project_type,
					advisor_id: doc.advisor_id,
				},
			])
			console.log(body)
			const bulkRes = await elastic_client.bulk({ refresh: true, body })
			console.log(bulkRes)
			if (bulkRes.errors) {
				const erroredDocuments = []
				bulkRes.items.forEach((action, i) => {
					const operation = Object.keys(action)[0]
					if (action[operation].error) {
						erroredDocuments.push({
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
		res.send(setStatusError(error, null))
	}
}

module.exports.importJSONToNgram = async (req, res) => {
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
				console.log(data[val]._id)
			}

			const body = data.flatMap((doc) => [
				{ index: { _index: thesisToken, _id: doc._id } },
				{
					thai: doc.thai,
					eng: doc.eng,
					academic_year: doc.academic_year,
					degree: doc.degree,
					project_type: doc.project_type,
					advisor_id: doc.advisor_id,
				},
			])
			console.log(body)
			const bulkRes = await elastic_client.bulk({ refresh: true, body })
			console.log(bulkRes)
			if (bulkRes.errors) {
				const erroredDocuments = []
				bulkRes.items.forEach((action, i) => {
					const operation = Object.keys(action)[0]
					if (action[operation].error) {
						erroredDocuments.push({
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
		res.send(setStatusError(error, null))
	}
}

module.exports.truncateElastic = async (req, res) => {
	try {
		const allDoc = await elastic_client.search({
			index: thesisIndex,
			size: 30,
			query: {
				match_all: {},
			},
		})

		let result = await getSourceResult(allDoc)
		for (let i of result) {
			const { project_id } = i
			await elastic_client.delete({
				index: thesisIndex,
				id: project_id,
			})
		}

		res.send(setStatusSuccess(httpStatus.DELETE_SUCCESS, null))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}

module.exports.processKeyword = async (req, res) => {
	try {
		const result = await thesis_project.find()
		for (let i of result) {
			let eng_key = i.eng.document.keywords
			let th_key = i.thai.document.keywords

			if (eng_key === null || th_key === null) continue

			if (eng_key.length && eng_key != null) {
				for (let j of eng_key) {
					const isExist = await keyword.findOne({ keyword: j })
					if (!isExist) {
						const newKeyword = new keyword({ keyword: j })
						await newKeyword.save()
					}
				}
			}
			if (th_key.length && th_key != null) {
				for (let j of th_key) {
					const isExist = await keyword.findOne({ keyword: j })
					if (!isExist) {
						const newKeyword = new keyword({ keyword: j })
						await newKeyword.save()
					}
				}
			}
		}

		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, null))
	} catch (error) {
		res.send(setStatusError(error, null))
	}
}
