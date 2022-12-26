const express = require('express');
const userRouter = require('../controller/userAuthContoller');
const router = express.Router();

router.post('/register',userRouter.register);
router.post('/login',userRouter.login);

module.exports = router;
