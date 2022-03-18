const { Schema, model } = require('mongoose');

batteryDataSchema = new Schema({
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
    updated: Boolean,
    row: Number,
    signedOut: Boolean,
});

const batteryDataModel = model('batteryData', batteryDataSchema, 'batteryDataLogs')

module.exports = batteryDataModel; 