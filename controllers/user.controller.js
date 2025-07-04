var user = require("../doa/user.doa");
var bcrypt = require("bcrypt");
// var log = require("../logger");
// var exportDoc = require("./export-documents.controller");
// var fs = require("fs");
// const s3ImageUpload = require("./s3ImageUpload.controller");
// var datetime = new Date();

const getUsers = async (req, res, next) => {
  let query = {
    isDeleted: { $ne: true },
  };

  if (req.user?.role.name !== "rahalAdmin") {
    query.vendor = req.user?.vendor._id;
  }

  query.username = { $ne: req.user.username };

  const result = await user.get(query);

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "data not found" });
  }
};

const createUser = async (req, res, next) => {
  try {
    let data = await user.getOne({ username: req.body.username });

    if (data) {
      res.status(500).json({ error: "User already exists" });
    } else {
      if (req.user?.vendor?._id) {
        req.body.vendor = req.user.vendor._id;
      }

      req.body.password = bcrypt.hashSync("letmein", 10);

      // var Id = await getNextSequence();
      // let imageResp = null;
      // if (req.file) {
      //   imageResp = await s3ImageUpload(
      //     req.file,
      //     `menuimage/${req.body.vendorName}`
      //   );
      //   if (!imageResp.path.Key) {
      //     res.status(500).json({ error: "can't upload image" });
      //     return;
      //   }
      // }

      await user.create(req.body);
      let result = await user.getOne({ username: req.body.username });

      res
        .status(200)
        .json({ message: "User created successfully", user: result });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    let updateData = {
      name: req.body.name,
      username: req.body.username,
      phone: req.body.phone,
      role: req.body.role,
      station: req.body.station,
    };

    if (req.body.role === "64eb16308dd6c1c54f5ab4e1") {
      updateData.vendor = null;
    } else if (req.body.role !== "64eb16308dd6c1c54f5ab4e1") {
      if (req.user.role._id === "64eb16308dd6c1c54f5ab4e1") {
        updateData.vendor = req.body.vendor;
      } else {
        updateData.vendor = req.user.vendor?._id;
      }
    }

    if (
      req.body.role !== "64eb16308dd6c1c54f5ab4e1" &&
      req.body.role !== "64eb165b8dd6c1c54f5ab4e2"
    ) {
      // If role is not "64eb16308dd6c1c54f5ab4e1" or "64eb165b8dd6c1c54f5ab4e2"
      updateData.branch = req.body.branch;
    } else updateData.branch = null;

    await user.updateOne({ _id: req.params.userId }, updateData);
    const updatedUser = await user.getOne({ _id: req.params.userId });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserAccountSettings = async (req, res, next) => {
  try {
    let updateData = {};

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (req.body.currentPassword) {
      const userDetails = await user.getOne({
        _id: req.user._id,
      });

      const comparision = await bcrypt.compare(
        req.body.currentPassword,
        userDetails.password
      );

      if (!comparision) {
        return res.status(401).json({
          status: 401,
          message:
            "Incorrect password! Please enter the correct password and try again.",
        });
      }

      updateData.password = bcrypt.hashSync(req.body.newPassword, 10);
    }

    await user.updateOne({ _id: req.user._id }, updateData);

    res
      .status(200)
      .json({ status: 200, message: "Account settings updated successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteUsers = async (req, res, next) => {
  try {
    await user.updateMany(
      { _id: { $in: req.body.userIds } },
      { $set: { isDeleted: true } }
    );

    console.log("User(s) deleted successfully");
    res.status(200).json({ message: "User(s) deleted successfully" });
  } catch (error) {
    console.error("Error deleting user(s)):", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserAccountSettings,
  deleteUsers,
};
