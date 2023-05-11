const router = require('express').Router()

const thesis_project = require('../controller/thesis_project_controller')

const { validateSchemaField, validateSchemaType, handleErrorValidateSchemaType } = require('../validation')

const { thesisProjectSchema } = require('../validation/schemas/thesis_project_validate_schema')

router.get(
	'/filter',
	validateSchemaField(thesisProjectSchema.inquiryProject),
	validateSchemaType(thesisProjectSchema.inquiryProject),
	handleErrorValidateSchemaType,
	thesis_project.inquiryProject
)

router.get('/keyword', thesis_project.processKeyword)

router.get(
	'/:project_id',
	validateSchemaField(thesisProjectSchema.getProjectById),
	validateSchemaType(thesisProjectSchema.getProjectById),
	handleErrorValidateSchemaType,
	thesis_project.getProjectById
)

router.get(
	'/:file_name/preview',
	validateSchemaField(thesisProjectSchema.previewDocument),
	validateSchemaType(thesisProjectSchema.previewDocument),
	handleErrorValidateSchemaType,
	thesis_project.previewDocument
)

router.post('/', thesis_project.createProject)
router.post('/import', thesis_project.importJSONToElasticsearch)
router.post('/upload/:project_id', thesis_project.uploadProjectFile)
router.patch('/:project_id', thesis_project.updateProject)
router.delete('/truncate-elastic', thesis_project.truncateElastic)


module.exports = router