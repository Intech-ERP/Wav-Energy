const mongoose = require("mongoose");

function formatDateToIST(date) {
    return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const natureofBusinessMasterSchema = mongoose.Schema({
    nature_of_business_id: { type: Number },
    nature_of_business: { type: String, default: "" },
    disp_order: { type: Number },
    status: { type: Number, default: 1 },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: "" },
});

natureofBusinessMasterSchema.pre("save", async function (next) {
    if (!this.isNew) {
        this.created_date = formatDateToIST(new Date());
        return next();
    }
    try {
        const result = await this.constructor
            .findOne({ nature_of_business_id: { $exists: true } })
            .sort({ nature_of_business_id: -1 });
        console.log(
            "Latest nature_of_business_id fetched:",
            result ? result.nature_of_business_id : "None"
        );
        console.log("result", result);
        let newTrackId = 1;
        if (result) {
            newTrackId = result.nature_of_business_id + 1;
            console.log("New nature_of_business_id generated:", newTrackId);
        }
        this.nature_of_business_id = newTrackId;
        this.created_date = formatDateToIST(new Date());
        this.updated_date = formatDateToIST(new Date());
        next();
    } catch (err) {
        console.error("Error in generating nature_of_business_id:", err);
        next(err);
    }
});

module.exports = mongoose.model("nature_of_business_master", natureofBusinessMasterSchema);