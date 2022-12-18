const router = require('express').Router()

const thesis_project = require('../controller/thesis_project_controller')

router.get('/:project_id', thesis_project.getProjectById)
router.get('/:file_name/preview', thesis_project.previewDocument)
router.post('/', thesis_project.createProject)


module.exports = router