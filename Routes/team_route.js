const express = require('express');
const { viewMember, addMember, updateMember, deleteMember } = require('../Controller/team_controller');
const upload = require('../utils/file_upload');
const { verifyToken } = require('../Controller/user');
const { validation, memberCheck } = require('../Validation');


const router = express.Router()

router.get('/viewmembers', viewMember)
router.post('/addmember', upload.single('member_image'), verifyToken, memberCheck, validation, addMember)
router.post('/updatemember/:id', upload.single('member_image'), verifyToken, memberCheck, validation, updateMember)
router.delete('/deletemember/:id', deleteMember)

module.exports = router;