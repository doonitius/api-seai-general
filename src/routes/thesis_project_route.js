const router = require('express').Router()

const thesis_project = require('../controller/thesis_project_controller')

router.get('/filter', thesis_project.inquiryProject)
router.get('/:project_id', thesis_project.getProjectById)
router.get('/:file_name/preview', thesis_project.previewDocument)
router.post('/', thesis_project.createProject)
router.post('/upload/:project_id', thesis_project.uploadProjectFile)
router.patch('/:project_id', thesis_project.updateProject)


module.exports = router