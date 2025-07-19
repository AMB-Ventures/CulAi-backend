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
        fs.writeFileSync("./views/download-file/" + csvFileName + ".csv", csv);
        return "./views/download-file/" + csvFileName + ".csv"
    } catch (err) {
        console.error(err);
    }
}

exports.getXLSX = async (result, xlFileName) => {
    try {
        var xls = json2xls(result);
        fs.writeFileSync("./views/download-file/" + xlFileName + ".xlsx", xls, 'binary');
        return "./views/download-file/" + xlFileName + ".xlsx"
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
                    pdf.create(data, options).toFile("./views/download-file/" + pdfFileName + ".pdf", function (err, response) {
                        if (err) {
                            console.log(err)
                            rej(err)
                        } else {
                            console.log(response);
                            res("./views/download-file/" + pdfFileName + ".pdf");
                        }
                    });
                }
            });
        })
    } catch (err) {
        console.error(err);
    }
}