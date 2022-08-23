import pkg from 'mongoose';
const { Schema, model } = pkg
const batteryDataSchema = new Schema({
    batteryNumber: Number,
    timeOut: String,
    beakBefore: {
        rint: Number,
        soc: Number,
    },
    timeIn: String,
    beakAfter: {
        rint: Number,
        soc: Number,
    },
    purpose: String,
    subgroup: String,
    updated: Boolean,
    row: Number,
    signedOut: Boolean,
});
const batteryDataModel = model('batteryData', batteryDataSchema, 'batteryDataLogs');
export default batteryDataModel;