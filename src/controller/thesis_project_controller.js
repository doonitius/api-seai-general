const { setStatusSuccess, setStatusError } = require('../middleware/response_status')
const httpStatus = require('../middleware/http_status')
const uuid = require('uuid')
const { Similarity } = require('txtai')
const thesis_project = require('../model/thesis_project_model')
const elastic_client = require('../config/elastic_client')
const { upLoadFile, loadFile } = require('../middleware/upload_to_azure')
const { stringify } = require('uuid')

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
			results.push(source)
		}
		return results
	} catch (error) {
		throw error
	}
}

module.exports.inquiryProject = async (req, res) => {
	try {
		const { search } = req.query

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
		//                 fuzzy: {
		//                   maxEdits: 2,
		//                   prefixLength: 3,
		//                 },
		//               },
		//             },
		//             {
		//               autocomplete: {
		//                 query: `${search}`,
		//                 path: 'eng.document.abstract',
		//                 fuzzy: {
		//                   maxEdits: 2,
		//                   prefixLength: 3,
		//                 },
		//               },
		//             },
		//             {
		//               autocomplete: {
		//                 query: `${search}`,
		//                 path: 'thai.document.title',
		//                 fuzzy: {
		//                   maxEdits: 2,
		//                   prefixLength: 3,
		//                 },
		//               },
		//             },
		//             {
		//               autocomplete: {
		//                 query: `${search}`,
		//                 path: 'thai.document.abstract',
		//                 fuzzy: {
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

		const result = await elastic_client.search({
			index: 'thesisdocument',
			query: {
				multi_match: {
					fields: ['eng.document.title', 'thai.document.title', 'eng.document.abstract', 'thai.document.abstract'],
					query: `${search}`,
					fuzziness: 'AUTO',
				},
			},
		})

		let results = await getSourceResult(result)
		let ranking = await rankSearch(search, results)

		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, ranking['url']))
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

		res.send(setStatusSuccess(httpStatus.GET_SUCCESS, foundProject))
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
		// const fileName = `${uuid.v4()}.pdf`
		const newProject = new thesis_project({
			...req.body,
			// file_name: fileName,
		})

		const savedProject = await newProject.save()

		// if (savedProject && (req.files || req.files.thesis_file)) {
		//   await upLoadFile(req.files.thesis_file, fileName)
		// }

		res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, savedProject))
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
