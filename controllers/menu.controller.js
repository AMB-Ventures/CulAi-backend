var menu = require("../doa/menu.doa");
var cloudKitchen = require("../doa/vendor.doa");
var subCategory = require("../doa/subCategory.doa");

exports.createMenu = async (req, res, next) => {
  try {
    if (req.params != null && req.params != undefined) {
      var userId = req.params.userId;
      var kitchenId = req.params.kitchenId;
    } else {
      res.json({ error: "request parameters required" });
    }
    let kitchen = await cloudKitchen.getById({ kitchenId: kitchenId });
    if (kitchen.subscription.features) {
      let specificFeature = kitchen.subscription.features.find((j) => {
        if (j._id.featureConstant === "no_of_menus") return j;
      });
      if (specificFeature) {
        let menus = await menu.get({ userId: userId, kitchenId: kitchenId });
        if (menus.length < specificFeature?.count) {
          if (req.body !== undefined && req.body !== null && req.body.data) {
            req.body = JSON.parse(req.body.data);
            let existingMenu = await menu.getOne({
              "vendorConfig.vendorId": {
                $in: req.body.vendorConfig.map((i) => {
                  return i.vendorId;
                }),
              },
              "vendorConfig.vendorMenuId": {
                $in: req.body.vendorConfig.map((i) => {
                  return i.vendorMenuId;
                }),
              },
            });
            if (!existingMenu) {
              let videoResp = null;
              let imageResp = null;
              if (req.files) {
                if (req.files.video) {
                  videoResp = await s3VideoUpload(
                    req.files.video[0],
                    `video/${req.params.kitchenId}`
                  );
                  if (!videoResp.path.Key) {
                    res.status(500).json({ error: "can't upload video" });
                    return;
                  }
                }
                if (req.files.image) {
                  imageResp = await s3ImageUpload(
                    req.files.image[0],
                    `menuimage/${req.params.kitchenId}`
                  );
                  if (!imageResp.path.Key) {
                    res.status(500).json({ error: "can't upload image" });
                    return;
                  }
                }
                var Id = await getNextSequence();
                var menuObject = {
                  kitchenId: kitchenId,
                  userId: userId,
                  menuId: parseInt(Id) + 1,
                  menuName: req.body.menuName,
                  category: req.body.category,
                  subcategory: req.body.subcategory,
                  preparationTime: req.body.preparationTime,
                  description: req.body.description,
                  uploadVideo: videoResp ? videoResp.path.Key : "",
                  uploadImage: imageResp ? imageResp.path.Key : "",
                  chefConfig: req.body.chefConfig,
                  vendorConfig: req.body.vendorConfig,
                  phases: req.body.phases,
                  available: "false",
                };
                let result = await menu.create(menuObject);
                if (result) {
                  res
                    .status(200)
                    .json({ message: "menu created successfully" });
                } else {
                  res.status(500).json({ error: "can't create menu" });
                }
              }
            } else {
              res.status(400).json({ error: "Vendor menu Id already exists." });
            }
          } else {
            res.status(400).json({ error: "required request body" });
          }
        } else
          return res
            .status(400)
            .json({ error: "Upgrade your Subscription. Limit exceed!" });
      } else
        return res
          .status(400)
          .json({ error: "Upgrade your Subscription. Limit exceed!" });
    }
  } catch (e) {
    console.error(e);
  }
};



function getNextSequence() {
  return new Promise((resolve) => {
    return menu
      .findOne()
      .sort([["menuId", "descending"]])
      .limit(1)
      .exec((err, data) => {
        if (data != null) {
          if (data.menuId != undefined) {
            return resolve(data.menuId);
          } else {
            return resolve(0);
          }
        } else return resolve(0);
      });
  });
}

//get all menu
exports.getMenuByCategory = async (req, res, next) => {
  try {
    if (!req.params.categoryId && !req.params.subCategoryId) {
      res.json({ code: 400, message: "request parameters required" });
    }
    let result = await menu.get({
      categoryId: req.params.categoryId,
      subCategoryId: req.params.subCategoryId,
    });
    if (result) {
      res.json({ code: 200, message:"Menu get successfully", data: result });
    } else {
      res.json({ code: 400, message: "Id not found" });
    }
  } catch (err) {
    console.log("Query Error", err);
  }
 
};

