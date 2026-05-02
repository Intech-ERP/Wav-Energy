const natureofBusinessMaster = require("../models/natureofBusinessMaster.model");

const formatDate = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

exports.addNatureofBusiness = async (req, res) => {
    try {
        const natureofBusiness = req.body.nature_of_business;
        console.log("natureofBusiness data:", natureofBusiness);

        const existingNatureofBusiness = await natureofBusinessMaster.findOne(
            {
                nature_of_business: natureofBusiness,
                status: 1,
            },
            { _id: 0 }
        );

        if (existingNatureofBusiness) {
            return res
                .status(200)
                .json({ success: false, message: "Nature of Business already exists" });
        }

        const lastData = await natureofBusinessMaster
            .find({ status: 1 })
            .sort({ disp_order: -1 })
            .limit(1)
            .lean();

        const lastDisplayValue = lastData.length ? lastData[0].disp_order : 0;
        const displayOrder = lastDisplayValue + 1;

        const result = new natureofBusinessMaster({
            nature_of_business: natureofBusiness,
            disp_order: displayOrder,
        });

        await result.save();

        res.status(201).json({
            success: true,
            message: "Nature of Business added successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getNatureofBusiness = async (req, res) => {
    try {
        const result = await natureofBusinessMaster
            .find({ status: 1 }, { _id: 0 })
            .sort({ nature_of_business: -1 })
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

        const result = await natureofBusinessMaster.findOne({
            nature_of_business_id: id,
            status: 1,
        });

        if (!result) {
            return res
                .status(404)
                .json({ message: "Couldn't find a nature of Business with the given ID." });
        }
        const allDoc = await natureofBusinessMaster.countDocuments({ status: 1 });

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
            await natureofBusinessMaster.updateMany(
                {
                    disp_order: { $gte: newOrder, $lt: currdocOrder },
                    status: 1,
                },
                { $inc: { disp_order: 1 } }
            );
        } else if (newOrder > currdocOrder) {
            await natureofBusinessMaster.updateMany(
                {
                    disp_order: { $gt: currdocOrder, $lte: newOrder },
                    status: 1,
                },
                { $inc: { disp_order: -1 } }
            );
        }

        await natureofBusinessMaster.updateOne(
            { nature_of_business_id: id },
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
        console.error(error)
        res.status(400).json({ success: false, message: error.message });
    }
}

exports.updateNatureofBusiness = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "nature of Business id is required",
            });
        }

        const existingNatureofBusiness = await natureofBusinessMaster.findOne(
            {
                nature_of_business: data.nature_of_business,
                status: 1,
            },
            { _id: 0 }
        );

        if (existingNatureofBusiness) {
            return res
                .status(200)
                .json({ success: false, message: "Nature of Business already exists" });
        }

        const updateData = {
            nature_of_business: data.nature_of_business,
            updated_date: new Date(),
        };

        const result = await natureofBusinessMaster.findOneAndUpdate(
            {
                nature_of_business_id: data.nature_of_business_id,
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
                message: "Nature of Business not found or inactive (status ≠ 1)",
            });
        }

        console.log("result", result);

        res.status(200).json({
            success: true,
            message: "Nature of business updated successfully",
            data: result,

        });
    } catch (error) {
        console.error("Update Nature of Business error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.removeNatureofBusiness = async (req, res) => {

    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "nature of Business ID is required" });
        }
        const removedNatureofBusiness = await natureofBusinessMaster.findOneAndUpdate(
            { nature_of_business_id: Number(id) },
            { $set: { status: 0 } },
            { new: true }
        );
        if (!removedNatureofBusiness) {
            return res.status(404).json({ message: "Nature of business not found" });
        }
        res.status(200).json({
            success: true,
            message: "Nature of Business removed successfully",
            data: removedNatureofBusiness,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove Nature of Business",
            error: error.message,
        });
    }
};