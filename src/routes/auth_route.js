const router = require('express').Router()

const authentication = require('../controller/authentication_controller')

// router.get('/', advisor.inquiryAdvisor)
// router.get('/:advisor_id', advisor.getAdvisorById)
router.post('/register', authentication.register)
router.post('/login', authentication.login)
router.post('/refresh', authentication.refresh)

module.exports = router
