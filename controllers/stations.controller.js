var stations = require("../doa/stations.doa");

const getVendorStations = async (req, res, next) => {
  try {
    let result = await stations.getVendorStations({
      isDeleted: { $ne: true },
      ...(!!req.user?.vendor ? { vendor: req.user.vendor._id } : {}),
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createVendorStations = async (req, res, next) => {
  try {
    const data = await stations.createVendorStations({
      name: req.body.name,
      vendor: req.user.vendor._id,
      // branch: req.body.branch.value,
    });

    res
      .status(200)
      .json({ message: "Station created successfully", stations: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateVendorStations = async (req, res, next) => {
  try {
    const data = await stations.updateVendorStations(
      { _id: req.params.stationId },
      {
        name: req.body.name,
      }
    );

    res
      .status(200)
      .json({ message: "Station updated successfully", stations: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteVendorStations = async (req, res, next) => {
  try {
    await stations.updateMany(
      { _id: { $in: req.body.stationIds } },
      { $set: { isDeleted: true } }
    );

    res.status(200).json({ message: "Station(s) deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getVendorStations,
  createVendorStations,
  updateVendorStations,
  deleteVendorStations,
};
