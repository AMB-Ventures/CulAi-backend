var role = require("../doa/role.doa");

const getRoles = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role._id !== "64eb16308dd6c1c54f5ab4e1") {
      query._id = { $ne: "64eb16308dd6c1c54f5ab4e1" };
    }

    const result = await role.find(query).sort({ name: -1 });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoles,
};
