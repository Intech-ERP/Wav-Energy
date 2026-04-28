const mongoose = require("mongoose");

function formatDateToIST(date) {
    return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const nextActionMasterSchema = mongoose.Schema({
    next_action_id: { type: Number },
    next_action: { type: String, default: "" },
    disp_order: { type: Number },
    status: { type: Number, default: 1 },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: "" },
});

nextActionMasterSchema.pre("save", async function (next) {
    if (!this.isNew) {
        this.created_date = formatDateToIST(new Date());
        return next();
    }
    try {
        const result = await this.constructor
            .findOne({ next_action_id: { $exists: true } })
            .sort({ next_action_id: -1 });
        console.log(
            "Latest next_action_id fetched:",
            result ? result.next_action_id : "None"
        );
        console.log("result", result);
        let newTrackId = 1;
        if (result) {
            newTrackId = result.next_action_id + 1;
            console.log("New next_action_id generated:", newTrackId);
        }
        this.next_action_id = newTrackId;
        this.created_date = formatDateToIST(new Date());
        this.updated_date = formatDateToIST(new Date());
        next();
    } catch (err) {
        console.error("Error in generating next_action_id:", err);
        next(err);
    }
});

module.exports = mongoose.model("next_action_master", nextActionMasterSchema);