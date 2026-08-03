const multer = require('multer')

const uploads = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize: 2 * 1024 * 1024  
     }
})

function uploadBannerImage(req,res,next){
    
    const upload = uploads.single("bannerImage");
    upload(req,res , (error)=>{


        if(error instanceof multer.MulterError){
            if(error.code == 'LIMIT_FILE_SIZE'){
                return res.status(400).json({
                     success: false,
                    message: "Image size must be less than 2 MB"
                })
            }
        }

        if(error){
            return res.status(400).json({
                success:false,
                message:error
            })
        }
        next();
    })
}

module.exports = uploadBannerImage;