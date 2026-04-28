const leadSourceMaster = require("../models/leadSourceMaster.model");


const formatDate = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

exports.addLeadSource = async (req, res) => {
    try {
        const leadSource = req.body.lead_source;
        console.log("LeadSourceMaster data:", leadSource);

        const existingLeadSource = await leadSourceMaster.findOne(
            {
                lead_source: leadSource,
                status: 1,
            },
            { _id: 0 }
        );

        if (existingLeadSource) {
            return res
                .status(200)
                .json({ success: false, message: "Lead source already exists" });
        }

        const lastData = await leadSourceMaster
            .find({ status: 1 })
            .sort({ disp_order: -1 })
            .limit(1)
            .lean();

        const lastDisplayValue = lastData.length ? lastData[0].disp_order : 0;
        const displayOrder = lastDisplayValue + 1;

        const result = new leadSourceMaster({
            lead_source: leadSource,
            disp_order: displayOrder,
        });

        await result.save();

        res.status(201).json({
            success: true,
            message: "Lead source added successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getLeadSource = async (req, res) => {
    try {


        const result = await leadSourceMaster
            .find({ status: 1 }, { _id: 0 })
            .sort({ lead_source: -1 })
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
}

exports.updateDisplayOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const { data } = req.body;

        const result = await leadSourceMaster.findOne({
            lead_source_id: id,
            status: 1,
        });

        if (!result) {
            return res
                .status(404)
                .json({ message: "Couldn't find a source with the given ID." });
        }
        const allDoc = await leadSourceMaster.countDocuments({ status: 1 });

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
            await leadSourceMaster.updateMany(
                {
                    disp_order: { $gte: newOrder, $lt: currdocOrder },
                    status: 1,
                },
                { $inc: { disp_order: 1 } }
            );
        } else if (newOrder > currdocOrder) {
            await leadSourceMaster.updateMany(
                {
                    disp_order: { $gt: currdocOrder, $lte: newOrder },
                    status: 1,
                },
                { $inc: { disp_order: -1 } }
            );
        }

        await leadSourceMaster.updateOne(
            { lead_source_id: id },
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
}

exports.updateLeadSource = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "lead_source_id is required",
            });
        }

        const existingLeadSource = await leadSourceMaster.findOne(
            {
                lead_source: data.lead_source,
                status: 1,
            },
            { _id: 0 }
        );

        if (existingLeadSource) {
            return res
                .status(200)
                .json({ success: false, message: "Lead source already exists" });
        }

        const updateData = {
            lead_source: data.lead_source,
            updated_date: new Date(),
        };

        const result = await leadSourceMaster.findOneAndUpdate(
            {
                lead_source_id: data.lead_source_id,
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
                message: "Lead source not found or inactive (status ≠ 1)",
            });
        }

        console.log("result", result);

        res.status(200).json({
            success: true,
            message: "Lead source updated successfully",
            data: result,

        });
    } catch (error) {
        console.error("Update lead source error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.removeLeadSource = async (req, res) => {

    try {
        const { id } = req.params;
        console.log("Removing lead type with ID:", typeof Number(id), id);
        if (!id) {
            return res.status(400).json({ message: "lead source ID is required" });
        }
        const removedLeadSource = await leadSourceMaster.findOneAndUpdate(
            { lead_source_id: Number(id) },
            { $set: { status: 0 } },
            { new: true }
        );
        if (!removedLeadSource) {
            return res.status(404).json({ message: "Lead source not found" });
        }
        res.status(200).json({
            success: true,
            message: "Lead source removed successfully",
            data: removedLeadSource,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove Lead source",
            error: error.message,
        });
    }
};