const express = require ('express');
const router = express.Router();
const usercontroller = require ('../controllers/usercontroller');
// const accessControl = require('../util/accesscontrol').accessControl
// const userRouters = require('../routers/');


router.post('/user',usercontroller.addusers);
router.post('/verifyOtp',usercontroller.verifyOtp);
router.get('/users/:id',usercontroller.singleusers)


module.exports = router;
