const advisoryMasterModel = require("../models/advisoryMaster.model");

const formatDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

exports.addAdvisory = async (req, res) => {
  try {
    const data = req.body;
    console.log("AdvisoryMaster data:", data);

    const lastData = await advisoryMasterModel
      .find({ status: 1 })
      .sort({ disp_order: -1 })
      .limit(1)
      .lean();

    const lastDisplayValue = lastData.length ? lastData[0].disp_order : 0;
    const displayOrder = lastDisplayValue + 1;

    const result = new advisoryMasterModel({
      advisory: data.advisory,
      disp_order: displayOrder,
    });

    await result.save();

    res.status(201).json({
      success: true,
      message: "Advisory added successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAdvisoryData = async (req, res) => {
  try {
    console.log("Getting advisory data");

    const result = await advisoryMasterModel
      .find({ status: 1 }, { _id: 0 })
      .sort({ advisory_id: -1 })
      .lean();

    const formattedData = result.map((item) => ({
      ...item,
      created_date: formatDate(item.created_date),
      updated_date: formatDate(item.updated_date),
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const { data } = req.body;

    console.log("advisory id", id);
    console.log("current order", data);

    const result = await advisoryMasterModel.findOne({
      advisory_id: id,
      status: 1,
    });
    console.log("result1", result);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Couldn't find a type with the given ID." });
    }
    const allDoc = await advisoryMasterModel.countDocuments({ status: 1 });

    const currdocOrder = parseInt(result?.disp_order, 10);
    const newOrder = parseInt(data, 10);

    if (newOrder > allDoc || newOrder < 1) {
      return res.status(400).json({
        success: false,
        message: `Display order must be between 1 and ${allDoc}.`,
        resetOrder: currdocOrder,
      });
    }
    if (newOrder < currdocOrder) {
      await advisoryMasterModel.updateMany(
        {
          disp_order: { $gte: newOrder, $lt: currdocOrder },
          status: 1,
        },
        { $inc: { disp_order: 1 } }
      );
    } else if (newOrder > currdocOrder) {
      await advisoryMasterModel.updateMany(
        {
          disp_order: { $gt: currdocOrder, $lte: newOrder },
          status: 1,
        },
        { $inc: { disp_order: -1 } }
      );
    }

    await advisoryMasterModel.updateOne(
      { advisory_id: id },
      {
        $set: {
          disp_order: newOrder,
          updated_date: new Date(),
        },
      }
    );
    res
      .status(200)
      .json({ success: true, message: "disp_order update successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAdvisory = async (req, res) => {
  try {
    const advisoryId = req.body.advisory_id;

    if (!advisoryId) {
      return res.status(400).json({
        success: false,
        message: "advisory_id is required",
      });
    }

    const existingAdvisory = await advisoryMasterModel.findOne(
      {
        advisory_id: advisoryId,
        advisory: req.body.advisory,
        status: 1,
      },
      { _id: 0 }
    );

    if (existingAdvisory) {
      return res
        .status(200)
        .json({ success: false, message: "Advisory Already Exist" });
    }

    const updateData = {
      advisory: req.body.advisory,
      updated_date: new Date(),
    };

    console.log("updateData", updateData);

    const result = await advisoryMasterModel.findOneAndUpdate(
      {
        advisory_id: advisoryId,
        status: 1,
      },
      {
        $set: { ...updateData },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Advisory not found or inactive (status ≠ 1)",
      });
    }

    console.log("result", result);

    res.status(200).json({
      success: true,
      message: "Advisory updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update advisory error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeAdvisory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Removing advisory with ID:", typeof Number(id), id);
    if (!id) {
      return res.status(400).json({ message: "advisory ID is required" });
    }
    const removedAdvisory = await advisoryMasterModel.findOneAndUpdate(
      { advisory_id: Number(id) },
      { $set: { status: 0 } },
      { new: true }
    );
    if (!removedAdvisory) {
      return res.status(404).json({ message: "Advisory not found" });
    }
    res.status(200).json({
      success: true,
      message: "Advisory removed successfully",
      data: removedAdvisory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove Advisory",
      error: error.message,
    });
  }
};
