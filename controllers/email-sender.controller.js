const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
var AWS = require('aws-sdk');

exports.sendEmailNew = async function emailService(email, subject, obj) {
    if (!obj.type) return "error found";
    // sgMail.setApiKey('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')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const getEmailHtml = (obj) => {
        let data = "";
        switch (obj.type) {
            case 'employee':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/employee.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('{xyz@gmail.com}', obj.email);
                data = data.replace('{Admin@321}', obj.password);
                data = data.replace('{loginlink}', obj.loginlink);
                break;

            case 'kitchenAdmin':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/cloudkitchen.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                data = data.replace('xyz@gmail.com', obj.email);
                data = data.replace('Admin@321', obj.password);
                data = data.replace('xxx-xxx-xx', obj.lisencekey);
                // data = data.replace('{loginlink}', obj.loginlink);
                break;

            case 'enquiry':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/enquiry.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                break;

            case 'approved enquiry':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/enquiryApprove.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                data = data.replace('xyz@gmail.com', obj.email);
                data = data.replace('Admin@321', obj.password);
                // data = data.replace('{onboardinglink}', obj.onboardinglink);
                break;
    
            case 'refused enquiry':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/enquiryRejected.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                data = data.replace('{rejectionReason}', obj.rejectionReason)
                break;
            
            case 'onboarding':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/onboarding.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                break;

            case 'approved onboarding':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/onboardingApproved.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                data = data.replace('a-b-c-d', obj.merchantId);
                data = data.replace('xx-xx-xx', obj.lisencekey);
                break;

            case 'refused onboarding':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/onboardingRejected.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                data = data.replace('rejectionReason', obj.onboardingRejection);
                break;

            case 'resetpassword':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/resetpassword.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                data = data.replace('{otp}', obj.otp);
                // data = data.replace('{loginlink}', obj.loginlink);
                break;

            case 'subadmin':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/subadmin.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                data = data.replace('Role Name', obj.role);
                data = data.replace('xyz@gmail.com', obj.email);
                data = data.replace('Admin@321', obj.password);
                data = data.replace('xxx-xxx-xx', obj.loginlink);
                break;

            case 'contactUs':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/contact_us.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('abc', obj.name);
                data = data.replace('1234', obj.customerId);
                data = data.replace('xyz@gmail.com', obj.email);
                data = data.replace('pqr', obj.issuesType);
                data = data.replace('xyz', obj.description);
                // data = data.replace('', obj.loginlink);
                break;
        }
        return data;
    }

    const msg = {
        to: email,
        from: process.env.sendFrom,
        subject: subject,
        text: "Hello world",
        html: getEmailHtml(obj)
    };

    try {
        var res = await sgMail.send(msg);
        console.log(JSON.stringify(res));
        return "successfully sent"
    } catch (error) {
        if (error.response) {
            console.error(error.response.body)
            return "error found";
        }
    }
}

//This code used to send email via AWS SES
// Add these two line in .env
// email_accessKeyId=AKIA4JYGVQL4R4HU4M6E
// email_secretAccessKey=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

// exports.sendEmailNew = async function emailService(email, subject, obj) {
//     if (!obj.type) return "error found";

//     const getEmailHtml = (obj) => {
//         let data = "";
//         switch (obj.type) {
//             case 'employee':
//                 data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/employee.html'), { encoding: 'utf8', flag: 'r' });
//                 data = data.replace('{xyz@gmail.com}', obj.email);
//                 data = data.replace('{Admin@321}', obj.password);
//                 data = data.replace('{loginlink}', obj.loginlink);
//                 break;

//             case 'kitchenAdmin':
//                 data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/cloudkitchen.html'), { encoding: 'utf8', flag: 'r' });
//                 data = data.replace('xyz@gmail.com', obj.email);
//                 data = data.replace('Admin@321', obj.password);
//                 data = data.replace('Admin@321', obj.lisencekey);
//                 data = data.replace('{loginlink}', obj.loginlink);
//                 break;

//             case 'enquiry':
//                 data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/enquiry.html'), { encoding: 'utf8', flag: 'r' });
//                 break;

//             case 'resetpassword':
//                 data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/resetpassword.html'), { encoding: 'utf8', flag: 'r' });
//                 data = data.replace('{otp}', obj.otp);
//                 data = data.replace('{loginlink}', obj.loginlink);
//                 break;

//             case 'subadmin':
//                 data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/employee.html'), { encoding: 'utf8', flag: 'r' });
//                 data = data.replace('{xyz@gmail.com}', obj.email);
//                 data = data.replace('{Admin@321}', obj.password);
//                 data = data.replace('{loginlink}', obj.loginlink);
//                 break;
//         }
//         return data;
//     }

//     try {
//         var res = await sendEmail(email, subject, getEmailHtml(obj))
//         return "successfully sent"
//     } catch (error) {
//         if (error) {
//             return "error found";
//         }
//     }
// }

// async function sendEmail(email, subject, body) {
//     return new Promise((resolve, reject) => {
//         AWS.config.update({
//             accessKeyId: process.env.email_accessKeyId,
//             secretAccessKey: process.env.email_secretAccessKey,
//             region: process.env.region
//         });
//         try {
//             var params = {
//                 Destination: { CcAddresses: [], ToAddresses: [email] },
//                 Message: {
//                     Body: {
//                         Html: {
//                             Charset: "UTF-8",
//                             Data: body
//                         }
//                         ,
//                         Text: {
//                             Charset: "UTF-8",
//                             Data: body
//                         }
//                     },
//                     Subject: {
//                         Charset: 'UTF-8',
//                         Data: subject
//                     }
//                 },
//                 Source: 'KITCH <hemantfealtytechnologies@gmail.com>',
//             };

//             var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
//             sendPromise.then(function () {
//                 resolve("Email Sent to " + email);
//             }).catch(
//                 function (err) {
//                     console.error(err, err.stack);
//                     reject("Failed to send email to " + email)
//                 });
//         } catch (ex) {
//             console.log("emailsent catch", ex)
//             reject("Failed to send email to " + email);
//         }
//     })
// }