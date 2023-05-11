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

module.exports = router
