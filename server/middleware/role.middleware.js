exports.roleBasedAccessControl=(...roles)=>{
   
    return function(req,res,next){
       
    if(!req.user || !req.user.role){
            return res.status(401).json({
                message:"You are not authenticated"
            })
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:"Your are not allowed to access this resourse"
            })
        }
        next(); 
    }
}

