const sellerController = require('../controllers/sellerController.js')

const router = require('express').Router()

router.post('/addSeller', sellerController.addSeller)

router.post('/loginSeller', sellerController.loginSeller)

router.get('/getSeller/:id', sellerController.getSingleSeller)

module.exports = router