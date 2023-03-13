const router = require('express').Router()

const advisor = require('../controller/advisor_controller')

router.get('/', advisor.inquiryAdvisor)
router.get('/:advisor_id', advisor.getAdvisorById)

module.exports = router
