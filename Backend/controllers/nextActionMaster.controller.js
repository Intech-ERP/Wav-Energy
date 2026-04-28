const nextActionMaster = require("../models/nextActionMaster.model");

const formatDate = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

exports.addNextAction = async (req, res) => {
    try {
        const nextAction = req.body.next_action;
        console.log("NextActionMaster data:", nextAction);

        const existingNextAction = await nextActionMaster.findOne(
            {
                next_action: nextAction,
                status: 1,
            },
            { _id: 0 }
        );

        if (existingNextAction) {
            return res
                .status(200)
                .json({ success: false, message: "Next action already exists" });
        }

        const lastData = await nextActionMaster
            .find({ status: 1 })
            .sort({ disp_order: -1 })
            .limit(1)
            .lean();

        const lastDisplayValue = lastData.length ? lastData[0].disp_order : 0;
        const displayOrder = lastDisplayValue + 1;

        const result = new nextActionMaster({
            next_action: nextAction,
            disp_order: displayOrder,
        });

        await result.save();

        res.status(201).json({
            success: true,
            message: "Next action added successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getNextAction = async (req, res) => {
    try {
        const result = await nextActionMaster
            .find({ status: 1 }, { _id: 0 })
            .sort({ next_action: -1 })
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

        const result = await nextActionMaster.findOne({
            next_action_id: id,
            status: 1,
        });

        if (!result) {
            return res
                .status(404)
                .json({ message: "Couldn't find a next action with the given ID." });
        }
        const allDoc = await nextActionMaster.countDocuments({ status: 1 });

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
            await nextActionMaster.updateMany(
                {
                    disp_order: { $gte: newOrder, $lt: currdocOrder },
                    status: 1,
                },
                { $inc: { disp_order: 1 } }
            );
        } else if (newOrder > currdocOrder) {
            await nextActionMaster.updateMany(
                {
                    disp_order: { $gt: currdocOrder, $lte: newOrder },
                    status: 1,
                },
                { $inc: { disp_order: -1 } }
            );
        }

        await nextActionMaster.updateOne(
            { next_action_id: id },
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

exports.updateNextAction = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "next_action_id is required",
            });
        }

        const existingNextAction = await nextActionMaster.findOne(
            {
                next_action: data.next_action,
                status: 1,
            },
            { _id: 0 }
        );

        if (existingNextAction) {
            return res
                .status(200)
                .json({ success: false, message: "Next action already exists" });
        }

        const updateData = {
            next_action: data.next_action,
            updated_date: new Date(),
        };

        const result = await nextActionMaster.findOneAndUpdate(
            {
                next_action_id: data.next_action_id,
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
                message: "Next action not found or inactive (status ≠ 1)",
            });
        }

        console.log("result", result);

        res.status(200).json({
            success: true,
            message: "Next action updated successfully",
            data: result,

        });
    } catch (error) {
        console.error("Update next action error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.removeNextAction = async (req, res) => {

    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "next action ID is required" });
        }
        const removedNextAction = await nextActionMaster.findOneAndUpdate(
            { next_action_id: Number(id) },
            { $set: { status: 0 } },
            { new: true }
        );
        if (!removedNextAction) {
            return res.status(404).json({ message: "Next action not found" });
        }
        res.status(200).json({
            success: true,
            message: "Next action removed successfully",
            data: removedNextAction,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove Next action",
            error: error.message,
        });
    }
};

