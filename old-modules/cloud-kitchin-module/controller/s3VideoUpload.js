var AWS = require("aws-sdk");
const fs = require("fs");

const s3VideoUpload = (file, path) => {
    AWS.config.update({
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
        region: process.env.region
    });
    const s3 = new AWS.S3();
    var params = {
        Bucket: 'culin-video',
        Body: fs.createReadStream(file.path),
        Key: `${path}/${file.filename}`,
        ContentType: file.mimetype
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, function (s3Err, data) {
            if (s3Err) {
                console.log("the value of S3err is " + s3Err);
                fs.unlinkSync(file.path);
                reject({ message: 'Error on upload video!', path: '' });
            } else {
                fs.unlinkSync(file.path);
                resolve({ message: 'video upload!', path: data })
            }
        })
    })
}

module.exports = s3VideoUpload;