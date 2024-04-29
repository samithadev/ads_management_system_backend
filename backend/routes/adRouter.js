const adController = require('../controllers/adController.js')
const upload = require('../config/multerConfig.js')
const AuthMiddleware = require('../middleware/AuthMiddleware.js')

const router = require('express').Router()

router.post('/createAd',AuthMiddleware, upload.single('image'), adController.createAdvertisement)

router.get('/allAds', adController.getAdvertisements)

router.get('/getSingleAd/:id', adController.getSingleAdvertisement)

router.put('/updateAd/:id',AuthMiddleware, upload.single('image'), adController.updateAdvertisement)

router.delete('/deleteAd/:id', AuthMiddleware, adController.deleteAdvertisement)

module.exports = router