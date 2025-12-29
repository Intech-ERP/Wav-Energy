const operation_master = require("../models/OperationMaster.model");
const formatDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

exports.addOperation = async (req, res) => {
  try {
    const data = req.body;
    console.log("data", data);
    const lastData = await operation_master
      .find({ status: 1 })
      .sort({ disp_order: -1 })
      .limit(1)
      .lean();

    const lastDisplayValue = lastData.length ? lastData[0].disp_order : 0;
    const displayOrder = lastDisplayValue + 1;

    const result = new operation_master({
      operation: data.operation,
      disp_order: displayOrder,
    });

    await result.save();

    console.log("result", result);

    res.status(201).json({
      success: true,
      message: "Operation Added successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOperation = async (req, res) => {
  try {
    const result = await operation_master
      .find({ status: 1 }, { _id: 0 })
      .lean();
    if (!result) {
      return res
        .status(400)
        .json({ success: true, message: "operationMaster data not found!" });
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

    console.log("operation id", id);
    console.log("current order", data);

    const result = await operation_master.findOne({
      operation_id: id,
      status: 1,
    });
    console.log("result1", result);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Couldn't find a type with the given ID." });
    }
    const allDoc = await operation_master.countDocuments({ status: 1 });

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
      await operation_master.updateMany(
        {
          disp_order: { $gte: newOrder, $lt: currdocOrder },
          status: 1,
        },
        { $inc: { disp_order: 1 } }
      );
    } else if (newOrder > currdocOrder) {
      await operation_master.updateMany(
        {
          disp_order: { $gt: currdocOrder, $lte: newOrder },
          status: 1,
        },
        { $inc: { disp_order: -1 } }
      );
    }

    await operation_master.updateOne(
      { operation_id: id },
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

exports.updateOperation = async (req, res) => {
  try {
    const operationId = req.body.operation_id;

    console.log("req body", req.body);

    if (!operationId) {
      return res.status(400).json({
        success: false,
        message: "operation_id is required",
      });
    }

    const existingOperation = await operation_master.findOne(
      {
        operation_id: operationId,
        operation: req.body.operation,
        status: 1,
      },
      { _id: 0 }
    );

    if (existingOperation) {
      return res
        .status(200)
        .json({ success: false, message: "Operation Already Exist" });
    }

    const updateData = {
      operation: req.body.operation,
      updated_date: new Date(),
    };

    console.log("updateData", updateData);

    const result = await operation_master.findOneAndUpdate(
      {
        operation_id: operationId,
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
        message: "Operation not found or inactive (status ≠ 1)",
      });
    }

    console.log("result", result);

    res.status(200).json({
      success: true,
      message: "Operation updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Operation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeOperation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Removing operation with ID:", typeof Number(id), id);
    if (!id) {
      return res.status(400).json({ message: "operation ID is required" });
    }
    const removedOperation = await operation_master.findOneAndUpdate(
      { operation_id: Number(id) },
      { $set: { status: 0 } },
      { new: true }
    );
    if (!removedOperation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    res.status(200).json({
      success: true,
      message: "Operation removed successfully",
      data: removedOperation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove Operation",
      error: error.message,
    });
  }
};
