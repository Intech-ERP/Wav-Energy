const leadTypeMaster = require("../models/leadTypeMaster.model");

const formatDate = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};


exports.addLeadType = async (req, res) => {
    try {
        const leadType = req.body.lead_type;
        console.log("LeadTypeMaster data:", leadType);

        const existingLeadType = await leadTypeMaster.findOne(
            {
                lead_type: leadType,
                status: 1,
            },
            { _id: 0 }
        );

        if (existingLeadType) {
            return res
                .status(200)
                .json({ success: false, message: "Lead type already exists" });
        }

        const lastData = await leadTypeMaster
            .find({ status: 1 })
            .sort({ disp_order: -1 })
            .limit(1)
            .lean();

        const lastDisplayValue = lastData.length ? lastData[0].disp_order : 0;
        const displayOrder = lastDisplayValue + 1;

        const result = new leadTypeMaster({
            lead_type: leadType,
            disp_order: displayOrder,
        });

        await result.save();

        res.status(201).json({
            success: true,
            message: "Lead type added successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getLeadTypes = async (req, res) => {
    try {
        console.log("Getting lead types");

        const result = await leadTypeMaster
            .find({ status: 1 }, { _id: 0 })
            .sort({ lead_type: -1 })
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

        console.log("lead type id", id);
        console.log("current order", data);

        const result = await leadTypeMaster.findOne({
            lead_type_id: id,
            status: 1,
        });
        console.log("result1", result);
        if (!result) {
            return res
                .status(404)
                .json({ message: "Couldn't find a type with the given ID." });
        }
        const allDoc = await leadTypeMaster.countDocuments({ status: 1 });

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
            await leadTypeMaster.updateMany(
                {
                    disp_order: { $gte: newOrder, $lt: currdocOrder },
                    status: 1,
                },
                { $inc: { disp_order: 1 } }
            );
        } else if (newOrder > currdocOrder) {
            await leadTypeMaster.updateMany(
                {
                    disp_order: { $gt: currdocOrder, $lte: newOrder },
                    status: 1,
                },
                { $inc: { disp_order: -1 } }
            );
        }

        await leadTypeMaster.updateOne(
            { lead_type_id: id },
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

exports.updateLeadType = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "lead_type_id is required",
            });
        }

        const existingLeadType = await leadTypeMaster.findOne(
            {
                lead_type: data.lead_type,
                status: 1,
            },
            { _id: 0 }
        );

        if (existingLeadType) {
            return res
                .status(200)
                .json({ success: false, message: "Lead type already exists" });
        }

        const updateData = {
            lead_type: data.lead_type,
            updated_date: new Date(),
        };

        console.log("updateData", updateData);

        const result = await leadTypeMaster.findOneAndUpdate(
            {
                lead_type_id: data.lead_type_id,
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
                message: "Lead type not found or inactive (status ≠ 1)",
            });
        }

        console.log("result", result);

        res.status(200).json({
            success: true,
            message: "Lead type updated successfully",
            data: result,

        });
    } catch (error) {
        console.error("Update lead type error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.removeLeadType = async (req, res) => {
    console.log("Removing lead type with ID:", req.params.id);
    try {
        const { id } = req.params;
        console.log("Removing lead type with ID:", typeof Number(id), id);
        if (!id) {
            return res.status(400).json({ message: "lead type ID is required" });
        }
        const removedLeadType = await leadTypeMaster.findOneAndUpdate(
            { lead_type_id: Number(id) },
            { $set: { status: 0 } },
            { new: true }
        );
        if (!removedLeadType) {
            return res.status(404).json({ message: "Lead type not found" });
        }
        res.status(200).json({
            success: true,
            message: "Lead type removed successfully",
            data: removedLeadType,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove Lead type",
            error: error.message,
        });
    }
};