const protect = (req, res, next) => {
    const {user} = req.session
    
    if(!user){
        console.log('unauthorized user')
        return res.status(401)
            .json({
                status: 'fail',
                message: 'unauthorized'
            })
    }
    console.log('valid user')
    req.user = user;
    // forward to the controller
    next();
};

module.exports =protect;