const ImageKit = require('@imagekit/nodejs')
const  config = require('../config/config'); 

const client = new ImageKit({
    privateKey:config.IMAGE_KIT_PRIVATE_KEY
})

async function fileUploads(file){
    console.log("file after decoding from raw buffer to string ....",file)
    const result = await client.files.upload({
        file,
        fileName:"bookBuddyBannerImage" + Date.now(),
    })
    console.log("in service folder imageKit...",result);
    return result
}

module.exports=fileUploads