const router = require('express').Router()

router.use('/auth', require('./auth_route'))
// router.use(require('./secure_route'))
router.use('/project', require('./thesis_project_route'))
router.use('/advisor', require('./advisor_route'))
router.use('/keyword', require('./keyword_route'))

module.exports = router 