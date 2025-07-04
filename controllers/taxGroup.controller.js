var taxGroup = require("../doa/taxGroup.doa");

const getTaxGroups = async (req, res, next) => {
  try {
    const result = await taxGroup.find();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getTaxGroups,
};
