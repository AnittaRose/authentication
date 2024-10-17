let users = require('../db/models/users');
const { successfunction, errorfunction } = require('../util/responsehandler')
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendemail = require('../util/send-email').sendEmail
// const otpmail = require('../util/Email_template/otpmail').resetPassword

// const fileUpload = require('../util/upload').fileUpload;
const dotevn = require('dotenv');
dotevn.config()
const crypto = require('crypto');
    

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}
let otpStore = {};
exports.addusers = async function (req, res) {
  try {
    let body = req.body;
    let email = body.email;
    let name = body.username;
    let phoneno = body.phoneno
    let password = body.password


    let otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);

    otpStore[otp] = {
      email,
      name,
      phoneno,
      password: hashedPassword,
      expirationTime: Date.now() + 5 * 60 * 1000
    };


    await sendemail(email, otp);

    return res.status(200).send({
      success: true,
      message: "OTP has been sent to your email. Please verify."
    });

  } catch (error) {
    console.log("error : ", error);
    let response = {
      success: false,
      statuscode: 400,
      message: "Error while sending OTP"
    };
    return res.status(response.statuscode).send(response);
  }
};


exports.verifyOtp = async function (req, res) {
  try {
    let { otp } = req.body;
    

    if (!otpStore[otp] || otpStore[otp].expirationTime < Date.now()) {
      return res.status(400).send({
        success: false,
        message: "OTP expired or invalid. Please request a new OTP."
      });
    }

    let { email, name, phoneno ,password } = otpStore[otp];

    let userData = {
      name,
      email,
      password,
      phoneno,
      password
    };

    let newUser = await users.create(userData);

    delete otpStore[otp]; 
    return res.status(200).send({
      success: true,
      message: "User registered successfully.",
      data: newUser
    });

  } catch (error) {
    console.log("error : ", error);
    return res.status(400).send({
      success: false,
      message: "Error occurred during OTP verification."
    });
  }
};
exports.singleusers = async function(req,res){

    try {
     let single_id = req.params.id;
     console.log('id from single',single_id);
 
     let one_data = await users.findOne({_id: single_id})
     console.log('one_data',one_data);
 
     let response = successfunction({
         success: true,
         statuscode: 200,
         message: "single view success",
         data:one_data
         
     })
     res.status(response.statuscode).send(response)
     return;
 
    } catch (error) {
     console.log("error",error);
 
     let response = errorfunction({
         success: false,
         statuscode: 400,
         message: "error"
         
     })
     res.status(response.statuscode).send(response)
     return;
 
    }
 
 
     
 };