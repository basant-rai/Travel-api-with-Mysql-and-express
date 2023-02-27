const express = require('express');
const { viewUser, createUser, deleteUser, findByEmail, updateUser, logIn, logOut, verifyToken, confirm_user, resend_confirmation, reset_password, forgot_password, getUserData } = require('../Controller/user');
const upload = require('../utils/file_upload');
const { userCheck, validation, userCheckUpdate } = require('../Validation');

const router = express.Router()

router.get('/viewuser', verifyToken, viewUser);
router.post('/create-account', userCheck, validation, createUser);
router.get('/confirmuser/:token', confirm_user)
router.post('/resendconfirm', resend_confirmation);
router.post('/forgotpassword', forgot_password);
router.post('/resetpassword/:token', reset_password);
router.get('/findbyemail', findByEmail);
router.get('/userdata', verifyToken, getUserData);
router.delete('/deleteuser/:id', deleteUser);
router.put('/update_user/:id', upload.single('profile_picture'), verifyToken, userCheckUpdate, validation, updateUser)
router.post('/login', logIn)
router.post('/logout/:token', logOut)

module.exports = router;