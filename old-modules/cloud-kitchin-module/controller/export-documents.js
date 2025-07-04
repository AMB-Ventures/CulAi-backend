const { Parser } = require('json2csv');
var json2xls = require('json2xls');
var pdf = require('html-pdf');
var ejs = require('ejs')
const fs = require('fs');

//delete file after download code needed

// export to csv file
exports.getCSV = async (result, fields, csvFileName) => {
    try {
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(result);
        fs.writeFileSync("./views/" + csvFileName + ".csv", csv);
        return "./views/" + csvFileName + ".csv"
    } catch (err) {
        console.error(err);
    }
}

exports.getXLSX = (result, fields, xlFileName) => {
    try {
        var xls = json2xls(result, {
            fields: fields
        });
        fs.writeFileSync("./views/" + xlFileName + ".xlsx", xls, 'binary');
        return "./views/" + xlFileName + ".xlsx"
    } catch (err) {
        console.error(err);
    }
}

exports.getPdf = async (result, pdfFileName, templateFileName) => {
    try {
        return new Promise((res, rej) => {
            ejs.renderFile('./views/' + templateFileName + '.ejs', { "data": result }, (err, data) => {
                if (err) {
                    rej(err);
                } else {
                    let options = {
                        "height": "20.25in",
                        "width": "18.5in",
                        "header": {
                            "height": "20mm"
                        },
                        "footer": {
                            "height": "20mm",
                        },
                    };
                    pdf.create(data, options).toFile("./views/" + pdfFileName + ".pdf", function (err, response) {
                        if (err) {
                            console.log(err)
                            rej(err)
                        } else {
                            console.log(response);
                            res("./views/" + pdfFileName + ".pdf");
                        }
                    });
                }
            });
        })
    } catch (err) {
        console.error(err);
    }
}