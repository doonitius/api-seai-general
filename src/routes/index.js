const router = require('express').Router()

router.use('/project', require('./thesis_project_route'))

module.exports = router