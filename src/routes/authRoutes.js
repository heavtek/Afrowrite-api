const express = require('express');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.get(
    '/user/:id',
    authMiddleware,
    authController.getUser
);
router.put('/user/:id',authController.updateuser);
router.post('/login', authController.login);

module.exports = router;