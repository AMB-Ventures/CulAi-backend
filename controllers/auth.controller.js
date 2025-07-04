var user = require("../doa/user.doa");
var log = require("../logger");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("../doa/role.doa");

const consoleLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userDetails = await user.getOne({
      username: username,
      status: "active",
      role: { $in: ["64eb16308dd6c1c54f5ab4e1", "64eb165b8dd6c1c54f5ab4e2"] },
    });

    if (!userDetails) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const comparision = await bcrypt.compare(password, userDetails.password);

    if (!comparision) {
      return res.status(401).json({
        message:
          "Incorrect password! Please enter the correct password and try again.",
      });
    }

    let response = {
      _id: userDetails._id,
      username: userDetails.username,
      name: userDetails.name,
      vendor: userDetails.vendor,
      branch: userDetails.branch,
      station: userDetails.station,
      role: userDetails.role,
    };

    const token = jwt.sign(response, process.env.JWT_KEY);

    res.status(200).json({
      user: { ...response, token: token },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const posLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userDetails = await user.getOne({
      username: username,
      status: "active",
      role: { $nin: ["64eb16308dd6c1c54f5ab4e1", "64eb165b8dd6c1c54f5ab4e2"] },
    });

    if (!userDetails) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const comparision = await bcrypt.compare(password, userDetails.password);

    if (!comparision) {
      return res.status(401).json({
        message:
          "Incorrect password! Please enter the correct password and try again.",
      });
    }

    let response = {
      _id: userDetails._id,
      username: userDetails.username,
      name: userDetails.name,
      vendor: userDetails.vendor,
      branch: userDetails.branch,
      station: userDetails.station,
      role: userDetails.role,
    };

    const token = jwt.sign(response, process.env.JWT_KEY);

    res.status(200).json({
      user: { ...response, token: token },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changeUserPassword = async (req, res, next) => {
  try {
    if (req.params.userId != null && req.params.userId != undefined) {
      var userId = parseInt(req.params.userId);
    } else {
      res.json({ code: 400, message: "request parameters required" });
    }
    if (req.body !== null && req.body !== undefined) {
      let user = await user.getOne({ userId: req.params.userId });
      if (user) {
        if (!bcrypt.compareSync(req.body.currentPassword, user.password)) {
          log.info("current password doesn't matched ===== ");
          res.json({ code: 400, message: "current password doesn't matched" });
        } else {
          if (req.body.confirmPassword == null) {
            res.json({ code: 400, message: "confirm password is required" });
          } else {
            if (req.body.confirmPassword !== req.body.newPassword) {
              log.info("confirm password doesn't matched ===== ");
              res.json({
                code: 400,
                message: "confirm password doesn't matched",
              });
            } else {
              let updateKey = {
                password: bcrypt.hashSync(req.body.newPassword, 10),
              };
              log.info("Updating onboard ===== ");
              let result = await user.updateOne({ userId: userId }, updateKey);
              if (result) {
                res.json({
                  code: 200,
                  message: "Password Updated successfully",
                });
              } else {
                res.json({ code: 500, message: "can't update password" });
              }
            }
          }
        }
      } else {
        res.json({ code: 400, message: "user not found " });
      }
    } else {
      res.json({ code: 400, message: "request body required" });
    }
  } catch (e) {
    console.log(e);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    // Build query based on request parameters
    let query = {
      isDeleted: { $ne: true },
    };

    // Role-based access control
    // If user is not a super admin, filter by their vendor
    if (req.user?.role !== "64eb16308dd6c1c54f5ab4e1") {
      // Super Admin role ID
      query.vendor = req.user?.vendor;
    }

    // Add status filter if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Add role filter if provided
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Add vendor filter if provided (only for super admins)
    if (req.query.vendor && req.user?.role === "64eb16308dd6c1c54f5ab4e1") {
      query.vendor = req.query.vendor;
    }

    // Add branch filter if provided
    if (req.query.branch) {
      query.branch = req.query.branch;
    }

    // Add search by name or username if provided
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { username: { $regex: req.query.search, $options: "i" } },
        { emailId: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalUsers = await user.get(query);
    const totalCount = totalUsers.length;

    // Get paginated results
    const users = await user.get(query);
    const paginatedUsers = users.slice(skip, skip + limit);

    // Format response
    const response = {
      users: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalUsers: totalCount,
        usersPerPage: limit,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  consoleLogin,
  posLogin,
  changeUserPassword,
  getAllUsers,
};
