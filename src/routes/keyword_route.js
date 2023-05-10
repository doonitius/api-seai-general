const router = require('express').Router()

const keyword = require('../controller/keyword_controller')

router.get('/', keyword.inquiryKeyword)

module.exports = router
