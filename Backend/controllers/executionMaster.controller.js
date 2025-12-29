const execution_master = require("../models/executionMaster.model");
const formatDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

exports.addExecution = async (req, res) => {
  try {
    const data = req.body;
    console.log("data", data);
    const lastData = await execution_master
      .find({ status: 1 })
      .sort({ disp_order: -1 })
      .limit(1)
      .lean();

    const lastDisplayValue = lastData.length ? lastData[0].disp_order : 0;
    const displayOrder = lastDisplayValue + 1;

    const result = new execution_master({
      execution: data.execution,
      disp_order: displayOrder,
    });

    await result.save();

    console.log("result", result);

    res.status(201).json({
      success: true,
      message: "Execution Added successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExecution = async (req, res) => {
  try {
    const result = await execution_master
      .find({ status: 1 }, { _id: 0 })
      .lean();
    if (!result) {
      return res
        .status(400)
        .json({ success: true, message: "executionMaster data not found!" });
    }
    const formattedData = result.map((item) => ({
      ...item,
      created_date: formatDate(item.created_date),
      updated_date: formatDate(item.updated_date),
    }));
    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

exports.updateDisplayOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const { data } = req.body;

    console.log("execution id", id);
    console.log("current order", data);

    const result = await execution_master.findOne({
      execution_id: id,
      status: 1,
    });
    console.log("result1", result);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Couldn't find a type with the given ID." });
    }
    const allDoc = await execution_master.countDocuments({ status: 1 });

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
      await execution_master.updateMany(
        {
          disp_order: { $gte: newOrder, $lt: currdocOrder },
          status: 1,
        },
        { $inc: { disp_order: 1 } }
      );
    } else if (newOrder > currdocOrder) {
      await execution_master.updateMany(
        {
          disp_order: { $gt: currdocOrder, $lte: newOrder },
          status: 1,
        },
        { $inc: { disp_order: -1 } }
      );
    }

    await execution_master.updateOne(
      { execution_id: id },
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

exports.updateExecution = async (req, res) => {
  try {
    const executionId = req.body.execution_id;

    console.log("req body", req.body);

    if (!executionId) {
      return res.status(400).json({
        success: false,
        message: "executionId is required",
      });
    }

    const existingAdvisory = await execution_master.findOne(
      {
        execution_id: executionId,
        execution: req.body.execution,
        status: 1,
      },
      { _id: 0 }
    );

    if (existingAdvisory) {
      return res
        .status(200)
        .json({ success: false, message: "Execution Already Exist" });
    }

    const updateData = {
      execution: req.body.execution,
      updated_date: new Date(),
    };

    console.log("updateData", updateData);

    const result = await execution_master.findOneAndUpdate(
      {
        execution_id: executionId,
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
        message: "Execution not found or inactive (status ≠ 1)",
      });
    }

    console.log("result", result);

    res.status(200).json({
      success: true,
      message: "Execution updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Execution error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeExecution = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Removing execution with ID:", typeof Number(id), id);
    if (!id) {
      return res.status(400).json({ message: "Execution ID is required" });
    }
    const removedCustomer = await execution_master.findOneAndUpdate(
      { execution_id: Number(id) },
      { $set: { status: 0 } },
      { new: true }
    );
    if (!removedCustomer) {
      return res.status(404).json({ message: "Execution not found" });
    }
    res.status(200).json({
      success: true,
      message: "Execution removed successfully",
      data: removedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove Execution",
      error: error.message,
    });
  }
};
