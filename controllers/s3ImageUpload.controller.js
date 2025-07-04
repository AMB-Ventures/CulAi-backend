var AWS = require("aws-sdk");
const fs = require("fs");

const s3ImageUpload = (file, path) => {
    AWS.config.update({
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
        region: process.env.region
    });
    const s3 = new AWS.S3();
    var params = {
        Bucket: 'culin-images',
        Body: fs.createReadStream(file.path),
        Key: `${path}/${file.filename}`,
        ContentType: file.mimetype,
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, function (s3Err, data) {
            if (s3Err) {
                console.log("the value of S3err is " + s3Err);
                fs.unlinkSync(file.path);
                resolve({ message: 'Error on image!', path: '' });
            } else {
                fs.unlinkSync(file.path);
                resolve({ message: 'image upload!', path: data })
            }
        })
    })
}

module.exports = s3ImageUpload;