const express = require('express')
const userController = require('../controllers/userController');
const authController = require('../controllers/authController')

const router = express.Router();

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/forgotPassword').post(authController.forgotPassword)
router.route('/resetPassword/:token').patch(authController.resetPassword)

//middleware runs in a sequence so that after this below middleware all the routes r protected 
router.use(authController.protect)

router.route('/updateMyPassword').patch(authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.route('/me').get(userController.getme, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);

//after this below middleware all the routes a only allowed to admin
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;