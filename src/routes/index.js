const router = require('express').Router()

router.use('/project', require('./thesis_project_route'))
router.use('/advisor', require('./advisor_route'))

module.exports = router