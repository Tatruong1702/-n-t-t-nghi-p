const express = require('express')
const { getReviews } = require('../controllers/review.controller')

const router = express.Router()
router.get('/', getReviews)

module.exports = router
