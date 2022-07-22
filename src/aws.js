const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAW6ZCEUK7COID36OD',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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'
  })

const uploadToAWS = async (filepath) => {
    let filename
    let fileContent
    filename = filepath
    fileContent = fs.readFileSync(filepath)
    


    const params = {
    Bucket: 'rezhelp-server-resume-storage',
    Key: `${filename}`,
    Body: fileContent
    }

    return new Promise(function(resolve, reject) {
        s3.upload(params, async (err, data) => {
            if (err) {
                reject(err)
            }
            fs.unlinkSync(filepath);
            
        console.log('Succesfully uploaded to Amazon');
        resolve(data.Location);
        })
    })


};

module.exports=uploadToAWS;