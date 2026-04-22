const mongoose = require("mongoose");

function formatDateToIST(date) {
    return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const leadTypeMasterSchema = mongoose.Schema({
    lead_type_id: { type: Number },
    lead_type: { type: String, default: "" },
    disp_order: { type: Number },
    status: { type: Number, default: 1 },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: "" },
});

leadTypeMasterSchema.pre("save", async function (next) {
    if (!this.isNew) {
        this.created_date = formatDateToIST(new Date());
        return next();
    }
    try {
        const result = await this.constructor
            .findOne({ lead_type_id: { $exists: true } })
            .sort({ lead_type_id: -1 });
        console.log(
            "Latest lead_type_id fetched:",
            result ? result.lead_type_id : "None"
        );
        console.log("result", result);
        let newTrackId = 1;
        if (result) {
            newTrackId = result.lead_type_id + 1;
            console.log("New lead_type_id generated:", newTrackId);
        }
        this.lead_type_id = newTrackId;
        this.created_date = formatDateToIST(new Date());
        this.updated_date = formatDateToIST(new Date());
        next();
    } catch (err) {
        console.error("Error in generating lead_type_id:", err);
        next(err);
    }
});

module.exports = mongoose.model("lead_type_master", leadTypeMasterSchema);