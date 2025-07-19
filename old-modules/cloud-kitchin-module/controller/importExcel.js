const xlstojson = require("xls-to-json");
const xlsxtojson = require('xlsx-to-json');
const menu = require('../doa/menu');
const fs = require('fs')
const path = require('path')

exports.importExcel = async function (req, res) {

    try {
        let menuId = await getNextSequence();
        let excel2json;
        var kitchenId = req.params.kitchenId;
        var userId = req.params.userId;
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            excel2json = xlsxtojson;
        } else {
            excel2json = xlstojson;
        }
        var outputfile = Date.now() + ".json"
        //  code to convert excel data to json  format
        excel2json({
            input: req.file.path,
            output: outputfile, // output json 
            lowerCaseHeaders: true
        }, async function (err, result) {
            if (err) {
                res.json(err);
            } else {
                fs.unlinkSync(path.resolve(req.file.path));
                // fs.unlinkSync(path.resolve(outputfile));
                if (result.length) {
                    let group = result.reduce((r, a) => {
                        if (a.menu_name) r[a.menu_name] = [...r[a.menu_name] || [], a];
                        return r;
                    }, {});
                    Object.keys(group).forEach(async (e) => {
                        menuId = parseInt(menuId) + 1;
                        let element = group[e][0];
                        var menuObject = {
                            menuId: menuId,
                            kitchenId: kitchenId,
                            userId: userId,
                            menuName: element.menu_name,
                            category: element.menu_category,
                            subcategory: element.menu_subCategory,
                            description: element.menu_Preparation_Details,
                            chefConfig: [{
                                chef: element.chef,
                                skillsRating: element.skills_Rating
                            }],
                            vendorConfig: {
                                vendorId: element.vendor_Name,
                                vendorMenuId: element['vendor _MenuId']
                            }
                        };
                        let p = 0;
                        let g = group[e].reduce((r, a) => {
                            r[a.stage_name] = [...r[a.stage_name] || [], a];
                            return r;
                        }, {});


                        let o = {};
                        Object.keys(g).map(l => {
                            p = p + parseInt(g[l][0]['preparation _Time'])
                            let nobj = {
                                ingredients: [],
                                quantity: [],
                                units: [],
                                preparationTime: parseInt(g[l][0]['preparation _Time'])
                            }
                            group[e].map(o => {
                                nobj.ingredients.push(o.ingredients);
                                nobj.quantity.push(o.quantity);
                                nobj.units.push(o.units);
                            })
                            o[l] = nobj
                        })
                        menuObject.phases = [o];
                        menuObject.preparationTime = p;
                        let data = await menu.create(menuObject);
                        console.log(data);
                    });
                    res.json("menus created successfully ");
                } else {
                    res.json("No data ");
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
};

async function getNextSequence() {
    return new Promise(resolve => {
        return menu.findOne().sort([
            ['menuId', 'descending']
        ]).limit(1).exec((err, data) => {
            if (data != null) {
                if (data.menuId != undefined) {
                    return resolve(data.menuId)
                } else {
                    return resolve(0)
                }
            } else return resolve(0)
        })
    })
}