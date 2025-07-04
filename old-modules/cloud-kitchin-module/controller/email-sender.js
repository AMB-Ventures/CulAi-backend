const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
// exports.sendEmail = async function emailService(email, subject, obj) {
//     if (!obj.type) return "error found";
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//     const getEmailHtml = (obj) => {
//         let data = "";
//         switch (obj.type) {
//             case 'welcome':
//                 data = fs.readFileSync('html12.html', { encoding: 'utf8', flag: 'r' });
//                 data = data.replace('{xyz@gmail.com}', obj.email);
//                 data = data.replace('{Admin@321}', obj.password);
//                 data = data.replace('{loginlink}', obj.password);
//                 break;
//         }
//         return data;
//     }

//     const msg = {
//         to: email,
//         from: process.env.sendFrom,
//         subject: subject,
//         text: "",
//         html: getEmailHtml(obj)
//     };

//     try {
//         var res = await sgMail.send(msg);
//         consoe.log(JSON.stringify(res));
//         return "successfully sent"
//     } catch (error) {
//         if (error.response) {
//             console.error(error.response.body)
//             return "error found";
//         }
//     }
// }

exports.sendEmailNew = async function emailService(email, subject, obj) {
    if (!obj.type) return "error found";
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const getEmailHtml = (obj) => {
        let data = "";
        switch (obj.type) {
            case 'employee':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/employee.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('xyz@gmail.com', obj.email);
                data = data.replace('John Doe', obj.name);
                data = data.replace('Role Name', obj.role);
                data = data.replace('Admin@321', obj.password);
                data = data.replace('xxx-xxx-xx', obj.loginlink);
                break;

            case 'kitchenAdmin':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/cloudkitchen.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('{xyz@gmail.com}', obj.email);
                data = data.replace('{Admin@321}', obj.password);
                data = data.replace('{Admin@321}', obj.lisencekey);
                data = data.replace('{loginlink}', obj.loginlink);
                break;

            case 'enquiry':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/enquiry.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('{loginlink}', obj.loginlink);
                break;

            case 'approved enquiry':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/enquiryApprove.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('{loginlink}', obj.loginlink);
                break;

            case 'refused enquiry':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/enquiryRejected.html'), { encoding: 'utf8', flag: 'r' });
                break;

            case 'resetpassword':
                data = fs.readFileSync(path.join(__dirname + '/../emailtemplate/resetpassword.html'), { encoding: 'utf8', flag: 'r' });
                data = data.replace('John Doe', obj.name);
                data = data.replace('{otp}', obj.otp);
                // data = data.replace('{loginlink}', obj.loginlink);
                break;
        }
        return data;
    }

    const msg = {
        to: email,
        from: process.env.sendFrom,
        subject: subject,
        text: "Kitchin",
        html: getEmailHtml(obj)
    };

    try {
        var res = await sgMail.send(msg);
        consoe.log(JSON.stringify(res));
        return "successfully sent"
    } catch (error) {
        if (error.response) {
            console.error(error.response.body)
            return "error found";
        }
    }
}