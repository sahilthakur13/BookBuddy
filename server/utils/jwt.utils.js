const jwt = require('jsonwebtoken')
const config = require('../config/config')

exports.jwtSign = (id,role )=>{

        try{
          return jwt.sign({id,role},config.JWT_SECRET_CHABII,{
                expiresIn:"7d"
            })

        }catch(error){
            console.error("Jwt sign error:-",error)
            return null
        }   
}

exports.jwtVerify =(token)=>{
    try {
        return jwt.verify(token,config.JWT_SECRET_CHABII)
    } catch (error) {
        console.log("JWT verify error:-",error)
        return error.message
    }
}