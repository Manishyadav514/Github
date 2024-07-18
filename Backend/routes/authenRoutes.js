const express = require('express');
const router = express.Router();
const {registerConroller, loginConroller, testConroller} = require('../controllers/authController');
const {requireSignIn, isAdmin} = require('../middleware/authMiddleware')

router.post('/register', registerConroller);
router.post('/login', loginConroller);
router.get('/test', requireSignIn, isAdmin, testConroller);

module.exports = router;