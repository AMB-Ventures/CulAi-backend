var AWS = require("aws-sdk");
const s3Base64ImageUpload = (base64, filename, type) => {
    AWS.config.update({
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
        region: process.env.region
    });
    const s3 = new AWS.S3();
    let buf = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    var params = {
        Bucket: 'culin-images',
        Body: buf,
        ContentEncoding: 'base64',
        Key: `merchantconfig/${filename}`,
        ContentType: type,
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, function (s3Err, data) {
            if (s3Err) {
                console.log("the value of S3err is " + s3Err);
                resolve({ message: 'Error on image!', path: '' });
            } else {
                resolve({ message: 'image upload!', path: data })
            }
        })
    })
}

module.exports = s3Base64ImageUpload;// Additional functionality can be added here