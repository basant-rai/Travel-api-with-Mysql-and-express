const express = require('express');
const upload = require('../utils/file_upload');
const { addPackage, viewPackage, removePackages, findPackageById, updatePackages } = require('../Controller/packageController');
const { verifyToken } = require('../Controller/user')
const { validation, packageCheck } = require('../Validation');

const router = express.Router()

router.get('/viewpackage', viewPackage,)
router.get('/viewpackagebyid/:id', findPackageById)
router.post('/addpackage', upload.single('package_image'),verifyToken, packageCheck, validation, addPackage,)
router.delete('/deletepackage/:id', verifyToken, removePackages)
router.put('/updatepackage/:id',upload.single('package_image'), verifyToken, packageCheck, validation, updatePackages)

module.exports = router;