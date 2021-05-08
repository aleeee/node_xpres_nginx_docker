const User = require("../models/userModel")
var debug = require('debug')('node-app:authController');
const bcrypt = require("bcryptjs")

exports.signUp = async (req, res) => {

    try {
        const { username, password } = req.body
        const hashedpwd = await bcrypt.hash(password, 12)

        const newUser = await User.create({
            username,
            password: hashedpwd
        })
        req.session.user =newUser
        debug("user created {}", newUser)
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (e) {
        debug(e)
        res.status(400).json({
            status: 'fail'
        })
    }
}

exports.login = async (req, res) => {
    try{
        const {username, password} = req.body;

        const user = await User.findOne({username})

        if(!user){
            debug('unknown user {}' , username)
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }
      const isValidUser=  await bcrypt.compare(password,user.password)
      debug("authorized? " ,isValidUser)
      if(isValidUser){
          req.session.user = user
           res.status(200).json({
              status: 'success'
          })
      }else{
          res.status(401).json({
              status: 'fail',
              message: 'username and password don\'t match'
          })
      }
    }catch(e){
        debug(e)
        res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        })
    }
}