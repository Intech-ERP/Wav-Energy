const mongoose = require("mongoose");

function formatDateToIST(date) {
    return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const leadSourceMasterSchema = mongoose.Schema({
    lead_source_id: { type: Number },
    lead_source: { type: String, default: "" },
    disp_order: { type: Number },
    status: { type: Number, default: 1 },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: "" },
});

leadSourceMasterSchema.pre("save", async function (next) {
    if (!this.isNew) {
        this.created_date = formatDateToIST(new Date());
        return next();
    }
    try {
        const result = await this.constructor
            .findOne({ lead_source_id: { $exists: true } })
            .sort({ lead_source_id: -1 });
        console.log(
            "Latest lead_source_id fetched:",
            result ? result.lead_source_id : "None"
        );
        console.log("result", result);
        let newTrackId = 1;
        if (result) {
            newTrackId = result.lead_source_id + 1;
            console.log("New lead_source_id generated:", newTrackId);
        }
        this.lead_source_id = newTrackId;
        this.created_date = formatDateToIST(new Date());
        this.updated_date = formatDateToIST(new Date());
        next();
    } catch (err) {
        console.error("Error in generating lead_source_id:", err);
        next(err);
    }
});

module.exports = mongoose.model("lead_source_master", leadSourceMasterSchema);